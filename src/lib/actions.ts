'use server';

import { z } from 'zod';
import prisma from './prisma'; // Caminho relativo
// Adicionado UpdateTicketSchema na importação abaixo
import { CreateTicketSchema, CreateTicketState, UpdateTicketSchema } from './definitions'; 
import { auth, signIn } from '../auth'; // Caminho relativo
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Importamos uma função que força o modo dinâmico
import { unstable_noStore as noStore } from 'next/cache';

// --- 1. LOGIN ---
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciais inválidas.';
        default:
          return 'Algo deu errado.';
      }
    }
    throw error;
  }
}

// --- 2. CRIAR TICKET ---
export async function createTicket(prevState: CreateTicketState, formData: FormData) {
  noStore();

  const validatedFields = CreateTicketSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    externalId: formData.get('externalId'),
    internalId: formData.get('internalId'),
    origin: formData.get('origin'),
    systemName: formData.get('systemName'),
    externalUrl: formData.get('externalUrl'),
    responsibility: formData.get('responsibility'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos inválidos. Verifique os dados.',
    };
  }

  const session = await auth();
  
  if (!session?.user?.email) {
    return { message: 'Erro de sessão: Usuário não autenticado.' };
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { message: 'Erro crítico: Usuário não encontrado no banco.' };
  }

  const { title, description, externalId, internalId, origin, systemName, externalUrl, responsibility } = validatedFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.create({
        data: {
          title,
          description,
          externalId,
          internalId,
          origin,
          systemName,
          externalUrl: externalUrl || null,
          responsibility,
          userId: user.id,
          status: 'OPEN',
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'CREATE',
          details: `Criou o ticket externo #${externalId} (${systemName})`,
          userId: user.id,
          ticketId: ticket.id,
        },
      });
    });
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    return { message: 'Erro de banco de dados ao criar ticket.' };
  }

  revalidatePath('/dashboard/tickets');
  revalidatePath('/dashboard');
  redirect('/dashboard/tickets');
}

// --- 3. ATUALIZAR TICKET (NOVO) ---
export async function updateTicket(
  id: string, 
  prevState: any, 
  formData: FormData
) {
  noStore();
  
  const session = await auth();
  if (!session?.user?.email) return { message: 'Não autenticado' };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { message: 'Usuário inválido' };

  // Validação dos dados de atualização
  const validatedFields = UpdateTicketSchema.safeParse({
    status: formData.get('status'),
    responsibility: formData.get('responsibility'),
    description: formData.get('description'),
    externalUrl: formData.get('externalUrl'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Dados inválidos.',
    };
  }

  const { status, responsibility, description, externalUrl } = validatedFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      // A. Buscar ticket atual para comparação (Log Inteligente)
      const oldTicket = await tx.ticket.findUnique({ where: { id } });
      if (!oldTicket) throw new Error('Ticket not found');

      // B. Atualizar Ticket
      await tx.ticket.update({
        where: { id },
        data: {
          status,
          responsibility,
          description: description || oldTicket.description,
          externalUrl: externalUrl || oldTicket.externalUrl,
        },
      });

      // C. Gerar Log de Mudanças
      let logDetails = '';
      
      if (oldTicket.status !== status) {
        logDetails += `Alterou status para ${status === 'OPEN' ? 'Aberto' : 'Fechado'}. `;
      }
      
      if (oldTicket.responsibility !== responsibility) {
        logDetails += `Passou bastão para ${responsibility === 'SYNTHEXA' ? 'Nós (Synthexa)' : 'Terceiro'}. `;
      }

      if (logDetails === '') {
        logDetails = 'Atualizou detalhes do ticket.';
      }

      await tx.auditLog.create({
        data: {
          action: 'UPDATE',
          details: logDetails,
          userId: user.id,
          ticketId: id,
        },
      });
    });
  } catch (error) {
    console.error('Erro ao atualizar:', error);
    return { message: 'Erro ao atualizar ticket.' };
  }

  revalidatePath('/dashboard/tickets');
  revalidatePath('/dashboard');
  redirect('/dashboard/tickets');
}