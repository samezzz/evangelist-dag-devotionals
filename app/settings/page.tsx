import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/Header";
import { DashboardShell } from "@/components/Shell";
import { UserNameForm } from "@/components/UserNameForm";
import PageHeader from "@/components/PageHeader";

export const metadata = {
	title: "Settings",
	description: "Manage account and website settings.",
};

export default async function SettingsPage() {
	const user = await getCurrentUser();

	if (!user) {
		redirect(authOptions?.pages?.signIn || "/login");
	}

	return (
		<section className="max-w-[1280px] mx-auto px-4 mt-16 min-h-screen">
			<PageHeader title="Settings" description="" />
			<div className="mt-12">
				<UserNameForm user={{ id: user.id, name: user.name || "" }} />
			</div>
		</section>
	);
}
