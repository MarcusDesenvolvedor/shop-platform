export type Store = {
  id: string;
  userId: string;
  name: string;
  slug: string;
  coverImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateStoreInput = {
  name: string;
};

export type UpdateStoreInput = {
  name?: string;
  coverImageUrl?: string | null;
};

export type StoreSlugParams = {
  slug: string;
};
