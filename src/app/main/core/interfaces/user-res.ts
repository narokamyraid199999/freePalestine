export interface UserRes {
  id: number;
  attributes: Attributes;
}

export interface Attributes {
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  password: string;
  bio: any;
  username: string;
  image: any;
  followers: Followers;
  followings: Following;
  posts: Post;
  likedPosts: LikedPosts;
  savedPosts: SavedPosts;
}

export interface Followers {
  data: any;
}

export interface Following {
  data: any;
}

export interface Post {
  data: any;
}

export interface LikedPosts {
  data: any;
}

export interface SavedPosts {
  data: any;
}
