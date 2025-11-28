import { z } from 'zod';

// Tipagem do Usuário (Usado no Auth)
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// --- CRIAÇÃO ---
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

// --- ATUALIZAÇÃO (O que estava faltando) ---
export const UpdateTicketSchema = z.object({
  status: z.enum(['OPEN', 'CLOSED', 'ARCHIVED']),
  responsibility: z.enum(['SYNTHEXA', 'THIRD_PARTY']),
  description: z.string().optional(),
  externalUrl: z.string().url().optional().or(z.literal('')),
});