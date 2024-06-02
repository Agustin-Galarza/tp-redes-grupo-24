import { AuthUser } from "@aws-amplify/auth";
import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user: AuthUser;
  signOut: any;
}>()({
  component: RootRoute,
});

function RootRoute() {
  //let { signOut, user } = useRouteContext({
    //from: "/",
  //});
  let {options: {context: {user, signOut}}} = useRouter();

  return (
    <>
      <h1>My APP - {user?.signInDetails?.loginId ?? "Anonymous"}</h1>

      <Outlet />

      <button onClick={signOut}>Sign out</button>

      <TanStackRouterDevtools />
    </>
  );
}
