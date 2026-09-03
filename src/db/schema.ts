import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * 금액은 전부 원 단위 정수로 둔다. 소수점이 없는 통화라 numeric 을 쓸 이유가 없고,
 * float 로 두면 합계에서 오차가 난다.
 */

export const productStatus = pgEnum("product_status", ["draft", "active", "hidden"]);
export const orderStatus = pgEnum("order_status", [
  "paid",
  "packing",
  "shipping",
  "delivered",
  "exchange",
  "cancelled",
]);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    brand: varchar("brand", { length: 60 }),
    category: varchar("category", { length: 60 }).notNull(),
    description: text("description"),
    /** 판매가 */
    priceKrw: integer("price_krw").notNull(),
    /** 정가. 판매가보다 높을 때만 할인율이 붙는다 */
    listPriceKrw: integer("list_price_krw"),
    /** 원가. 비어 있으면 마진 리포트에서 빠진다 */
    costKrw: integer("cost_krw"),
    status: productStatus("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("products_status_created_idx").on(t.status, t.createdAt)],
);

export const productImages = pgTable(
  "product_images",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: varchar("alt", { length: 160 }),
    /** 0 이 대표 이미지다 */
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("product_images_product_idx").on(t.productId, t.sortOrder)],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    /** 글러브 온스. 헤드기어처럼 온스가 없는 품목은 null */
    sizeOz: integer("size_oz"),
    color: varchar("color", { length: 40 }),
    sku: varchar("sku", { length: 40 }).notNull(),
    extraPriceKrw: integer("extra_price_krw").notNull().default(0),
    stock: integer("stock").notNull().default(0),
  },
  (t) => [
    uniqueIndex("product_variants_sku_uq").on(t.sku),
    index("product_variants_product_idx").on(t.productId),
    // 재고 경고 목록이 자주 훑는 경로다
    index("product_variants_low_stock_idx").on(t.stock).where(sql`${t.stock} <= 5`),
  ],
);

export const customers = pgTable(
  "customers",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 60 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 120 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("customers_phone_uq").on(t.phone)],
);

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    /** 화면에 보이는 주문번호. BS-260902-0412 형식 */
    orderNo: varchar("order_no", { length: 24 }).notNull(),
    customerId: integer("customer_id").references(() => customers.id),
    status: orderStatus("status").notNull().default("paid"),
    totalKrw: integer("total_krw").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("orders_no_uq").on(t.orderNo),
    index("orders_created_idx").on(t.createdAt),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    variantId: integer("variant_id")
      .notNull()
      .references(() => productVariants.id),
    qty: integer("qty").notNull(),
    /** 주문 시점 단가. 상품 가격이 바뀌어도 과거 주문은 그대로여야 한다 */
    unitPriceKrw: integer("unit_price_krw").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

/* ─────────── 관계 (Relational Query 용) ─────────── */

export const productsRelations = relations(products, ({ many }) => ({
  images: many(productImages),
  variants: many(productVariants),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
  orderItems: many(orderItems),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

/* ─────────── 추론 타입 ─────────── */

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
