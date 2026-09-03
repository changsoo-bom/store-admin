import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { productVariants, products } from "@/db/schema";

/** "189,000" 처럼 콤마가 섞인 폼 입력을 원 단위 정수로 바꾼다 */
const rawKrw = z.union([z.string(), z.number()]);

function toKrw(v: string | number, ctx: z.RefinementCtx): number {
  const n = typeof v === "number" ? v : Number(v.replace(/[^0-9]/g, ""));
  if (!Number.isFinite(n) || n < 0) {
    // transform 안에서 throw 하면 safeParse 가 터진다
    ctx.addIssue({ code: "custom", message: "금액을 숫자로 입력해주세요" });
    return z.NEVER;
  }
  return Math.trunc(n);
}

const krw = rawKrw.transform(toKrw);
/** 비워 두면 0 으로 본다 */
const krwOrZero = rawKrw.default(0).transform(toKrw);

/** DB 스키마에서 뽑고, 폼이 실제로 보내는 것만 남긴다 */
export const productCreateSchema = createInsertSchema(products, {
  name: z.string().min(1, "상품명을 입력해주세요").max(60),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  description: z.string().max(120).optional(),
})
  .pick({ name: true, brand: true, category: true, description: true, status: true })
  .extend({
    priceKrw: krw,
    listPriceKrw: krw.optional(),
    costKrw: krw.optional(),
  });

export const variantCreateSchema = createInsertSchema(productVariants, {
  sku: z.string().min(1, "SKU 를 입력해주세요").max(40),
})
  .pick({ sizeOz: true, color: true, sku: true })
  .extend({
    extraPriceKrw: krwOrZero,
    stock: krwOrZero,
  });

export const productWithVariantsSchema = productCreateSchema.extend({
  variants: z.array(variantCreateSchema).min(1, "옵션을 하나 이상 추가해주세요"),
});

/** 목록 화면의 searchParams */
export const productListParamsSchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().optional(),
  status: z.enum(["draft", "active", "hidden"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductWithVariantsInput = z.infer<typeof productWithVariantsSchema>;
export type ProductListParams = z.infer<typeof productListParamsSchema>;
