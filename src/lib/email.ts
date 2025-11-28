import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gp.sistemas@gmail.com', 
    pass: 'dxxnuuemodkwzfie',
  },
});

export async function sendAlertEmail(staleTickets: any[]) {
  if (!process.env.ALERT_EMAIL_DEST) {
    console.error('Email de destino não configurado no .env');
    return;
  }

  // Monta o corpo do e-mail em HTML simples
  const ticketListHtml = staleTickets.map(t => `
    <li style="margin-bottom: 10px;">
      <strong>[${t.systemName}] ${t.title}</strong><br/>
      Status: ${t.status} | Responsável: ${t.responsibility === 'SYNTHEXA' ? 'NÓS (Risco de Fechamento)' : 'Terceiro'}<br/>
      Última atualização: ${new Date(t.updatedAt).toLocaleString('pt-BR')}<br/>
      <a href="http://localhost:3000/dashboard/tickets/${t.id}/edit">Ver no Sistema</a>
    </li>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2 style="color: #c0392b;">⚠️ Alerta de Tickets Estagnados - Synthexa Nexus</h2>
      <p>Os seguintes tickets não foram atualizados nas últimas 24 horas e precisam de atenção:</p>
      <ul>
        ${ticketListHtml}
      </ul>
      <p>Por favor, verifique se houve retorno do fornecedor ou se precisamos interagir para evitar o fechamento automático.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ALERT_EMAIL_DEST,
      subject: `[ALERTA] ${staleTickets.length} Tickets precisam de atenção`,
      html: html,
    });
    console.log('E-mail de alerta enviado com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return false;
  }
}