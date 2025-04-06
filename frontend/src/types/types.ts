export type ErrorType = {
  message: string;
};

export type Status = "online" | "away" | "offline";

export type User = {
  id: string;
  username: string;
  fullName: string;
  image: string;
  status: Status;
};

export type LoginData = {
  username: string;
  password: string;
};

export type SignupData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: boolean;
};

export type Friend = {
  friendshipId: string;
  lastMessageTime: Date | null;
  unreadMessageCount: number;
} & User;

export type Message = {
  id: string;
  content: string;
  senderId: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Channel = {
  id: string;
  name: string;
  memberCount: number;
  isAdmin: boolean;
  lastMessageTime: Date | null;
};

export type ChannelMessage = {
  id: string;
  content: string;
  channelId: string;
  senderId: string;
  updatedAt: Date;
  sender: {
    fullName: string;
    image: string;
  };
};
