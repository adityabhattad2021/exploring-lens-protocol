import {
	ChainId,
	ConnectWallet,
	useAddress,
	useNetwork,
	useNetworkMismatch,
} from "@thirdweb-dev/react";
import React from "react";

type Props = {};

export default function SignInButton({}: Props) {
	const address = useAddress(); // Detect the connected address
	const isUserOnWrongNetwork = useNetworkMismatch(); // Detect if the user is on the wrong network
	const [, switchNetwork] = useNetwork(); // Function to switch the network

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
    


	// 4. Show the user their profile on Lens.
}
