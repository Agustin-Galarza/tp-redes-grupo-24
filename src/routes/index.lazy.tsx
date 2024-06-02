import "@aws-amplify/ui-react/styles.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { amplifyClient } from "../amplifyClient";
import { Post } from "../components/post";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  let posts = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      amplifyClient.models.Post.list({
        selectionSet: ["title", "content", "author.name"],
      }),
  });
  let queryClient = useQueryClient();

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await amplifyClient.models.Post.create({
      content: e.currentTarget.postContent.value,
      title: e.currentTarget.postTitle.value,
    });
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }

  return (
    <main>
      {posts.isLoading
        ? "loading"
        : posts.data
          ? posts.data.data.map((post) => <Post post={post} />)
          : `error: ${posts.error}`}

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
