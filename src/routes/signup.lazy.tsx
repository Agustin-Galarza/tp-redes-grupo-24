import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { amplifyClient } from "../amplifyClient";

export const Route = createLazyFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  let router = useRouter();
  let signup = useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      amplifyClient.models.User.create({
        owner: router.options.context.user.userId,
        username,
      });
    },
    onSuccess: () => {
      router.history.back();
    },
  });

  return (
    <main>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signup.mutate({ username: e.currentTarget.username.value });
        }}
      >
        <h2>Username</h2>
        <input type="text" name="username"></input>
        <button type="submit">Signup</button>
      </form>
    </main>
  );
}
