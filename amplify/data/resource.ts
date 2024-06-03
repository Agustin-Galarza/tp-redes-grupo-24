import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  User: a
    .model({
      owner: a.string().required(),
      name: a.string().required(),
      posts: a.hasMany("Post", "owner"),
      comments: a.hasMany("Comment", "owner"),
      followers: a.hasMany("UserFollows", "followedId"),
      following: a.hasMany("UserFollows", "followerId"),
    })
    .identifier(["owner"])
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.ownerDefinedIn("id"),
    ]),
  UserFollows: a
    .model({
      followerId: a.string().required(),
      follower: a.belongsTo("User", "followerId"),
      followedId: a.string().required(),
      followed: a.belongsTo("User", "followedId"),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.ownerDefinedIn("followerId"),
      //allow.ownerDefinedIn("followedId").to(["read"]),
    ]),
  Post: a
    .model({
      title: a.string().required(),
      content: a.string().required(),
      owner: a.string(),
      author: a.belongsTo("User", "owner"),
      comments: a.hasMany("Comment", "postId"),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.ownerDefinedIn("owner"),
    ]),
  Comment: a
    .model({
      content: a.string().required(),
      postOwnerId: a.string().required(),
      //postOwner: a.belongsTo("User", "postOwnerId"),
      owner: a.string(),
      author: a.belongsTo("User", "owner"),
      postId: a.id().required(),
      post: a.belongsTo("Post", "postId"),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.ownerDefinedIn("postOwnerId").to(["delete"]),
      allow.ownerDefinedIn("owner"),
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
