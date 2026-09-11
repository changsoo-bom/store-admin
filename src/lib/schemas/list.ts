import { z } from "zod";

// 폼이 비워 보낸 값("")과 손으로 고친 주소는 조건 없음으로 본다. 잘못된 URL 로 500 을 내지 않는다.

export const keywordParamsSchema = z.object({
  q: z.string().trim().optional().catch(undefined),
});

export const visibilityParamsSchema = keywordParamsSchema.extend({
  visible: z.enum(["shown", "hidden"]).optional().catch(undefined),
});

export type KeywordParams = z.infer<typeof keywordParamsSchema>;
export type VisibilityParams = z.infer<typeof visibilityParamsSchema>;
