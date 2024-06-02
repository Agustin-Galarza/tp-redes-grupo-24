import { createFileRoute } from "@tanstack/react-router";
import { postQueryOptions } from "../postQueryOptions";
import { Post } from "../components/post";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { amplifyClient } from "../amplifyClient";
import { redirectOnNotRegistered } from "../session";

export const Route = createFileRoute("/posts/$postId")({
  beforeLoad: redirectOnNotRegistered,
  loader: async ({ context: { queryClient }, params: { postId } }) => {
    return queryClient.ensureQueryData(postQueryOptions(postId));
  },
  component: PostComponent,
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
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
    },
  });

  return (
    <div>
      <Post post={post} />

      <h1>Comments</h1>

      {post.comments.map((comment) => (
        <div>
          <h2>{comment.author.username}</h2>
          <h3>{comment.content}</h3>
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate({
            postId,
            postOwnerId: post?.owner!,
            content: e.currentTarget.content.value,
          });
        }}
      >
        <h2>Comment</h2>
        <input type="text" name="content"></input>
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
