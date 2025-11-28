import Link from 'next/link';
import { Plus, ExternalLink } from 'lucide-react';
import { fetchTickets } from '../../../lib/data'; // Importando a função de dados
import { format } from 'date-fns'; // Biblioteca de data que instalamos
import { ptBR } from 'date-fns/locale';

export default async function TicketsPage() {
  const tickets = await fetchTickets();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Tickets de Suporte</h1>
        <Link
          href="/dashboard/tickets/create"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:block">Novo Ticket</span>
        </Link>
      </div>

      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-white p-2 md:pt-0 shadow-sm border border-gray-200">
            {/* Tabela Responsiva */}
            <table className="min-w-full text-gray-900">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Sistema / ID</th>
                  <th scope="col" className="px-3 py-5 font-medium">Problema</th>
                  <th scope="col" className="px-3 py-5 font-medium">Status / Responsável</th>
                  <th scope="col" className="px-3 py-5 font-medium">Última Atualização</th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="w-full border-b py-3 text-sm last-of-type:border-none hover:bg-gray-50">
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{ticket.systemName}</span>
                        <span className="text-xs text-gray-500">Ext: {ticket.externalId}</span>
                        {ticket.internalId && <span className="text-xs text-gray-400">Int: {ticket.internalId}</span>}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="max-w-xs truncate font-medium">{ticket.title}</div>
                      <div className="text-xs text-gray-500">{ticket.origin}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex flex-col gap-1">
                        {/* Badge de Status */}
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium w-fit ${
                          ticket.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {ticket.status === 'OPEN' ? 'Aberto' : 'Fechado'}
                        </span>
                        
                        {/* Badge de Responsabilidade */}
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium w-fit ${
                          ticket.responsibility === 'SYNTHEXA' 
                            ? 'bg-red-100 text-red-700 border border-red-200' // Alerta: Está com a gente!
                            : 'bg-blue-50 text-blue-700 border border-blue-100' // Relax: Está com eles
                        }`}>
                          {ticket.responsibility === 'SYNTHEXA' ? 'Aguardando Synthexa' : 'Aguardando Terceiro'}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex flex-col">
                        <span>
                            {format(ticket.updatedAt, "d 'de' MMM", { locale: ptBR })}
                        </span>
                        <span className="text-xs text-gray-400">
                            {format(ticket.updatedAt, "HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                         {/* Link Externo se existir */}
                         {ticket.externalUrl && (
                            <a href={ticket.externalUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600" title="Abrir Link Externo">
                                <ExternalLink className="w-5 h-5" />
                            </a>
                         )}
                         {/* Botão Editar (Ainda sem link) */}
                         <Link href={`/dashboard/tickets/${ticket.id}/edit`} className="rounded-md border p-2 hover:bg-gray-100">
                            Editar
                         </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {tickets.length === 0 && (
                    <tr>
                        <td colSpan={5} className="text-center py-10 text-gray-500">
                            Nenhum ticket encontrado.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}