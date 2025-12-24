import React, { useState, useEffect } from 'react';
import { Call, User, UserRole, QuoteStatus, Quotation } from '../types';
import { StorageService } from '../services/storage';
import { Phone, Plus, FileText, CheckCircle, Search, Edit3 } from 'lucide-react';

interface CallManagementProps {
  currentUser: User;
}

const CallManagement: React.FC<CallManagementProps> = ({ currentUser }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCall, setEditingCall] = useState<Call | null>(null);

  // Form State - Call
  const [companyName, setCompanyName] = useState('');
  const [clientCode, setClientCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [notes, setNotes] = useState('');
  
  // Form State - Quotation & Order
  const [hasQuote, setHasQuote] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState('');
  const [quoteValue, setQuoteValue] = useState<number>(0);
  const [quoteStatus, setQuoteStatus] = useState<QuoteStatus>(QuoteStatus.OPEN);
  
  const [hasOrder, setHasOrder] = useState(false);
  const [orderClosed, setOrderClosed] = useState(false);

  useEffect(() => {
    loadCalls();
  }, [currentUser]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = calls.filter(call =>
      call.companyName.toLowerCase().includes(term) ||
      call.clientCode.toLowerCase().includes(term) ||
      call.employeeName.toLowerCase().includes(term)
    );
    setFilteredCalls(filtered);
  }, [searchTerm, calls]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const loadCalls = () => {
    let allCalls = StorageService.getCalls();
    // Sort by date desc
    allCalls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (currentUser.role === UserRole.EMPLOYEE) {
      allCalls = allCalls.filter((c) => c.employeeId === currentUser.id);
    }
    setCalls(allCalls);
    setFilteredCalls(allCalls);
  };

  const resetForm = () => {
    setEditingCall(null);
    setCompanyName('');
    setClientCode('');
    setPhoneNumber('');
    setContactPerson('');
    setNotes('');
    setHasQuote(false);
    setQuoteNumber('');
    setQuoteValue(0);
    setQuoteStatus(QuoteStatus.OPEN);
    setHasOrder(false);
    setOrderClosed(false);
  };

  const handleOpenModal = (call?: Call) => {
    resetForm();
    if (call) {
      setEditingCall(call);
      setCompanyName(call.companyName);
      setClientCode(call.clientCode);
      setPhoneNumber(call.phoneNumber);
      setContactPerson(call.contactPerson);
      setNotes(call.notes);
      
      if (call.quotation) {
        setHasQuote(true);
        setQuoteNumber(call.quotation.number);
        setQuoteValue(call.quotation.value);
        setQuoteStatus(call.quotation.status);
      }

      if (call.order) {
        setHasOrder(true);
        setOrderClosed(call.order.isClosed);
      }
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const quotation: Quotation | undefined = hasQuote ? {
        number: quoteNumber,
        companyName: companyName,
        value: Number(quoteValue),
        status: quoteStatus
    } : undefined;

    const order = hasOrder ? {
        isClosed: orderClosed,
        closedAt: orderClosed ? new Date().toISOString() : undefined
    } : undefined;

    const callData: Call = {
      id: editingCall ? editingCall.id : Date.now().toString(),
      employeeId: editingCall ? editingCall.employeeId : currentUser.id,
      employeeName: editingCall ? editingCall.employeeName : currentUser.name,
      companyName,
      clientCode,
      phoneNumber,
      contactPerson,
      notes,
      createdAt: editingCall ? editingCall.createdAt : new Date().toISOString(),
      quotation,
      order
    };

    StorageService.saveCall(callData);
    loadCalls();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
            {currentUser.role === UserRole.ADMIN ? 'Todas as Ligações' : 'Minhas Ligações'}
        </h2>
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar empresa, código..." 
                    className="pl-9 w-full border border-gray-300 rounded-md py-2 focus:ring-green-500 focus:border-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
            <Plus size={18} /> Nova Ligação
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCalls.map((call) => (
            <div key={call.id} className="bg-white rounded-lg shadow-md border-t-4 border-green-500 p-5 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800 truncate" title={call.companyName}>{call.companyName}</h3>
                    <div className="flex gap-2">
                         <button onClick={() => handleOpenModal(call)} className="text-gray-400 hover:text-blue-600">
                            <Edit3 size={18} />
                         </button>
                    </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p className="flex items-center gap-2"><span className="font-semibold">Cód:</span> {call.clientCode}</p>
                    <p className="flex items-center gap-2"><Phone size={14} /> {call.phoneNumber}</p>
                    <p className="text-xs text-gray-500">Contato: {call.contactPerson}</p>
                    <p className="text-xs text-gray-400">{new Date(call.createdAt).toLocaleString('pt-BR')}</p>
                    {currentUser.role === UserRole.ADMIN && (
                        <p className="text-xs font-semibold text-green-700">Func: {call.employeeName}</p>
                    )}
                </div>

                <div className="border-t border-gray-100 pt-3 flex flex-wrap gap-2">
                    {call.quotation && (
                        <span className={`text-xs px-2 py-1 rounded-full border ${call.quotation.status === QuoteStatus.HIGH_VALUE ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                            Cotação: R$ {call.quotation.value}
                        </span>
                    )}
                    {call.order?.isClosed && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                            <CheckCircle size={10} /> Pedido Fechado
                        </span>
                    )}
                    {!call.quotation && !call.order?.isClosed && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">Prospecção</span>
                    )}
                </div>
            </div>
        ))}
        {filteredCalls.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
                Nenhuma ligação encontrada.
            </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            margin: 0,
            padding: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflowY: 'auto'
          }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">{editingCall ? 'Editar Registro' : 'Registrar Ligação'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Call Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                    <input type="text" required className="w-full border rounded p-2 mt-1" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Código Cliente</label>
                    <input type="text" required className="w-full border rounded p-2 mt-1" value={clientCode} onChange={e => setClientCode(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input type="text" required className="w-full border rounded p-2 mt-1" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contato</label>
                    <input type="text" required className="w-full border rounded p-2 mt-1" value={contactPerson} onChange={e => setContactPerson(e.target.value)} />
                  </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea required className="w-full border rounded p-2 h-24" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              {/* Quotation Section */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" id="hasQuote" checked={hasQuote} onChange={e => setHasQuote(e.target.checked)} className="rounded text-green-600 focus:ring-green-500" />
                    <label htmlFor="hasQuote" className="font-semibold text-blue-800 flex items-center gap-2"><FileText size={16}/> Gerar Cotação</label>
                </div>
                {hasQuote && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-600">Número Cotação</label>
                            <input type="text" className="w-full border rounded p-1" value={quoteNumber} onChange={e => setQuoteNumber(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600">Valor (R$)</label>
                            <input type="number" step="0.01" className="w-full border rounded p-1" value={quoteValue} onChange={e => setQuoteValue(Number(e.target.value))} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600">Status</label>
                            <select className="w-full border rounded p-1" value={quoteStatus} onChange={e => setQuoteStatus(e.target.value as QuoteStatus)}>
                                <option value={QuoteStatus.OPEN}>{QuoteStatus.OPEN}</option>
                                <option value={QuoteStatus.HIGH_VALUE}>{QuoteStatus.HIGH_VALUE}</option>
                            </select>
                        </div>
                    </div>
                )}
              </div>

              {/* Order Section */}
              <div className="bg-green-50 p-4 rounded-lg">
                 <div className="flex items-center gap-2">
                    <input type="checkbox" id="hasOrder" checked={hasOrder} onChange={e => setHasOrder(e.target.checked)} className="rounded text-green-600 focus:ring-green-500" />
                    <label htmlFor="hasOrder" className="font-semibold text-green-800 flex items-center gap-2"><CheckCircle size={16}/> Registro de Pedido</label>
                </div>
                {hasOrder && (
                    <div className="mt-2 ml-6">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={orderClosed} onChange={e => setOrderClosed(e.target.checked)} />
                            <span className="text-sm">Pedido Fechado?</span>
                        </label>
                    </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Salvar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallManagement;
