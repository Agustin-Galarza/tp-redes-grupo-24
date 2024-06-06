import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { amplifyClient } from "../amplifyClient";

export const Route = createLazyFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const router = useRouter();
  const signup = useMutation({
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
    <main className=" flex-1 flex items-center justify-center">
      <form
        className="flex flex-col gap-4 border-neutral-800 border-[1px] p-6 rounded-lg border-solid w-full"
        onSubmit={(e) => {
          e.preventDefault();
          signup.mutate({ name: e.currentTarget.username.value });
        }}
      >
        <label className="text-neutral-200 text-sm flex flex-col gap-1">
          Username
          <input
            required
            className="focus:ring-2 outline-none focus:ring-blue-500 bg-transparent border-neutral-700 border-[1px] p-2 rounded-lg"
            type="text"
            name="username"
            placeholder="Username"
          />
        </label>

        <button
          className="bg-neutral-100 rounded-lg py-2 hover:bg-neutral-200 transition-colors duration-300 ease-in-out"
          type="submit"
        >
          Start
        </button>
      </form>
    </main>
  );
}
