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
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-2 p-6 border-neutral-800 border-[1px] border-solid rounded-lg hover:bg-neutral-800 hover:cursor-pointer transition duration-300 ease-in-out"
    >
      <h3 className="text-slate-100 text-xl font-semibold">{post.title}</h3>
      <span className="text-slate-300 text-base">{post.content}</span>
      <Link
        to={post.author.id ? `/users/${post.author.id}` : undefined}
        className="text-slate-200 text-sm"
      >
        {post.author.name}
      </Link>
    </button>
  );
}
