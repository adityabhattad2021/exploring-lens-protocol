import { useMutation } from "@tanstack/react-query";
import { useSDK, useStorageUpload } from "@thirdweb-dev/react";
import {
	PublicationMainFocus,
	useCreatePostTypedDataMutation,
} from "../graphql/generated";
import useLensUser from "./auth/useLensUser";
import { signTypedDataWithOmmitedTypename, splitSignature } from "./helpers";
import { v4 as uuidv4 } from "uuid";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../const/contracts";
import useLogin from "./auth/useLogin";

type CreatePostArgs = {
	image: File;
	title: string;
	description: string;
	content: string;
};

export default function useCreatePost() {
	const { mutateAsync: requestTypedData } = useCreatePostTypedDataMutation();
	const { mutateAsync: uploadToIPFS } = useStorageUpload();
	const { profileQuery } = useLensUser();
	const sdk = useSDK();
    const {mutateAsync:loginUser}=useLogin();

	async function createPost({
		image,
		title,
		description,
		content,
	}: CreatePostArgs) {

        // Login the User first
        await loginUser();

		// Upload image to IPFS
		const imageIpfsURL = (await uploadToIPFS({ data: [image] }))[0];

		// Upload the actual content to IPFS
		const postMetadata = {
			version: "2.0.0",
			mainContentFocus: PublicationMainFocus.TextOnly,
			metadata_id: uuidv4(),
			description: description,
			locale: "en-IN",
			content: content,
			external_url: null,
			image: imageIpfsURL,
			imageMimeType: null,
			name: title,
			attributes: [],
			tags: [],
		};

		const postMetadataIpfsURL = (
			await uploadToIPFS({ data: [postMetadata] })
		)[0];

		console.log({ imageIpfsURL, postMetadataIpfsURL });

		// Ask lens to give us the typed data
		const typedData = await requestTypedData({
			request: {
				collectModule: {
					freeCollectModule: {
						followerOnly: false,
					},
				},
				referenceModule: {
					followerOnlyReferenceModule: false,
				},
				contentURI: postMetadataIpfsURL,
				profileId: profileQuery.data?.defaultProfile?.id,
			},
		});

		const { domain, types, value } =
			typedData.createPostTypedData.typedData;

		if (!sdk) {
			return;
		}

		// Sign the typed data
		const signature = await signTypedDataWithOmmitedTypename(
			sdk,
			domain,
			types,
			value
		);

		const { v, r, s } = splitSignature(signature.signature);

		// Use the signed typed data to send the transection to the smart contract
		const lensHubContract = await sdk.getContractFromAbi(
			LENS_CONTRACT_ADDRESS,
			LENS_CONTRACT_ABI
		);

		const {
			collectModule,
			collectModuleInitData,
			contentURI,
			deadline,
			profileId,
			referenceModule,
			referenceModuleInitData,
		} = typedData.createPostTypedData.typedData.value;

		const result = await lensHubContract.call("postWithSig", {
			profileId: profileId,
			contentURI: contentURI,
			collectModule: collectModule,
			collectModuleInitData: collectModuleInitData,
			referenceModule: referenceModule,
			referenceModuleInitData: referenceModuleInitData,
			sig: {
				v,
				r,
				s,
				deadline: deadline,
			},
		});

		console.log(result);
	}

	return useMutation(createPost);
}
