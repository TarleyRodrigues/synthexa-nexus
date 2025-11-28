'use server';

import { z } from 'zod';
import prisma from './prisma'; // Caminho relativo
import { CreateTicketSchema, CreateTicketState } from './definitions'; // Caminho relativo
import { auth, signIn } from '../auth'; // Caminho relativo
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- AQUI ESTÁ O SEGREDO ---
// Importamos uma função que força o modo dinâmico
import { unstable_noStore as noStore } from 'next/cache';

// Função de Login (Já existia)
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

// Função de Criar Ticket (Com a correção)
export async function createTicket(prevState: CreateTicketState, formData: FormData) {
  // 1. Forçar comportamento dinâmico para garantir acesso aos headers/cookies
  noStore();

  // 2. Validar os campos com Zod
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

  // 3. Pegar o usuário logado com segurança
  // Agora o auth() deve funcionar pois o noStore() preparou o terreno
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

  // 4. Preparar os dados
  const { title, description, externalId, internalId, origin, systemName, externalUrl, responsibility } = validatedFields.data;

  // 5. Transação no Banco
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