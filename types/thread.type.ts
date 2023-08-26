import mongoose from "mongoose";

export interface IThread {
  text: string;
  author: mongoose.Schema.Types.ObjectId;
  path: string;
  communityId: mongoose.Schema.Types.ObjectId | null;
  parentId: string;
  children: mongoose.Schema.Types.ObjectId[];
}

export interface IUserThreads {
  _id: string;
  id: string;
  __v: number;
  bio: string;
  communities: [];
  createdAt: Date;
  image: string;
  name: string;
  onboarded: true;
  threads: [
    {
      _id: string;
      author: string;
      text: string;
      communityId: null;
      children: [];
      createdAt: Date;
      updatedAt: Date;
      __v: number;
    }
  ];
  updatedAt: Date,
  username: string
}
