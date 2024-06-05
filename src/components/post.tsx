import { Link } from "@tanstack/react-router";

export function Post({
  post,
  onClick,
}: {
  post: {
    author: { name?: string | null; id?: string | null };
    title?: string | null;
    content?: string | null;
  };
  onClick?: any;
}) {
  return (
    <div onClick={onClick}>
      <h1>
        <Link to={post.author.id ? `/users/${post.author.id}` : undefined}>
          {post.author.name}
        </Link>
        : {post.title}
      </h1>
      <span>{post.content}</span>
    </div>
  );
}
