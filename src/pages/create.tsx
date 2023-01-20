import { Web3Button } from "@thirdweb-dev/react";
import React, { useState } from "react";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../const/contracts";
import useCreatePost from "../lib/useCreatePost";
import styles from "../styles/Create.module.css";

export default function Create() {
	const [image, setImage] = useState<File | null>(null);
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [content, setContent] = useState<string>("");

	const { mutateAsync: createPost } = useCreatePost();

	return (
		<div>
			<div className={styles.formContainer}>
				{/* Input for the Image */}
				<div className={styles.inputContainer}>
					<input
						type="file"
						onChange={(e) => {
							if (e.target.files) {
								setImage(e.target.files[0]);
							}
						}}
					/>
				</div>

				{/* Input for title */}
				<div className={styles.inputContainer}>
					<input
						type="text"
						value={title}
						placeholder="Title"
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				{/* Input for description  */}
				<div className={styles.inputContainer}>
					<textarea
						value={description}
						placeholder="Description"
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>

				<div className={styles.inputContainer}>
					<textarea
						value={content}
						placeholder="Content"
						onChange={(e) => setContent(e.target.value)}
					/>
				</div>

				<Web3Button
					contractAddress={LENS_CONTRACT_ADDRESS}
					contractAbi={LENS_CONTRACT_ABI}
					action={async () => {
						if (!image) {
							return;
						}

						return await createPost({
							image,
							title,
							description,
							content,
						});
					}}
				>
					Create Post
				</Web3Button>
			</div>
		</div>
	);
}
