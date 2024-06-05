import { Link, createFileRoute } from "@tanstack/react-router";
import { Post } from "../components/post";
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

const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["posts", { postId }],
    queryFn: async () => {
      let data = await amplifyClient.models.Post.get(
        { id: postId },
        {
          selectionSet: [
            "id",
            "owner",
            "title",
            "content",
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
      if (!data.author) coalesceAuthor(data);
      for (let comment of data.comments) {
        if (!comment.author) coalesceAuthor(comment);
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
      <Link to="/">GO BACK</Link>

      <Post post={post} />

      <h1>Comments</h1>

      {post.comments.map((comment) => (
        <div key={comment.id}>
          <h3>
            {comment.author.name}: {comment.content}
          </h3>
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
