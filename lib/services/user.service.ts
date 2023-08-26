import { IUser } from "@/types/user.type";
import { FilterQuery, QueryOptions, SortOrder } from "mongoose";
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

export async function getUsers({
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
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const userQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);
    const users = await userQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return {
      users,
      isNext,
    };
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
