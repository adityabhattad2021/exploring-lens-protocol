import { fetcher } from "@/src/graphql/auth-fetcher";
import { RefreshDocument, RefreshMutation, RefreshMutationVariables } from "@/src/graphql/generated";
import { readAccessToken, setAccessToken } from "./helpers";

export default async function refreshAccessToken(){
    // 1. Get our current refresh token from locl storage.
    const currentRefreshToken = readAccessToken()?.refreshToken;

    if(!currentRefreshToken){
        return null;
    }

    // 2. Send it to lens to ask for new access token.
    const result = await fetcher<RefreshMutation,RefreshMutationVariables>(
        RefreshDocument,
        {
            request:{
                refreshToken:currentRefreshToken,
            }
        }
    )();

    // 3. Set the new access token in local storage.
    const {accessToken,refreshToken:newRefreshToken}=result?.refresh;
    setAccessToken(accessToken,newRefreshToken);

    return accessToken as string;

}