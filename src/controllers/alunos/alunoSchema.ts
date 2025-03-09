import { z } from "zod";

export const adminCreateAlunoSchema = z.object({
  cpf: z
  .string({
    required_error: 'CPF é obrigatório.',
  })
  .refine((doc) => {
    const replacedDoc = doc.replace(/\D/g, '');
    return replacedDoc.length >= 11;
  }, 'CPF deve conter no mínimo 11 caracteres.')
  .refine((doc) => {
    const replacedDoc = doc.replace(/\D/g, '');
    return !!Number(replacedDoc);
  }, 'CPF deve conter apenas números.'),
  name: z.string(),
  email: z.string().email(),
  matricula: z.string().optional(),
  unidade: z.string().optional()
})