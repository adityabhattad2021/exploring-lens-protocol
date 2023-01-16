import { useAuthenticateMutation } from "@/src/graphql/generated";
import { useMutation } from "@tanstack/react-query";
import { useAddress, useSDK } from "@thirdweb-dev/react";
import generatedChallenge from "./generateChallenge";
import { setAccessToken } from "./helpers";


export default function useLogin() {
	const address = useAddress();
	const sdk = useSDK();
	const { mutateAsync: sendSignedMessage } = useAuthenticateMutation();

	// 1. Write the actual async function.
	async function login() {
		// 0. Make sure the user has connected the wallet.
		if (!address) {
			return;
		}

		// 1. Generate challenge which comes from the lens API.
		const { challenge } = await generatedChallenge(address);

		// 2. Sign the challenge with the user's wallet.
		const signature = await sdk?.wallet.sign(challenge.text);

		// 3. Send the signed challenge to the Lens API.
		const { authenticate } = await sendSignedMessage({
			request: {
				address,
				signature,
			},
		});

        console.log("Authenticated: ",authenticate);

        // 4. Recieve a access token from the Lens API, If we succeed.  (the access token will be inside authenticate.)
        const {accessToken,refreshToken}=authenticate;

        // 5. Store the access token inside local storage so we can use it.
        setAccessToken(accessToken,refreshToken);
        
	}

	// 2. Return the useMutation hook wrapping the async function.
    return useMutation(login);
}
