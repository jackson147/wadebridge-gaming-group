"use client";

import { useSession, signOut } from "next-auth/react";
import { SignInModal } from "./SignInModal";

export function AuthShowcase() {
  const { data: session } = useSession();

  if (!session) {
    return <SignInModal />;
  }

	return (
		<div className="flex items-center gap-4">
			<p className="text-center text-white">
				{session && <span>Logged in as {session.user?.name}</span>}
			</p>
			<form
				action={() => {
          void signOut();
				}}
			>
				<button className="rounded-full bg-white/10 px-6 py-2 font-semibold no-underline transition hover:bg-white/20">
					Sign out
				</button>
			</form>
		</div>
	);
}