import { z } from "zod";

export const generatePdfSchema = z.object({
  ids: z.array(z.string()).default([]),
});