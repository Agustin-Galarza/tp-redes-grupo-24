import { Authenticator } from "@aws-amplify/ui-react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <h1>My APP - {user?.signInDetails?.loginId ?? "Anonymous"}</h1>

          <Outlet />

          <button onClick={signOut}>Sign out</button>

          <TanStackRouterDevtools />
        </>
      )}
    </Authenticator>
  ),
});
