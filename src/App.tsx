import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useQuery } from "@tanstack/react-query";

const client = generateClient<Schema>();

function App() {
  let { isPending, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => client.models.Post.list(),
  });

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>My APP - {user?.signInDetails?.loginId ?? "Anonymous"}</h1>

          {isPending
            ? "loading"
            : data
              ? data.data.map((post) => (
                <div>
                  <h1>{post.title}</h1>
                  <span>{post.content}</span>
                </div>
              ))
              : `error: ${error}`}

          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
