import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function TicketsPage() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Tickets de Suporte</h1>
        <Link
          href="/dashboard/tickets/create"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:block">Novo Ticket</span>
        </Link>
      </div>

      <div className="mt-6 flow-root">
        {/* Aqui entrará a tabela depois */}
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center text-gray-500">
          Nenhum ticket cadastrado. Clique em "Novo Ticket" para começar.
        </div>
      </div>
    </div>
  );
}