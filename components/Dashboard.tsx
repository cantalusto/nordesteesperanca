import React, { useMemo } from 'react';
import { Call, QuoteStatus } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Phone, ShoppingCart, AlertCircle } from 'lucide-react';

interface DashboardProps {
  calls: Call[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC<DashboardProps> = ({ calls }) => {
  const stats = useMemo(() => {
    const totalCalls = calls.length;
    const openQuotes = calls.filter((c) => c.quotation?.status === QuoteStatus.OPEN).length;
    const highValueQuotes = calls.filter((c) => c.quotation?.status === QuoteStatus.HIGH_VALUE).length;
    const closedOrders = calls.filter((c) => c.order?.isClosed).length;

    // Group by Employee
    const callsByEmployee: Record<string, number> = {};
    calls.forEach((call) => {
      callsByEmployee[call.employeeName] = (callsByEmployee[call.employeeName] || 0) + 1;
    });
    
    const chartData = Object.keys(callsByEmployee).map((name) => ({
      name,
      ligacoes: callsByEmployee[name],
    }));

    // Orders vs Quotes
    const funnelData = [
      { name: 'Total de Ligações', value: totalCalls },
      { name: 'Cotações', value: openQuotes + highValueQuotes + closedOrders }, // Approximating that closed orders came from quotes
      { name: 'Pedidos Fechados', value: closedOrders },
    ];

    return {
      totalCalls,
      openQuotes,
      highValueQuotes,
      closedOrders,
      chartData,
      funnelData,
    };
  }, [calls]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Analítico</h2>
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Ligações</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalCalls}</h3>
            </div>
            <Phone className="text-blue-500 h-8 w-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cotações em Aberto</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.openQuotes}</h3>
            </div>
            <TrendingUp className="text-yellow-500 h-8 w-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Valor Alto</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.highValueQuotes}</h3>
            </div>
            <AlertCircle className="text-red-500 h-8 w-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pedidos Fechados</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.closedOrders}</h3>
            </div>
            <ShoppingCart className="text-green-500 h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Ligações por Funcionário</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ligacoes" fill="#16a34a" name="Ligações" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Funil de Vendas (Proporção)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.funnelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
