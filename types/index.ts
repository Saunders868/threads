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
