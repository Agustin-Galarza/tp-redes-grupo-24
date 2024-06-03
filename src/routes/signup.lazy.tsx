import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { amplifyClient } from "../amplifyClient";

export const Route = createLazyFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  let router = useRouter();
  let signup = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      amplifyClient.models.User.create({
        id: router.options.context.user.userId,
        name,
      });
    },
    onSuccess: () => {
      router.navigate({ to: "/" });
    },
  });

  return (
    <main>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signup.mutate({ name: e.currentTarget.username.value });
        }}
      >
        <h2>Username</h2>
        <input type="text" name="username"></input>
        <button type="submit">Signup</button>
      </form>
    </main>
  );
}
