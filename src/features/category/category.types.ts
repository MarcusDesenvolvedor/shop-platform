export type Category = {
  id: string;
  storeId: string;
  name: string;
  createdAt: Date;
};

export type CreateCategoryInput = {
  name: string;
};

export type UpdateCategoryInput = {
  name?: string;
};
