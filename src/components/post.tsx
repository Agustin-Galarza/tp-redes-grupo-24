export function Post({
  post,
}: {
  post: {
    author: { name?: string | null };
    title?: string | null;
    content?: string | null;
  };
}) {
  return (
    <div>
      <h1>
        {post.author.name}: {post.title}
      </h1>
      <span>{post.content}</span>
    </div>
  );
}
