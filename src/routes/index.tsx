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
      let data = await amplifyClient.models.Post.list({
        selectionSet: ["id", "title", "content", "owner", "author.name"],
      })
        .then((d) => d.data!)
        .then(makeMutable);
      for (let post of data) {
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
  let { data: posts } = useSuspenseQuery(postsQueryOptions());
  let queryClient = useQueryClient();

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await amplifyClient.models.Post.create({
      content: e.currentTarget.postContent.value,
      title: e.currentTarget.postTitle.value,
    });
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }

  let navigate = useNavigate();

  return (
    <main>
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

      <form onSubmit={create}>
        <h2>Title</h2>
        <input type="text" name="postTitle"></input>
        <h2>Content</h2>
        <input type="text" name="postContent"></input>
        <button type="submit">Create</button>
      </form>
    </main>
  );
}
