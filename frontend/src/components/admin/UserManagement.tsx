import { Users, Search } from 'lucide-react';

const users: { id: number, name: string, email: string, bets: number }[] = [];

export default function UserManagement() {
  return (
    <div className="bg-bg-surface border border-border-subtle p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Users /> Gerenciamento de Usuários</h2>
      
      <div className="flex items-center gap-2 mb-4 bg-bg-surface p-2 rounded-lg">
        <Search className="text-text-disabled" />
        <input 
          type="text" 
          placeholder="Buscar por nome, e-mail ou CPF..."
          className="bg-transparent w-full outline-none"
        />
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="p-2">ID</th>
            <th className="p-2">Nome</th>
            <th className="p-2">Email</th>
            <th className="p-2">Apostas</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id} className="border-b border-border-subtle hover:bg-bg-surface/50">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.bets}</td>
              </tr>
            ))
          ) : (
            <tr>
               <td colSpan={4} className="p-4 text-center text-text-disabled">Nenhum usuário sincronizado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
