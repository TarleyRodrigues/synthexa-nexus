import { z } from 'zod';

// Schema para criar um ticket
export const CreateTicketSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres'),
  description: z.string().optional(),
  externalId: z.string().min(1, 'O ID externo é obrigatório'),
  internalId: z.string().optional(),
  origin: z.enum(['Interno', 'Reunião', 'Proativo', 'Outros']),
  systemName: z.enum(['MEGA ERP', 'MULTIDADOS', 'CV CRM', 'OUTROS']),
  externalUrl: z.string().url('Deve ser uma URL válida').optional().or(z.literal('')),
  responsibility: z.enum(['SYNTHEXA', 'THIRD_PARTY']),
});

export type CreateTicketState = {
  errors?: {
    title?: string[];
    externalId?: string[];
    origin?: string[];
    systemName?: string[];
    externalUrl?: string[];
    responsibility?: string[];
  };
  message?: string | null;
};