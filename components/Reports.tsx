import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UserRole } from '../types';

const Reports: React.FC = () => {
  const [employeeFilter, setEmployeeFilter] = useState('');
  
  const generatePDF = () => {
    const doc = new jsPDF();
    const calls = StorageService.getCalls().filter(c => 
        employeeFilter ? c.employeeId === employeeFilter : true
    );
    const users = StorageService.getUsers();

    // Header
    doc.setFontSize(18);
    doc.setTextColor(22, 163, 74); // Green-600
    doc.text('Esperança Nordeste - Relatório de Ligações', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`, 14, 30);
    if(employeeFilter) {
        const empName = users.find(u => u.id === employeeFilter)?.name || 'Desconhecido';
        doc.text(`Filtro por Funcionário: ${empName}`, 14, 36);
    }

    // Table Data
    const tableData = calls.map(call => [
      new Date(call.createdAt).toLocaleDateString(),
      call.employeeName,
      call.companyName,
      call.phoneNumber,
      call.quotation ? `R$ ${call.quotation.value}` : '-',
      call.order?.isClosed ? 'Sim' : 'Não'
    ]);

    autoTable(doc, {
      head: [['Data', 'Funcionário', 'Empresa', 'Telefone', 'Cotação', 'Pedido Fechado']],
      body: tableData,
      startY: 45,
      headStyles: { fillColor: [22, 163, 74] },
    });

    doc.save('relatorio_esperanca_nordeste.pdf');
  };

  const users = StorageService.getUsers().filter(u => u.role === UserRole.EMPLOYEE);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Relatórios</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="text-blue-500" /> Exportar Dados
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Funcionário (Opcional)</label>
                <select 
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                    value={employeeFilter}
                    onChange={(e) => setEmployeeFilter(e.target.value)}
                >
                    <option value="">Todos</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
            </div>
            
            <button 
                onClick={generatePDF}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full md:w-auto"
            >
                <Download size={18} /> Baixar PDF
            </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">
            * O relatório será gerado com base nos filtros selecionados e incluirá detalhes de data, funcionário, cliente e status financeiro.
        </p>
      </div>
    </div>
  );
};

export default Reports;
