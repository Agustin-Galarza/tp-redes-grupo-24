import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { amplifyClient } from "../amplifyClient";
import { redirectOnNotRegistered } from "../session";
import { queryOptions } from "@tanstack/react-query";
import { Loading } from "../components/loading";
import { coalesceAuthor, makeMutable } from "../fixes";
import { ChevronLeft } from "lucide-react";

const userQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["users", { userId }],
    queryFn: async () => {
      const data = await amplifyClient.models.User.get(
        { id: userId },
        {
          selectionSet: [
            "id",
            "name",
            "posts.id",
            "posts.title",
            "posts.content",
            "posts.author.name",
            "followers.followerId",
            "following.followedId",
          ],
        }
      )
        .then((d) => d.data!)
        .then(makeMutable);
      for (const post of data.posts) {
        coalesceAuthor(post);
      }
      return data;
    },
  });

export const Route = createFileRoute("/users/$userId")({
  beforeLoad: redirectOnNotRegistered,
  loader: async ({ context: { queryClient }, params: { userId } }) => {
    return queryClient.ensureQueryData(userQueryOptions(userId));
  },
  component: ProfilePage,
  pendingComponent: () => <Loading />,
});

async function followUser({
  userId,
  otherUserId,
}: {
  userId: string;
  otherUserId: string;
}) {
  await amplifyClient.models.UserFollows.create({
    followerId: userId,
    followedId: otherUserId,
  });
}

async function unfollowUser({
  userId,
  otherUserId,
}: {
  userId: string;
  otherUserId: string;
}) {
  await amplifyClient.graphql({
    query: `mutation ($input: DeleteUserFollowsInput!) {
      deleteUserFollows(input: $input) {
        followerId
        followedId
        createdAt
        updatedAt
      }
    }`,
    variables: {
      input: {
        followerId: userId,
        followedId: otherUserId,
      },
    },
  });
}

function ProfilePage() {
  const userId = Route.useParams().userId;
  const { data: user } = useSuspenseQuery(userQueryOptions(userId));
  const {
    options: {
      context: {
        user: { userId: myUserId },
      },
    },
  } = useRouter();
  const following = !!user.followers.find((u) => u.followerId == myUserId);
  const followerCount = user.followers.length;
  const followingCount = user.following.length;

  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () => followUser({ userId: myUserId, otherUserId: userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", { userId: myUserId }],
      });
      queryClient.invalidateQueries({ queryKey: ["users", { userId }] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser({ userId: myUserId, otherUserId: userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", { userId: myUserId }],
      });
      queryClient.invalidateQueries({ queryKey: ["users", { userId }] });
    },
  });

  return (
    <>
      <Link
        className="flex items-center gap-1  w-fit text-neutral-100 text-sm hover:underline mb-8"
        to="/"
      >
        <ChevronLeft size={16} />
        Go back
      </Link>
      <h1 className="text-neutral-200 text-4xl font-bold mb-4">{user.name}</h1>
      <div className="flex flex-col mb-4">
        <span className="text-neutral-200 text-sm">
          Followers:{" "}
          <span className="text-neutral-300 font-bold text-base">
            {followerCount}
          </span>
        </span>
        <span className="text-neutral-200 text-sm">
          Following:{" "}
          <span className="text-neutral-300 font-bold text-base">
            {followingCount}
          </span>
        </span>
      </div>
      <button
        className="bg-neutral-100 rounded-lg py-2 hover:bg-neutral-200 transition-colors duration-300 ease-in-out"
        onClick={() => {
          if (following) unfollowMutation.mutate();
          else followMutation.mutate();
        }}
      >
        {following ? "UNFOLLOW" : "FOLLOW"}
      </button>
    </>
  );
}
