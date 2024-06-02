export function Post({
  post,
}: {
  post: {
    author: { username?: string | null };
    title?: string | null;
    content?: string | null;
  };
}) {
  return (
    <div>
      <h1>
        {post.author.username}: {post.title}
      </h1>
      <span>{post.content}</span>
    </div>
  );
}
