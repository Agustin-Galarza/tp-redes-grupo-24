import { Link } from "@tanstack/react-router";

export function Post({
  post,
}: {
  post: {
    author: { name?: string | null; id?: string | null };
    title?: string | null;
    content?: string | null;
    id?: string | null;
  };
  onClick?: () => void;
}) {
  const shortContent = (content: string) =>
    content.length > 100 ? content.slice(0, 100) + "..." : content;

  return (
    <Link
      to={post.id ? `/posts/${post.id}` : undefined}
      className="flex flex-col gap-2 p-6 border-neutral-800 border-[1px] border-solid rounded-lg hover:bg-neutral-800 hover:cursor-pointer transition duration-300 ease-in-out"
    >
      <h3 className="text-slate-100 text-xl font-semibold">{post.title}</h3>
      <p className="text-slate-300 text-base">
        {shortContent(post.content || "")}
      </p>
      <Link
        to={post.author.id ? `/users/${post.author.id}` : undefined}
        className={`text-slate-200 text-sm w-fit  ${
          post.author.id ? "hover:cursor-pointer hover:underline" : ""
        }`}
      >
        {post.author.name}
      </Link>
    </Link>
  );
}
