import { signOut } from '@/auth';

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Synthexa Nexus</h1>
      <p>Bem-vindo ao sistema seguro.</p>
      
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <button className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600">
          Sair
        </button>
      </form>
    </div>
  );
}