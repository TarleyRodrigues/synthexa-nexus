import { History, UserCircle } from 'lucide-react';
import { fetchLatestLogs } from '../lib/data'; // Caminho relativo
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default async function RightSidebar() {
  const logs = await fetchLatestLogs();

  return (
    <div className="flex h-full flex-col border-l border-gray-200 bg-white w-80 hidden xl:flex">
      <div className="p-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
        <History className="h-5 w-5 text-gray-600" />
        <h2 className="font-semibold text-gray-700 text-sm">Últimas Atividades</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {logs.map((log) => (
             <div key={log.id} className="relative pl-4 border-l-2 border-gray-200">
                <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-gray-400"></div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <UserCircle className="w-3 h-3" />
                        <span className="font-medium text-gray-700">{log.user.name || 'Usuário'}</span>
                    </div>
                    
                    <p className="text-sm text-gray-800 leading-snug">
                        {log.details}
                    </p>
                    
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                        {formatDistanceToNow(log.timestamp, { addSuffix: true, locale: ptBR })}
                    </p>
                </div>
             </div>
        ))}

        {logs.length === 0 && (
            <p className="text-sm text-gray-400 text-center italic">Nenhuma atividade recente.</p>
        )}
      </div>
    </div>
  );
}