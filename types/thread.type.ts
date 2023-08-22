import mongoose from "mongoose";

export interface IThread {
  text: string;
  author: mongoose.Schema.Types.ObjectId;
  path: string;
  communityId: mongoose.Schema.Types.ObjectId | null;
  parentId: string;
  children: mongoose.Schema.Types.ObjectId[];
}