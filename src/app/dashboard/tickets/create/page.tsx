'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom'; // Hook para ligar com o Server Action
import { createTicket } from '../../../../lib/actions'; // Caminho relativo longo, mas seguro

export default function CreateTicketPage() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createTicket, initialState);

  return (
    <main>
      {/* Breadcrumbs simples */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard/tickets" className="hover:text-blue-600">Tickets</Link>
        <span>/</span>
        <span className="font-medium text-gray-900">Novo Ticket</span>
      </div>

      <form action={dispatch} className="rounded-md bg-white p-6 md:p-8 border border-gray-200 shadow-sm max-w-3xl mx-auto">
        
        {/* Título */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Título do Problema *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Ex: Erro ao gerar nota fiscal"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
            required
          />
          {state.errors?.title && (
            <p className="mt-1 text-sm text-red-500">{state.errors.title}</p>
          )}
        </div>

        {/* Grid de 2 Colunas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
          
          {/* Sistema */}
          <div>
            <label htmlFor="systemName" className="mb-2 block text-sm font-medium">
              Sistema *
            </label>
            <select
              id="systemName"
              name="systemName"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 focus:border-blue-500"
              defaultValue="MEGA ERP"
            >
              <option value="MEGA ERP">MEGA ERP</option>
              <option value="MULTIDADOS">MULTIDADOS</option>
              <option value="CV CRM">CV CRM</option>
              <option value="OUTROS">OUTROS</option>
            </select>
          </div>

          {/* Origem */}
          <div>
            <label htmlFor="origin" className="mb-2 block text-sm font-medium">
              Origem da Demanda *
            </label>
            <select
              id="origin"
              name="origin"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 focus:border-blue-500"
              defaultValue="Interno"
            >
              <option value="Interno">Problema Interno</option>
              <option value="Reunião">Solicitado em Reunião</option>
              <option value="Proativo">Análise Proativa</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          {/* ID Externo */}
          <div>
            <label htmlFor="externalId" className="mb-2 block text-sm font-medium">
              Nº Chamado no Fornecedor *
            </label>
            <input
              id="externalId"
              name="externalId"
              type="text"
              placeholder="#123456"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 focus:border-blue-500"
              required
            />
          </div>

          {/* ID Interno */}
          <div>
            <label htmlFor="internalId" className="mb-2 block text-sm font-medium">
              Nº Chamado Synthexa (Opcional)
            </label>
            <input
              id="internalId"
              name="internalId"
              type="text"
              placeholder="#999"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 focus:border-blue-500"
            />
          </div>
        </div>

        {/* URL Externa */}
        <div className="mb-4">
          <label htmlFor="externalUrl" className="mb-2 block text-sm font-medium">
            Link Direto do Chamado (URL)
          </label>
          <input
            id="externalUrl"
            name="externalUrl"
            type="url"
            placeholder="https://suporte.mega.com.br/tickets/123"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 focus:border-blue-500"
          />
          {state.errors?.externalUrl && (
            <p className="mt-1 text-sm text-red-500">{state.errors.externalUrl}</p>
          )}
        </div>

        {/* Responsabilidade Inicial */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">
            Quem deve agir agora? *
          </label>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                id="resp_third"
                name="responsibility"
                type="radio"
                value="THIRD_PARTY"
                defaultChecked
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="resp_third" className="ml-2 block text-sm font-medium text-gray-700">
                Aguardando Terceiro
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="resp_synthexa"
                name="responsibility"
                type="radio"
                value="SYNTHEXA"
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="resp_synthexa" className="ml-2 block text-sm font-medium text-gray-700">
                Aguardando Synthexa
              </label>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="mb-6">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Observações / Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 focus:border-blue-500"
          ></textarea>
        </div>

        {/* Mensagem Geral de Erro */}
        {state.message && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
            {state.message}
          </div>
        )}

        {/* Botões */}
        <div className="mt-6 flex justify-end gap-4">
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
            Criar Ticket
          </button>
        </div>
      </form>
    </main>
  );
}