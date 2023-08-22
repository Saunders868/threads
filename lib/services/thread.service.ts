import { IThread } from "@/types/thread.type";
import { FilterQuery, QueryOptions } from "mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";

export async function createThread(
  input: Omit<IThread, "path" | "parentId" | "children">
) {
  try {
    const thread = await Thread.create(input);
    return thread;
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function getThreads(skipAmount: number, pageSize: number) {
  try {
    const threads = await Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const isNext = totalPostsCount > skipAmount + threads.length;
    return {
      threads,
      isNext,
    };
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function getThread(id: string) {
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      });
    return thread;
  } catch (e: any) {
    throw new Error(e);
  }
}
