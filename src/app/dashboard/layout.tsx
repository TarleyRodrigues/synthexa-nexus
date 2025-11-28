import SideNav from '../../components/sidenav'; // Caminho relativo
import RightSidebar from '../../components/right-sidebar'; // Caminho relativo

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-gray-50">
      {/* Coluna 1: Navegação Esquerda (Fixa) */}
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      
      {/* Coluna 2: Conteúdo Principal (Scrollável) */}
      <div className="flex-grow md:overflow-y-auto p-6 md:p-12">
        {children}
      </div>

      {/* Coluna 3: Auditoria Direita (Fixa) */}
      <div className="flex-none">
        <RightSidebar />
      </div>
    </div>
  );
}