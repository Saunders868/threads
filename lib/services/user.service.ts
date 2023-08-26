import { IUser } from "@/types/user.type";
import { FilterQuery, QueryOptions } from "mongoose";
import User from "../models/user.model";
import Thread from "../models/thread.model";

export async function updateUser(
  filter: FilterQuery<IUser>,
  input: Omit<IUser, "id" | "threads" | "communities">,
  options: QueryOptions
) {
  try {
    const updatedUser = await User.findOneAndUpdate(filter, input, options);

    return updatedUser;
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function getUser(query: FilterQuery<IUser>) {
  try {
    return User.findOne(query);
    // .populate({ path: 'communities', model: Community})
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function getUserThreads(userId: string) {
  try {
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return threads;
  } catch (e: any) {
    throw new Error(e);
  }
}
