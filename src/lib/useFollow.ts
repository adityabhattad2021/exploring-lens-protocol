import { useMutation } from "@tanstack/react-query";
import { useAddress, useSDK } from "@thirdweb-dev/react";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../const/contracts";
import { useCreateFollowTypedDataMutation } from "../graphql/generated";
import useLogin from "./auth/useLogin";
import { signTypedDataWithOmmitedTypename, splitSignature } from "./helpers";

export function useFollow() {
	const { mutateAsync: requestTypedData } =
		useCreateFollowTypedDataMutation();
	const sdk = useSDK();
	const address = useAddress();
    const {mutateAsync:loginUser}=useLogin();

	async function follow(userId: string) {

        await loginUser();

		// Use the auto generated mutation called "usecreateFollowTypedData" to get the typed data for the user to sign.
		const typedData = await requestTypedData({
			request: {
				follow: [
					{
						profile: userId,
					},
				],
			},
		});

		const { domain, types, value } =
			typedData.createFollowTypedData.typedData;

		if (!sdk) {
			return;
		}

		// Sign the typed data using SDK
		const signature = await signTypedDataWithOmmitedTypename(
			sdk,
			domain,
			types,
			value
		);

		const { v, r, s } = splitSignature(signature.signature);

		// Send the typed data to the smart contract to perform the write operation on the blockchain
		const lensHubContract = await sdk.getContractFromAbi(
			LENS_CONTRACT_ADDRESS,
			LENS_CONTRACT_ABI
		);

		const result = await lensHubContract.call("followWithSig", {
			follower: address,
			profileIds: [userId],
			datas: value.datas,
			sig: {
				v,
				r,
				s,
				deadline: value.deadline,
			},
		});

		console.log(result);
	}

	return useMutation(follow);
}
