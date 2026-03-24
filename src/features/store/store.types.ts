export type Store = {
  id: string;
  userId: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateStoreInput = {
  name: string;
};

export type UpdateStoreInput = {
  name?: string;
};

export type StoreSlugParams = {
  slug: string;
};
