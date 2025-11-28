import { fetchTicketById } from '../../../../../lib/data';
import EditTicketForm from './edit-form';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const ticket = await fetchTicketById(id);

  if (!ticket) {
    notFound();
  }

  return (
    <main>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard/tickets" className="hover:text-blue-600">Tickets</Link>
        <span>/</span>
        <span className="font-medium text-gray-900">Editar Ticket</span>
      </div>
      
      <EditTicketForm ticket={ticket} />
    </main>
  );
}