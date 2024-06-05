import { Link, createFileRoute } from "@tanstack/react-router";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { amplifyClient } from "../amplifyClient";
import { redirectOnNotRegistered } from "../session";
import { queryOptions } from "@tanstack/react-query";
import { Loading } from "../components/loading";
import { coalesceAuthor, makeMutable } from "../fixes";
import { ChevronLeft } from "lucide-react";

const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["posts", { postId }],
    queryFn: async () => {
      const data = await amplifyClient.models.Post.get(
        { id: postId },
        {
          selectionSet: [
            "id",
            "owner",
            "title",
            "content",
            "author.id",
            "author.name",
            "comments.id",
            "comments.owner",
            "comments.content",
            "comments.author.id",
            "comments.author.name",
          ],
        }
      )
        .then((d) => d.data!)
        .then(makeMutable);
      coalesceAuthor(data);
      for (const comment of data.comments) {
        coalesceAuthor(comment);
      }
      return data;
    },
  });

export const Route = createFileRoute("/posts/$postId")({
  beforeLoad: redirectOnNotRegistered,
  loader: async ({ context: { queryClient }, params: { postId } }) => {
    return queryClient.ensureQueryData(postQueryOptions(postId));
  },
  component: PostComponent,
  pendingComponent: () => <Loading />,
});

async function postComment({
  postId,
  postOwnerId,
  content,
}: {
  postId: string;
  postOwnerId: string;
  content: string;
}) {
  await amplifyClient.models.Comment.create({
    postId,
    postOwnerId,
    content,
  });
}

function PostComponent() {
  const postId = Route.useParams().postId;
  const { data: post } = useSuspenseQuery(postQueryOptions(postId));
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", { postId }] });
    },
  });

  return (
    <div>
      <Link
        className="flex items-center gap-1  w-fit text-neutral-100 text-sm hover:underline mb-8"
        to="/"
      >
        <ChevronLeft size={16} />
        Go back
      </Link>

      <div className="mb-8">
        <h1 className="text-neutral-100 text-4xl font-bold mb-2">
          {post.title}
        </h1>
        <p className="text-neutral-200 text-base mb-4">{post.content}</p>
        <h2 className="text-neutral-200 text-sm ">{post.author.name}</h2>
      </div>

      <h2 className="mb-2 text-neutral-300 text-xl font-semibold">Comments</h2>
      {post.comments.length === 0 ? (
        <span className="mb-10 text-neutral-400 text-sm text-center w-full block">
          No comments
        </span>
      ) : (
        <div className="mb-10 flex flex-col gap-2">
          {post.comments.map((comment) => (
            <div key={comment.id}>
              <p className="text-neutral-200">
                <Link
                  to={
                    comment.author.id
                      ? `/users/${comment.author.id}`
                      : undefined
                  }
                  className="text-neutral-100 font-bold mr-2"
                >
                  - {comment.author.name}:
                </Link>
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      <form
        className="flex flex-col gap-4 border-neutral-800 border-[1px] p-6 rounded-lg border-solid"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate({
            postId,
            postOwnerId: post?.owner ?? "anonimo",
            content: e.currentTarget.content.value,
          });
        }}
      >
        <label className="text-neutral-200 text-sm flex flex-col gap-1">
          Comment
          <input
            required
            className="focus:ring-2 outline-none focus:ring-blue-500 bg-transparent border-neutral-700 border-[1px] p-2 rounded-lg"
            type="text"
            name="content"
            placeholder="comment"
          />
        </label>
        <button
          className="bg-neutral-100 rounded-lg py-2 hover:bg-neutral-200 transition-colors duration-300 ease-in-out"
          type="submit"
        >
          Post
        </button>
      </form>
    </div>
  );
}
