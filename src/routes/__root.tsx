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
  signOut: () => void;
}>()({
  component: RootRoute,
});

function RootRoute() {
  const {
    options: {
      context: { user, signOut },
    },
  } = useRouter();

  return (
    <main className="bg-neutral-950 min-h-screen">
      <div className="max-w-md mx-auto">
        <nav className="py-2 flex items-center justify-between text-sm mb-4 text-neutral-200">
          {user?.signInDetails?.loginId ?? "Anonymous"}
          <button
            className="bg-neutral-300 text-neutral-900 px-3 py-2 rounded-lg hover:bg-neutral-200 duration-300 ease-in-out transition-colors"
            onClick={signOut}
          >
            Sign out
          </button>
        </nav>

        <Outlet />

        <TanStackRouterDevtools />
      </div>
    </main>
  );
}
