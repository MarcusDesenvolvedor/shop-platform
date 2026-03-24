generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

//////////////////////
// ENUMS
//////////////////////

enum OrderStatus {
  PENDING_PAYMENT
  PAID
  CANCELED
}

enum PaymentStatus {
  PENDING
  CONFIRMED
}

//////////////////////
// USER
//////////////////////

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  createdAt DateTime @default(now())

  store     Store?
  orders    Order[]
}

//////////////////////
// STORE (MULTI-TENANT ROOT)
//////////////////////

model Store {
  id        String   @id @default(uuid())
  userId    String   @unique
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user       User       @relation(fields: [userId], references: [id])
  products   Product[]
  categories Category[]
  orders     Order[]
}

//////////////////////
// CATEGORY
//////////////////////

model Category {
  id        String   @id @default(uuid())
  storeId   String
  name      String
  createdAt DateTime @default(now())

  store    Store    @relation(fields: [storeId], references: [id])
  products Product[]
}

//////////////////////
// PRODUCT
//////////////////////

model Product {
  id          String   @id @default(uuid())
  storeId     String
  categoryId  String
  name        String
  description String
  price       Decimal
  stock       Int
  brand       String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  store       Store         @relation(fields: [storeId], references: [id])
  category    Category      @relation(fields: [categoryId], references: [id])
  images      ProductImage[]
  orderItems  OrderItem[]
}

//////////////////////
// PRODUCT IMAGE
//////////////////////

model ProductImage {
  id        String   @id @default(uuid())
  productId String
  url       String
  createdAt DateTime @default(now())

  product Product @relation(fields: [productId], references: [id])
}

//////////////////////
// ORDER
//////////////////////

model Order {
  id        String      @id @default(uuid())
  storeId   String
  userId    String?
  status    OrderStatus @default(PENDING_PAYMENT)

  // Customer Info
  firstName            String
  lastName             String
  street               String
  number               String
  city                 String
  state                String
  country              String
  identificationNumber String
  phone                String

  totalAmount Decimal
  createdAt   DateTime @default(now())

  store      Store       @relation(fields: [storeId], references: [id])
  user       User?       @relation(fields: [userId], references: [id])
  items      OrderItem[]
  payment    Payment?
}

//////////////////////
// ORDER ITEM
//////////////////////

model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  price     Decimal

  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])
}

//////////////////////
// PAYMENT (PIX SIMULADO)
//////////////////////

model Payment {
  id          String        @id @default(uuid())
  orderId     String        @unique
  status      PaymentStatus @default(PENDING)
  createdAt   DateTime      @default(now())
  confirmedAt DateTime?

  order Order @relation(fields: [orderId], references: [id])
}