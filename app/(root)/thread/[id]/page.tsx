import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { getThreadHandler } from "@/lib/actions/thread.actions";
import { getUserHandler } from "@/lib/actions/user.actions";
import { IUserInfo } from "@/types/user.type";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();

  if (!params.id) return null;
  if (!user) return null;

  const userInfo: IUserInfo = await getUserHandler(user.id);
  const thread = await getThreadHandler(params.id);

  if (!userInfo.onboarded) redirect("/onboarded");
  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createAt}
          comments={thread.children}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={thread._id.toString()}
          currentUserImg={userInfo.image}
          currentUserId={userInfo._id.toString()}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((child: any) => (
          <ThreadCard
            key={child._id}
            id={child._id}
            currentUserId={child?.id || ""}
            parentId={child.parentId}
            content={child.text}
            author={child.author}
            community={child.community}
            createdAt={child.createAt}
            comments={child.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}

export default Page;
