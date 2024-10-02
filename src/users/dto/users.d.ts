export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  thumbnail: string | null;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  posts?: Post[] | null;
}

export interface UserList {
  users: User[];
  totalCount: number;
  currentPage: number;
  perPage: number;
}