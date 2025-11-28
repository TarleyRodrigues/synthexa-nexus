import { History } from 'lucide-react';

export default function RightSidebar() {
  return (
    <div className="flex h-full flex-col border-l border-gray-200 bg-white w-80 hidden xl:flex">
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <History className="h-5 w-5 text-gray-500" />
        <h2 className="font-semibold text-gray-700">Últimas Atividades</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Placeholder de itens - Depois virá do Banco */}
        <div className="text-sm">
          <p className="font-medium text-gray-900">Admin Synthexa</p>
          <p className="text-gray-500">Alterou o status do ticket #1234 para "Aguardando Terceiro"</p>
          <p className="text-xs text-gray-400 mt-1">Há 10 min</p>
        </div>
        
        <hr />

        <div className="text-sm">
          <p className="font-medium text-gray-900">Admin Synthexa</p>
          <p className="text-gray-500">Criou um novo ticket para MEGA ERP</p>
          <p className="text-xs text-gray-400 mt-1">Há 2 horas</p>
        </div>
      </div>
    </div>
  );
}