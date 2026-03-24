export type SyncUserInput = {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
};

export type AuthUser = {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
};
