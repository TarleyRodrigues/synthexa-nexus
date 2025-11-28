'use client';

import { Ticket } from '@prisma/client';
import { updateTicket } from '../../../../../lib/actions'; // Ajuste o caminho conforme profundidade
import { useFormState } from 'react-dom';
import Link from 'next/link';

export default function EditTicketForm({ ticket }: { ticket: Ticket }) {
  const updateTicketWithId = updateTicket.bind(null, ticket.id);
  const [state, dispatch] = useFormState(updateTicketWithId, { message: null, errors: {} });

  return (
    <form action={dispatch} className="rounded-md bg-white p-6 border border-gray-200 shadow-sm max-w-3xl mx-auto">
      
      <div className="mb-6 border-b pb-4">
        <h2 className="text-lg font-bold text-gray-800">{ticket.title}</h2>
        <p className="text-sm text-gray-500">
          {ticket.systemName} - {ticket.externalId}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
        {/* Status */}
        <div className="rounded-lg border p-4 bg-gray-50">
          <label className="block text-sm font-medium mb-2 text-gray-900">Status do Ticket</label>
          <select
            name="status"
            defaultValue={ticket.status}
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="OPEN">Aberto (Em andamento)</option>
            <option value="CLOSED">Fechado (Resolvido)</option>
          </select>
        </div>

        {/* Responsabilidade */}
        <div className="rounded-lg border p-4 bg-gray-50">
          <label className="block text-sm font-medium mb-2 text-gray-900">Com quem está a bola?</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="resp_third"
                name="responsibility"
                type="radio"
                value="THIRD_PARTY"
                defaultChecked={ticket.responsibility === 'THIRD_PARTY'}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="resp_third" className="ml-2 text-sm text-gray-700">
                Aguardando Terceiro
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="resp_synthexa"
                name="responsibility"
                type="radio"
                value="SYNTHEXA"
                defaultChecked={ticket.responsibility === 'SYNTHEXA'}
                className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-600"
              />
              <label htmlFor="resp_synthexa" className="ml-2 text-sm font-bold text-gray-700">
                Aguardando Synthexa
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* URL Externa */}
      <div className="mb-4">
        <label htmlFor="externalUrl" className="mb-2 block text-sm font-medium">
          Link do Chamado (Atualizar se necessário)
        </label>
        <input
          id="externalUrl"
          name="externalUrl"
          defaultValue={ticket.externalUrl || ''}
          type="url"
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 focus:border-blue-500"
        />
      </div>

      {/* Descrição / Obs */}
      <div className="mb-6">
        <label htmlFor="description" className="mb-2 block text-sm font-medium">
          Descrição / Observações Atuais
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={ticket.description || ''}
          rows={4}
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 focus:border-blue-500"
        ></textarea>
      </div>

      <div className="flex justify-end gap-4">
        <Link
          href="/dashboard/tickets"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Salvar Alterações
        </button>
      </div>
    </form>
  );
}