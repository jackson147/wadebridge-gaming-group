import { auth, signIn, signOut } from "~/server/auth";

export async function AuthShowcase() {
	const session = await auth();

	if (!session) {
		return (
			<form
				action={async () => {
					"use server";
					await signIn("discord", { redirectTo: "/" });
				}}
			>
				<button className="rounded-full bg-white/10 px-6 py-2 font-semibold no-underline transition hover:bg-white/20">
					Sign in with Discord
				</button>
			</form>
		);
	}

	return (
		<div className="flex items-center gap-4">
			<p className="text-center text-white">
				{session && <span>Logged in as {session.user?.name}</span>}
			</p>
			<form
				action={async () => {
					"use server";
					await signOut();
				}}
			>
				<button className="rounded-full bg-white/10 px-6 py-2 font-semibold no-underline transition hover:bg-white/20">
					Sign out
				</button>
			</form>
		</div>
	);
}