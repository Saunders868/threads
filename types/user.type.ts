import mongoose from "mongoose";

export interface IUser {
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  threads: mongoose.Schema.Types.ObjectId[];
  onboarded: boolean;
  communities: mongoose.Schema.Types.ObjectId[];
}

export interface IUpdateUser {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export interface IUserInfo {
  _id: mongoose.Schema.Types.ObjectId;
  id: string;
  __v: number;
  bio: string;
  communities: [];
  createdAt: Date;
  image: string;
  name: string;
  onboarded: boolean;
  threads: mongoose.Schema.Types.ObjectId[];
  updatedAt: Date;
  username: string;
}
