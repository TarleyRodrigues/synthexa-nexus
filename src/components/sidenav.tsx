import Link from 'next/link';
import { Home, Ticket, Settings, Power, Activity } from 'lucide-react';
import { signOut } from '../auth'; // Caminho relativo ../auth.ts

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* Logo / Header */}
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/dashboard"
      >
        <div className="w-32 text-white md:w-40">
          <Activity className="h-10 w-10" />
          <div className="font-bold text-lg mt-2">Synthexa Nexus</div>
        </div>
      </Link>

      {/* Links de Navegação */}
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <Link
          href="/dashboard"
          className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <Home className="w-6" />
          <p className="hidden md:block">Visão Geral</p>
        </Link>
        
        <Link
          href="/dashboard/tickets"
          className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <Ticket className="w-6" />
          <p className="hidden md:block">Tickets</p>
        </Link>

        {/* Espaço flexível para empurrar logout para baixo */}
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>

        {/* Botão de Logout (Server Action) */}
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-red-100 hover:text-red-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <Power className="w-6" />
            <div className="hidden md:block">Sair</div>
          </button>
        </form>
      </div>
    </div>
  );
}