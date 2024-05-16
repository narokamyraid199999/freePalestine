export interface PostElm {
  id: number;
  attributes: postData;
}

export interface postData {
  content: string;
  tags: string;
  likes: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image: string;
  location: string;
  saved: any;
  username: Username;
}

export interface Username {
  data: Data;
}

export interface Data {
  id: number;
  attributes: Attributes2;
}

export interface Attributes2 {
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  password: string;
  bio: any;
  username: string;
  image: any;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  start: number;
  limit: number;
  total: number;
}
