"use server";

import { IUpdateUser } from "@/types/user.type";
import { connectToDB } from "../connect";
import {
  getUser,
  getUserThreads,
  getUsers,
  updateUser,
} from "../services/user.service";
import { revalidatePath } from "next/cache";
import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";

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

export async function getUserHandler(userId: string) {
  try {
    await connectToDB();

    const user = await getUser({ id: userId });
    return user;
  } catch (error: any) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
}

export async function getUsersHandler({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    await connectToDB();

    const { users, isNext } = await getUsers({
      userId,
      searchString,
      pageNumber,
      pageSize,
      sortBy,
    });
    return {
      users,
      isNext,
    };
  } catch (error: any) {
    throw new Error(`Failed to get users: ${error.message}`);
  }
}

export async function getUserThreadsHandler(userId: string) {
  try {
    await connectToDB();

    const threads = await getUserThreads(userId);
    return threads;
  } catch (error: any) {
    throw new Error(`Failed to get user threads: ${error.message}`);
  }
}

export async function getUserActivities(userId: string) {
  try {
    await connectToDB();

    const threads = await Thread.find({ author: userId });
    const childThreadIds = threads.reduce((acc: any, thread: any) => {
      return acc.concat(thread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to get user activities: ${error.message}`);
  }
}
