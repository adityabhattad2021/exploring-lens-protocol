import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import Header from "../components/Header";

const desiredChainId = ChainId.Polygon;

export default function App({ Component, pageProps }: AppProps) {
	const queryClient = new QueryClient();

	return (
		<ThirdwebProvider desiredChainId={desiredChainId}>
			<QueryClientProvider client={queryClient}>
				<Header/>
				<Component {...pageProps} />
			</QueryClientProvider>
		</ThirdwebProvider>
	);
}
