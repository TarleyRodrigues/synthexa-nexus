import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // Corrigido: sai de check-alerts > api > app > chega em src
import { sendAlertEmail } from '../../../lib/email'; // Corrigido
import { subHours } from 'date-fns';

export const dynamic = 'force-dynamic'; // Força a rota a não fazer cache (importante para alertas)

export async function GET() {
  try {
    // Regra: Tickets ABERTOS que não foram atualizados nas últimas 24 horas
    // Para TESTE, você pode mudar o 24 para 0 (vai pegar tudo de hoje)
    const timeThreshold = subHours(new Date(), 0);

    const staleTickets = await prisma.ticket.findMany({
      where: {
        status: 'OPEN',
        updatedAt: {
          lt: timeThreshold,
        },
      },
    });

    if (staleTickets.length === 0) {
      return NextResponse.json({ message: 'Nenhum ticket atrasado. Tudo em dia!' });
    }

    // Se tiver tickets velhos, envia o e-mail
    const emailSent = await sendAlertEmail(staleTickets);

    if (emailSent) {
      return NextResponse.json({ 
        message: `Alerta enviado! ${staleTickets.length} tickets encontrados.`,
        tickets: staleTickets.length 
      });
    } else {
      return NextResponse.json({ error: 'Erro ao enviar e-mail SMTP.' }, { status: 500 });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}