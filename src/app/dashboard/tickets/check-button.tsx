'use client';

import { BellRing } from 'lucide-react';
import { useState } from 'react';

export default function CheckAlertsButton() {
  const [loading, setLoading] = useState(false);

  async function handleCheck() {
    if (!confirm('Deseja verificar tickets atrasados e enviar e-mail para a equipe?')) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/check-alerts');
      const data = await res.json();
      alert(data.message || 'Verificação concluída.');
    } catch (err) {
      alert('Erro ao verificar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheck}
      disabled={loading}
      className="flex items-center gap-2 rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      title="Verificar tickets parados há +24h"
    >
      <BellRing className={`h-4 w-4 ${loading ? 'animate-pulse text-orange-500' : 'text-gray-500'}`} />
      <span className="hidden md:block">{loading ? 'Verificando...' : 'Verificar Atrasos'}</span>
    </button>
  );
}