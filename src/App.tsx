import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useQuery } from "@tanstack/react-query";
import { FormEvent } from "react";

const client = generateClient<Schema>();

function App() {
  let posts = useQuery({
    queryKey: ["posts"],
    queryFn: () => client.models.Post.list(),
  });

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await client.models.Post.create({
      content: e.currentTarget.postContent.value,
      title: e.currentTarget.postTitle.value,
    });
    posts.refetch();
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>My APP - {user?.signInDetails?.loginId ?? "Anonymous"}</h1>

          {posts.isLoading
            ? "loading"
            : posts.data
              ? posts.data.data.map((post) => (
                <div>
                  <h1>{post.title}</h1>
                  <span>{post.content}</span>
                </div>
              ))
              : `error: ${posts.error}`}

          <form onSubmit={create}>
            <h2>Title</h2>
            <input type="text" name="postTitle"></input>
            <h2>Content</h2>
            <input type="text" name="postContent"></input>
            <button type="submit">Create</button>
          </form>

          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
