import { queryOptions } from "@tanstack/react-query";
import { amplifyClient } from "./amplifyClient";

export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["posts", { postId }],
    queryFn: () => amplifyClient.models.Post.get({ id: postId }),
  });
