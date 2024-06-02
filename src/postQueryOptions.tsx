import { queryOptions } from "@tanstack/react-query";
import { amplifyClient } from "./amplifyClient";

export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["posts", { postId }],
    queryFn: async () => {
      let data = await amplifyClient.models.Post.get(
        { id: postId },
        {
          selectionSet: [
            "id",
            "owner",
            "title",
            "content",
            "author.username",
            "comments.*",
            "comments.author.username",
          ],
        }
      );
      return data.data!;
    },
  });
