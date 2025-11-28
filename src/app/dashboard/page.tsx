import { auth } from '../../auth';

export default async function Page() {
  const session = await auth();

  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl font-bold text-gray-800">
        Bem-vindo, {session?.user?.name}
      </h1>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card de Estatística Exemplo */}
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Tickets Abertos</h3>
          <p className="text-2xl font-bold text-gray-900 truncate mt-2">0</p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Aguardando Terceiro</h3>
          <p className="text-2xl font-bold text-orange-600 truncate mt-2">0</p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Aguardando Synthexa</h3>
          <p className="text-2xl font-bold text-blue-600 truncate mt-2">0</p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Tickets Críticos (+5 dias)</h3>
          <p className="text-2xl font-bold text-red-600 truncate mt-2">0</p>
        </div>
      </div>
      
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm border border-gray-100 min-h-[400px]">
        <h2 className="text-lg font-semibold text-gray-700">Visão Geral dos Chamados</h2>
        <p className="text-gray-500 mt-4 text-sm">Nenhum ticket encontrado. (Vamos implementar a tabela em breve)</p>
      </div>
    </main>
  );
}