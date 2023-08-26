import { getUserThreadsHandler } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { IUserThreads } from "@/types/thread.type";

async function ThreadsTab({
  currentUserId,
  accountId,
  accountType,
}: {
  currentUserId: string;
  accountId: string;
  accountType: string;
}) {
  const userThreads: IUserThreads = await getUserThreadsHandler(accountId);

  if (!userThreads) {
    redirect("/");
  }
  return (
    <section className="mt-9 flex flex-col gap-10">
      {userThreads.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={accountType === "User" ? {name: userThreads.name, image: userThreads.image, id: userThreads.id} : {
            name: thread.author.name, image: thread.author.image, id: thread.author.id
          }}
          community={thread.community}
          createdAt={thread.createAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
}

export default ThreadsTab;
