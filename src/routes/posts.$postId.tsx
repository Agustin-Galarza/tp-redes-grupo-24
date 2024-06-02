import { createFileRoute } from "@tanstack/react-router";
import { postQueryOptions } from "../postQueryOptions";
import { Post } from "../components/post";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/posts/$postId")({
  loader: async ({ context: { queryClient }, params: { postId } }) => {
    return queryClient.ensureQueryData(postQueryOptions(postId));
  },
  component: PostComponent,
});

function PostComponent() {
  const postId = Route.useParams().postId;
  const { data: post } = useSuspenseQuery(postQueryOptions(postId));

  return (
    <div>
      <Post post={post.data!} />
    </div>
  );
}
