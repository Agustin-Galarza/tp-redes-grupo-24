export function Post({
  post,
  onClick,
}: {
  post: {
    author: { name?: string | null };
    title?: string | null;
    content?: string | null;
  };
  onClick?: any;
}) {
  return (
    <div onClick={onClick}>
      <h1>
        {post.author.name}: {post.title}
      </h1>
      <span>{post.content}</span>
    </div>
  );
}
