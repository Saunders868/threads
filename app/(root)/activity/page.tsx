import { getUserActivities, getUserHandler } from "@/lib/actions/user.actions";
import { IUserInfo } from "@/types/user.type";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo: IUserInfo = await getUserHandler(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const activities = await getUserActivities(userInfo._id as unknown as string);
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activities.length > 0 ? (
          <>
            {activities.map((activity) => (
              <Link href={`/thread/${activity.parentId}`} key={activity._id}>
                <article className="activity-card">
                  <Image 
                    src={activity.author.image}
                    alt="Profile picture"
                    width={20}
                    height={20}
                    className="object-cover rounded-full"
                  />

                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500"> 
                      {activity.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
            </Link>
            ))}
          </>
        ) : <p className="!text-base-regular text-light-3">No activity yet</p>}
      </section>
    </section>
  );
}

export default Page;
