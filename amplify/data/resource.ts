import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  User: a
    .model({
      id: a.string(),
      name: a.string(),
      email: a.string(),
      posts: a.hasMany("Post", "owner"),
      comments: a.hasMany("Comment", "owner"),
      followers: a.hasMany("UserFollows", "followedId"),
      following: a.hasMany("UserFollows", "followerId"),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.ownerDefinedIn("id"),
    ]),
  UserFollows: a
    .model({
      followerId: a.string(),
      follower: a.belongsTo("User", "followerId"),
      followedId: a.string(),
      followed: a.belongsTo("User", "followedId"),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.ownerDefinedIn("followerId"),
      //allow.ownerDefinedIn("followedId").to(["read"]),
    ]),
  Post: a
    .model({
      title: a.string(),
      content: a.string(),
      owner: a.string(),
      author: a.belongsTo("User", "owner"),
      comments: a.hasMany("Comment", "postId"),
    })
    .authorization((allow) => [allow.guest().to(["read"]), allow.owner()]),
  Comment: a
    .model({
      content: a.string(),
      postOwnerId: a.string(),
      postOwner: a.belongsTo("User", "postOwnerId"),
      owner: a.string(),
      postId: a.id(),
      post: a.belongsTo("Post", "postId"),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.ownerDefinedIn("postOwnerId").to(["delete"]),
      allow.owner(),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
