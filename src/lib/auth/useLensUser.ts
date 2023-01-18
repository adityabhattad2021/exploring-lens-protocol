import { useDefaultProfileQuery } from "@/src/graphql/generated";
import { useQuery } from "@tanstack/react-query";
import { useAddress } from "@thirdweb-dev/react";
import { profile } from "console";
import { readAccessToken } from "./helpers";

export default function useLensUser() {
	// 1. Make a react query for local storage key.
	const address = useAddress();

	const localStorageQuery = useQuery(
		["lens-user", address],
		// Writing the actual function to check the local storage.
		() => {
			const token = readAccessToken();
			return token;
		}
	);

	// If there is a connected wallet address, then we can ask for default profile from lens.
	const profileQuery = useDefaultProfileQuery(
		{
			request: {
				ethereumAddress: address,
			},
		},
		{
			enabled: address !== "undefined",
		}
	);

    console.log(profileQuery.data?.defaultProfile);

	return {
		// Contains information about both the local storage and the information about the lens profile.
		isSignedInQuery: localStorageQuery,
		profileQuery: profileQuery,
	};
}
