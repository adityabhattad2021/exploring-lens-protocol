import { fetcher } from "@/src/graphql/auth-fetcher";
import {
	RefreshDocument,
	RefreshMutation,
	RefreshMutationVariables,
} from "@/src/graphql/generated";
import { readAccessToken, setAccessToken } from "./helpers";

const endpoint = "https://api.lens.dev/";

export default async function refreshAccessToken() {
	// 1. Get our current refresh token from locl storage.
	const currentRefreshToken = readAccessToken()?.refreshToken;

	if (!currentRefreshToken) {
		return null;
	}

	async function fetchData<TData, TVariables>(
		query: string,
		variables?: TVariables,
		options?: RequestInit["headers"]
	): Promise<TData> {
		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...options,
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				query,
				variables,
			}),
		});

		const json = await response.json();

		if (json.errors) {
			const { message } = json.errors[0] || {};
			throw new Error(message || "Error...");
		}

		return json.data;
	}

	const result = await fetchData<RefreshMutation, RefreshMutationVariables>(
		RefreshDocument,
		{
			request: {
				refreshToken: currentRefreshToken,
			},
		}
	);

	const {
		refresh: { accessToken, refreshToken: newRefreshToken },
	} = result;

	// 2. Set the new access token in local storage.
	setAccessToken(accessToken, newRefreshToken);

	return accessToken as string;
}
