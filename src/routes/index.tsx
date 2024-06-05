import "@aws-amplify/ui-react/styles.css";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { amplifyClient } from "../amplifyClient";
import { Post } from "../components/post";
import { redirectOnNotRegistered } from "../session";
import { Loading } from "../components/loading";
import { coalesceAuthor, makeMutable } from "../fixes";

const postsQueryOptions = () =>
  queryOptions({
    queryKey: ["posts"],
    queryFn: async () => {
      const data = await amplifyClient.models.Post.list({
        selectionSet: [
          "id",
          "title",
          "content",
          "owner",
          "author.name",
          "author.id",
        ],
      })
        .then((d) => d.data!)
        .then(makeMutable);
      for (const post of data) {
        coalesceAuthor(post);
      }
      return data;
    },
  });

export const Route = createFileRoute("/")({
  beforeLoad: redirectOnNotRegistered,
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(postsQueryOptions());
  },
  component: Index,
  pendingComponent: () => <Loading />,
});

function Index() {
  const { data: posts } = useSuspenseQuery(postsQueryOptions());
  const queryClient = useQueryClient();

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await amplifyClient.models.Post.create({
      content: e.currentTarget.postContent.value,
      title: e.currentTarget.postTitle.value,
    });
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }

  const navigate = useNavigate();

  return (
    <>
      <h1 className="mb-4 text-neutral-100 font-bold text-4xl">Posts</h1>

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onClick={() => {
                navigate({
                  to: "/posts/$postId",
                  params: { postId: post.id },
                });
              }}
            />
          ))}
        </div>

        <form
          className="flex flex-col gap-4 border-neutral-800 border-[1px] p-6 rounded-lg border-solid"
          onSubmit={create}
        >
          <label className="text-neutral-200 text-sm flex flex-col gap-1">
            Title
            <input
              required
              className="focus:ring-2 outline-none focus:ring-blue-500 bg-transparent border-neutral-700 border-[1px] p-2 rounded-lg"
              type="text"
              name="postTitle"
              placeholder="Title"
            />
          </label>
          <label className="text-neutral-200 text-sm flex flex-col gap-1">
            Content
            <input
              required
              className="focus:ring-2 outline-none focus:ring-blue-500 bg-transparent border-neutral-700 border-[1px] p-2 rounded-lg"
              type="text"
              name="postContent"
              placeholder="Content"
            />
          </label>

          <button
            className="bg-neutral-100 rounded-lg py-2 hover:bg-neutral-200 transition-colors duration-300 ease-in-out"
            type="submit"
          >
            Create
          </button>
        </form>
      </section>
    </>
  );
}
