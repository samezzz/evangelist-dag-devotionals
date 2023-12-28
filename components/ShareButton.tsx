"use client";

import { FacebookIcon, LinkedinIcon, Share } from "lucide-react";
import {
	FacebookShareButton,
	TwitterShareButton,
	LinkedinShareButton,
	WhatsappShareButton,
	TelegramShareButton,
} from "react-share";
import React, { useContext } from "react";
import {
	AlertDialogTrigger,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogContent,
	AlertDialog,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { TelegramIcon, WhatsappIcon, XIconDark, XIconLight } from "./Icons";
import { ThemeProvider } from "./ThemeProvider";

interface ShareButtonProps {
	id: string;
}

const ShareButton = ({ id }: ShareButtonProps) => {
	return (
		<div
			onClick={(e) => {
				e.preventDefault();
			}}
			className="flex items-center text-center gap-x-2 text-xs border border-none hover:bg-transparent shadow-none"
		>
			<ShareDialog id={id} />
		</div>
	);
};

export default ShareButton;

interface ShareDialogProp {
	id: string;
}

function ShareDialog({ id }: ShareDialogProp) {
	let isLightMode;

	const url = "https://evangelist-dag-devotionals.vercel.app";
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<button className="p-0 m-0">
					<Share className="h-4 w-4 text-[#71767B] hover:text-gray-90 hover:dark:text-gray-20" />
				</button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Share this post</AlertDialogTitle>
					<AlertDialogDescription className="mt-2">
						Choose a social media platform to share this post.
					</AlertDialogDescription>
					<AlertDialogDescription className="flex justify-center md:justify-start gap-x-4">
						<WhatsappShareButton url={`${url}/posts/${id}`}>
							<WhatsappIcon className="w-6 h-6" />
						</WhatsappShareButton>
						<FacebookShareButton url={`${url}/posts/${id}`}>
							<FacebookIcon className="w-6 h-6 text-[#316FF6]" />
						</FacebookShareButton>
						<TwitterShareButton url={`${url}/posts/${id}`}>
							{isLightMode ? (
								<XIconDark className="w-6 h-6" />
							) : (
								<XIconLight className="w-6 h-6" />
							)}
						</TwitterShareButton>
						<LinkedinShareButton url={`${url}/posts/${id}`}>
							<LinkedinIcon className="w-6 h-6 text-[#0C63BC]" />
						</LinkedinShareButton>
						<TelegramShareButton url={`${url}/posts/${id}`}>
							<TelegramIcon className="w-6 h-6" />
						</TelegramShareButton>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
