import {fetcher} from "../../graphql/auth-fetcher"
import {
    ChallengeQuery,
    ChallengeQueryVariables,
    ChallengeDocument
} from "../../graphql/generated"


export default async function generatedChallenge(address: string){
    return await fetcher<ChallengeQuery,ChallengeQueryVariables>(
        ChallengeDocument,
        {
            request:{
                address,
            }
        }
    )();
}