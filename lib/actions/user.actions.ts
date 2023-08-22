"use server";

import { IUpdateUser } from "@/types/user.type";
import { connectToDB } from "../connect";
import { getUser, updateUser } from "../services/user.service";
import { revalidatePath } from "next/cache";

export async function updateUserHandler({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: IUpdateUser): Promise<void> {
  try {
    await connectToDB();

    const user = await updateUser(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function getUserHandler(userId:string) {
  try {
    await connectToDB();

    const user = await getUser({ id: userId });
    return user;
  } catch (error: any) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
}