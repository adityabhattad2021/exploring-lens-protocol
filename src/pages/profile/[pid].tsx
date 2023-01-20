import FeedPost from "@/src/components/FeedPost";
import {
	LENS_CONTRACT_ABI,
	LENS_CONTRACT_ADDRESS,
} from "@/src/const/contracts";
import { useProfileQuery, usePublicationsQuery } from "@/src/graphql/generated";
import { useFollow } from "@/src/lib/useFollow";
import { MediaRenderer, Web3Button } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import styles from "../../styles/Profile.module.css";

type Props = {};

export default function Profile({}: Props) {
	const router = useRouter();

	const { pid } = router.query;

	const { mutateAsync: followUser } = useFollow();

	const {
		isLoading: loadingProfile,
		data: profileData,
		error: profileError,
	} = useProfileQuery(
		{
			request: {
				handle: pid,
			},
		},
		{
			enabled: !!pid,
		}
	);

	const {
		isLoading: isLoadingPublications,
		data: publicationsData,
		error: publicationsError,
	} = usePublicationsQuery(
		{
			request: {
				profileId: profileData?.profile?.id,
			},
		},
		{
			enabled: !!profileData?.profile?.id,
		}
	);

	if (profileError || publicationsError) {
		return <div>Could not find this Account.</div>;
	}

	if (loadingProfile) {
		return <div>Loading Profile...</div>;
	}

	return (
		<div className={styles.profileContainer}>
			<div className={styles.profileContentContainer}>
				{/* Cover Image */}
				{
					// @ts-ignore
					profileData?.profile?.coverPicture?.original?.url && (
						<div className={styles.coverImageContainer}>
							<MediaRenderer
								src={
									// @ts-ignore
									profileData?.profile?.coverPicture?.original
										.url
								}
								alt={profileData?.profile?.name || ""}
								className={styles.coverImageContainer}
							/>
						</div>
					)
				}

				{/* Profile Picture */}
				{
					// @ts-ignore
					profileData?.profile?.picture?.original.url && (
						<div>
							<MediaRenderer
								// @ts-ignore
								src={
									profileData?.profile?.picture?.original.url || ""
								}
								alt={
									profileData.profile.name ||
									profileData.profile.handle ||
									""
								}
								className={styles.profilePictureContainer}
							/>
						</div>
					)
				}

				{/* Profile Name */}
				<h1 className={styles.profileName}>
					{profileData?.profile?.name || "Anon User"}
				</h1>

				{/* Profile Handle */}
				<p className={styles.profileHandle}>
					{profileData?.profile?.handle || "anonuser"}
				</p>

				{/* Profile Description */}
				<p className={styles.profileDescription}>
					{profileData?.profile?.bio || "Some Cool Lens User"}
				</p>

				<p className={styles.followerCount}>
					{profileData?.profile?.stats.totalFollowers} {" Followers"}
				</p>

				<Web3Button
					contractAddress={LENS_CONTRACT_ADDRESS}
					contractAbi={LENS_CONTRACT_ABI}
					action={async () => await followUser(profileData?.profile?.id)}
				>
					Follow this User
				</Web3Button>

				<div className={styles.publicationContainer}>
					{isLoadingPublications ? (
						<div>Loading Publications</div>
					) : (
						publicationsData?.publications.items.map(
							(publication) => (
								<FeedPost
									publication={publication}
									key={publication.id}
								/>
							)
						)
					)}
				</div>
			</div>
		</div>
	);
}
