import mongoose from "mongoose";

export type sidebarLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type TabT = {
  value: string;
  label: string;
  icon: string;
};

export type UserT = {
  id: string;
  username: string;
  name: string;
  bio: string;
  image: string;
};

export type UserDataT = {
  id: string | undefined;
  objectId: string;
  username: string | undefined | null;
  name: string;
  bio: string;
  image: string | undefined;
};

export type ThreadCardT = {
  currentUserId: string;
  id: mongoose.Schema.Types.ObjectId;
  author: {
    name: string;
    image: string;
    id: string;
  };
  content: string;
  community: {
    name: string;
    image: string;
    id: string;
  } | null;
  comments: { author: { image: string } }[];
  createdAt: Date;
  parentId: mongoose.Schema.Types.ObjectId;
  isComment?: boolean;
};
