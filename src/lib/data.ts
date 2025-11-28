import { unstable_noStore as noStore } from 'next/cache';
import prisma from './prisma'; // Caminho relativo para o banco

// 1. Buscar todos os tickets (Para a Lista)
export async function fetchTickets() {
  noStore();
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      include: { createdBy: true },
    });
    return tickets;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tickets.');
  }
}

// 2. Buscar logs de auditoria (Para a Sidebar)
export async function fetchLatestLogs() {
  noStore();
  try {
    const logs = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: { user: true },
    });
    return logs;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch logs.');
  }
}

// 3. Buscar UM ticket pelo ID (Para a Edição - ERA ISSO QUE FALTAVA)
export async function fetchTicketById(id: string) {
  noStore();
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });
    return ticket;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch ticket.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // Executa todas as contagens em paralelo para ser rápido
    const [ticketsCount, pendingThirdCount, pendingSynthexaCount, criticalCount] = await Promise.all([
      // Total de Abertos
      prisma.ticket.count({ where: { status: 'OPEN' } }),
      
      // Aguardando Terceiro (Abertos)
      prisma.ticket.count({ where: { status: 'OPEN', responsibility: 'THIRD_PARTY' } }),
      
      // Aguardando Synthexa (Abertos)
      prisma.ticket.count({ where: { status: 'OPEN', responsibility: 'SYNTHEXA' } }),
      
      // Críticos (Abertos e sem atualização há mais de 5 dias)
      prisma.ticket.count({ 
        where: { 
          status: 'OPEN', 
          updatedAt: { lte: new Date(new Date().setDate(new Date().getDate() - 5)) } 
        } 
      }),
    ]);

    return {
      ticketsCount,
      pendingThirdCount,
      pendingSynthexaCount,
      criticalCount,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}