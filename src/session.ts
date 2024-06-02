import { redirect } from "@tanstack/react-router";
import { amplifyClient } from "./amplifyClient";
import { AuthUser } from "@aws-amplify/auth";

export async function isSignedUp(cognitoId: string) {
  let user = await amplifyClient.models.User.get({ id: cognitoId });
  user.data !== null;
}

export async function redirectOnNotRegistered({
  context: { user },
}: {
  context: { user: AuthUser };
}) {
  if (!isSignedUp(user?.userId)) throw redirect({ to: "/signup" });
}
