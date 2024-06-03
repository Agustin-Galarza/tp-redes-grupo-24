import "@aws-amplify/ui-react/styles.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { amplifyClient } from "../amplifyClient";
import { Post } from "../components/post";
import { redirectOnNotRegistered } from "../session";

export const Route = createFileRoute("/")({
  beforeLoad: redirectOnNotRegistered,
  component: Index,
});

function Index() {
  let posts = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      amplifyClient.models.Post.list({
        selectionSet: ["id", "title", "content", "owner", "author.username"],
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

  let navigate = useNavigate();

  return (
    <main>
      {posts.isLoading
        ? "loading"
        : posts.data
          ? posts.data.data.map((post) => (
            <Post
              key={post.id}
              post={post}
              onClick={() =>
                {
                  console.log("AAAAAA");
                  navigate({
                    to: "/posts/$postId",
                    params: { postId: post.id },
                  })
                }
              }
            />
          ))
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
