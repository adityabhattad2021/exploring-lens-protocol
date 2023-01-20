import Link from "next/link";
import React from "react";
import styles from "../styles/Header.module.css";
import SignInButton from "./SignInButton";

export default function Header() {
	return (
		<>
			<div className={styles.headerContainer}>
				<div className={styles.left}>
					<Link href={"/"}>
                        <h1 className={styles.home}>Home</h1>
                    </Link>
					<Link href={"/create"}>
						<h3>Create Post</h3>
					</Link>
				</div>
				<div className={styles.right}>
					<SignInButton />
				</div>
			</div>
			<div style={{ height: "64px" }}></div>
		</>
	);
}
