import { Users, Search } from 'lucide-react';

const users = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', bets: 12 },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', bets: 5 },
];

export default function UserManagement() {
  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Users /> Gerenciamento de Usuários</h2>
      
      <div className="flex items-center gap-2 mb-4 bg-slate-900 p-2 rounded-lg">
        <Search className="text-slate-500" />
        <input 
          type="text" 
          placeholder="Buscar por nome, e-mail ou CPF..."
          className="bg-transparent w-full outline-none"
        />
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="p-2">ID</th>
            <th className="p-2">Nome</th>
            <th className="p-2">Email</th>
            <th className="p-2">Apostas</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.bets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
