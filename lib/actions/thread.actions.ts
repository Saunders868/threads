"use server";

import { IThread } from "@/types/thread.type";
import { connectToDB } from "../connect";
import { createThread, getThread, getThreads } from "../services/thread.service";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";

export async function createThreadHandler(
  thread: Omit<IThread, "parentId" | "children">
) {
  try {
    await connectToDB();

    const createdThread = await createThread({
      text: thread.text,
      author: thread.author,
      communityId: null,
    });

    // update the user
    await User.findByIdAndUpdate(thread.author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(thread.path);
    return createdThread;
  } catch (error: any) {
    throw new Error(`Failed to create/update thread: ${error.message}`);
  }
}

export async function getThreadsHandler(pageNumber = 1, pageSize = 20) {
  try {
    await connectToDB();

    // calculate the number of pages to skip depending on what page we are on
    const skipAmount = (pageNumber - 1) * pageSize;

    const { threads, isNext } = await getThreads(skipAmount, pageSize);
    return { threads, isNext };
  } catch (error: any) {
    throw new Error(`Failed to get threads: ${error.message}`);
  }
}

export async function getThreadHandler(id: string) {
  try {
    await connectToDB();

    const thread = await getThread(id);
    return thread;
  } catch (error: any) {
    throw new Error(`Failed to get threads: ${error.message}`);
  }
}

export async function addCommentHandler(threadId:string, commentText: string, userId: string, path: string) {
  try {
    await connectToDB();

    const originalThread = await getThread(threadId);
    if(!originalThread) {
      throw new Error(`Thread not found`);
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId
    });

    const savedCommentThread = await commentThread.save();
    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to get threads: ${error.message}`);
  }
}