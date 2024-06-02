import { Schema } from "#amplify/data/resource";

export function Post({ post }: { post: Schema["Post"]["type"] }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <span>{post.content}</span>
    </div>
  );
}
