import {
	ChainId,
	ConnectWallet,
	useAddress,
	useNetwork,
	useNetworkMismatch,
} from "@thirdweb-dev/react";
import { profile } from "console";
import React from "react";
import useLensUser from "../lib/auth/useLensUser";
import useLogin from "../lib/auth/useLogin";

type Props = {};

export default function SignInButton({}: Props) {
	const address = useAddress(); // Detect the connected address
	const isUserOnWrongNetwork = useNetworkMismatch(); // Detect if the user is on the wrong network
	const [, switchNetwork] = useNetwork(); // Function to switch the network
	const { isSignedInQuery, profileQuery } = useLensUser();
	const { mutate: requestLogin } = useLogin();

	// 1. User needs to connect their wallet.
	if (!address) {
		return <ConnectWallet />;
	}

	// 2. User needs to switch network to the Polygon Mainnet.
	if (isUserOnWrongNetwork) {
		return (
			<button onClick={() => switchNetwork?.(ChainId.Polygon)}>
				Switch Network
			</button>
		);
	}

	// 3. Sign In with lens.

	// Loading their signed in state.
	if (isSignedInQuery.isLoading) {
		return <div>Loading...</div>;
	}

	// If the user is not signed in, we need to request a login
	if (!isSignedInQuery.data) {
		return (
			<button onClick={() => requestLogin()}>Sign In with Lens</button>
		);
	}

	// 4. Show the user their profile on Lens.

	// Loading the lens profile inforamtion.
	if (profileQuery.isLoading) {
		return <div>Loading...</div>;
	}

	// if it's done loading and there's no default profile
	if (!profileQuery.data?.defaultProfile) {
		return <div>No Lens Profile found.</div>;
	}

	// if it's done loading and there's a default profile
	if(profileQuery.data?.defaultProfile){
		return <div>Hello {profileQuery.data?.defaultProfile?.handle}</div>
	}

	return (
		<div>
			Something went wrong.
		</div>
	);
}
