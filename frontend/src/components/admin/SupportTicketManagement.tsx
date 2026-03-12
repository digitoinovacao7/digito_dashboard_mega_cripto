import { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Clock, Trash2, Mail } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface Ticket {
  id: string;
  name: string;
  email: string;
  description: string;
  status: 'open' | 'resolved';
  createdAt: any;
}

export default function SupportTicketManagement() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
      setTickets(ticketsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tickets:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleResolve = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'open' ? 'resolved' : 'open';
      await updateDoc(doc(db, 'support_tickets', id), {
        status: newStatus
      });
      toast.success(`Ticket marcado como ${newStatus === 'resolved' ? 'resolvido' : 'aberto'}.`);
    } catch (error) {
      toast.error('Erro ao atualizar ticket.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este ticket?')) {
      try {
        await deleteDoc(doc(db, 'support_tickets', id));
        toast.success('Ticket excluído.');
      } catch (error) {
        toast.error('Erro ao excluir ticket.');
      }
    }
  };

  return (
    <div className="bg-bg-surface border border-border-subtle p-8 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
            <MessageSquare className="text-primary-accent" /> Suporte ao Cliente
          </h2>
          <p className="text-text-secondary text-sm mt-1">Gerencie os tickets de suporte enviados pelos usuários.</p>
        </div>
        <div className="px-4 py-2 bg-bg-base rounded-lg border border-border-subtle text-xs font-mono">
          Total: {tickets.length} tickets
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border-subtle text-text-disabled text-xs uppercase tracking-wider">
              <th className="p-4 font-bold">Data</th>
              <th className="p-4 font-bold">Usuário</th>
              <th className="p-4 font-bold">Descrição</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-disabled font-mono text-sm animate-pulse">Buscando tickets no banco de dados...</td>
              </tr>
            ) : tickets.length > 0 ? (
              tickets.map(ticket => (
                <tr key={ticket.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-sm font-mono text-text-secondary whitespace-nowrap">
                    {ticket.createdAt?.toDate().toLocaleDateString('pt-BR')} <br/>
                    <span className="text-[10px] opacity-50">{ticket.createdAt?.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'})}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm block">{ticket.name}</span>
                      <a href={`mailto:${ticket.email}`} className="text-xs text-primary-accent hover:underline flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {ticket.email}
                      </a>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-text-secondary max-w-md line-clamp-2 italic">
                      "{ticket.description}"
                    </p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ticket.status === 'open' 
                        ? 'bg-feedback-warning/10 text-feedback-warning border border-feedback-warning/20' 
                        : 'bg-feedback-success/10 text-feedback-success border border-feedback-success/20'
                    }`}>
                      {ticket.status === 'open' ? 'Aberto' : 'Resolvido'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleResolve(ticket.id, ticket.status)}
                        className={`p-2 rounded-lg border transition-all ${
                          ticket.status === 'open' 
                            ? 'border-feedback-success/30 text-feedback-success hover:bg-feedback-success/10' 
                            : 'border-border-subtle text-text-disabled hover:text-white'
                        }`}
                        title={ticket.status === 'open' ? "Marcar como Resolvido" : "Reabrir Ticket"}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(ticket.id)}
                        className="p-2 border border-feedback-error/30 text-feedback-error hover:bg-feedback-error/10 rounded-lg transition-all"
                        title="Excluir Ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <Clock className="w-12 h-12" />
                    <p className="text-text-disabled font-medium">Nenhum ticket pendente no sistema.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
