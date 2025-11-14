import React, { useMemo, useState, useEffect } from 'react';
import { WorkOrder, Service, Status } from '../types';

// Fix: Inform TypeScript that Recharts exists on the window object, as it's loaded from a CDN.
declare global {
  interface Window {
    Recharts: any;
  }
}

// FIX: Add missing type definition for AnalyticsProps.
interface AnalyticsProps {
  workOrders: WorkOrder[];
  services: Service[];
}

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.293a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const Analytics: React.FC<AnalyticsProps> = ({ workOrders, services }) => {
  const [rechartsReady, setRechartsReady] = useState(!!window.Recharts);

  useEffect(() => {
    if (rechartsReady) return;

    const intervalId = setInterval(() => {
      if (window.Recharts) {
        setRechartsReady(true);
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [rechartsReady]);

  const serviceDistributionData = useMemo(() => {
    const serviceCounts: { [key: string]: number } = {};
    workOrders.forEach(wo => {
      serviceCounts[wo.serviceId] = (serviceCounts[wo.serviceId] || 0) + 1;
    });
    return services.map(service => ({
      name: service.name,
      count: serviceCounts[service.id] || 0,
    }));
  }, [workOrders, services]);

  const statusDistributionData = useMemo(() => {
    const statusCounts: { [key in Status]: number } = {
      [Status.Pending]: 0,
      [Status.InProgress]: 0,
      [Status.Completed]: 0,
      [Status.Canceled]: 0,
    };
    workOrders.forEach(wo => {
      statusCounts[wo.status]++;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [workOrders]);
  
  const exportToCSV = (data: any[], filename: string, headers: Record<string, string>) => {
    if (!data || data.length === 0) {
        alert("Não há dados para exportar.");
        return;
    }

    const columnKeys = Object.keys(headers);
    const columnNames = Object.values(headers);

    let csvContent = "data:text/csv;charset=utf-8," + columnNames.join(",") + "\n";
    
    data.forEach(item => {
        const row = columnKeys.map(key => {
            let cell = item[key] === null || item[key] === undefined ? '' : item[key];
            cell = String(cell).replace(/"/g, '""'); // escape double quotes
            if (String(cell).includes(',')) {
                cell = `"${cell}"`; // wrap in double quotes if it contains a comma
            }
            return cell;
        }).join(",");
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportServiceDistribution = () => {
    exportToCSV(
        serviceDistributionData, 
        'distribuicao_servicos.csv',
        { name: 'Serviço', count: 'Quantidade' }
    );
  };

  const handleExportStatusDistribution = () => {
    exportToCSV(
        statusDistributionData, 
        'status_ordens_servico.csv',
        { name: 'Status', value: 'Quantidade' }
    );
  };

  const COLORS = {
    [Status.Completed]: '#22c55e', // green-500
    [Status.InProgress]: '#3b82f6', // blue-500
    [Status.Pending]: '#f59e0b', // amber-500
    [Status.Canceled]: '#ef4444', // red-500
  };

  if (!rechartsReady) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-6">Análises e Relatórios</h1>
        <div className="grid grid-cols-1 gap-8">
            <div className="bg-surface rounded-xl shadow-lg p-6 flex justify-center items-center min-h-[372px]">
            <p className="text-text-secondary animate-pulse">Carregando Gráficos...</p>
            </div>
            <div className="bg-surface rounded-xl shadow-lg p-6 flex justify-center items-center min-h-[372px]">
            <p className="text-text-secondary animate-pulse">Carregando Gráficos...</p>
            </div>
        </div>
      </div>
    );
  }

  // Since Recharts is loaded from a CDN, we access it from the window object.
  const { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } = window.Recharts;

  return (
    <div>
        <h1 className="text-3xl font-bold text-text-primary mb-6">Análises e Relatórios</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">Distribuição de Serviços</h2>
                <button 
                    onClick={handleExportServiceDistribution}
                    className="flex items-center gap-2 py-1 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-text-secondary text-sm font-semibold transition-colors"
                    aria-label="Exportar dados de distribuição de serviços para CSV"
                >
                    <DownloadIcon className="w-4 h-4" />
                    CSV
                </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceDistributionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                <YAxis tick={{ fill: '#64748b' }} />
                <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                    labelStyle={{ color: '#1e293b' }}
                />
                <Legend wrapperStyle={{ color: '#64748b' }} />
                <Bar dataKey="count" fill="#0ea5e9" name="Nº de O.S." />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-surface rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-primary">Status das Ordens de Serviço</h2>
              <button 
                  onClick={handleExportStatusDistribution}
                  className="flex items-center gap-2 py-1 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-text-secondary text-sm font-semibold transition-colors"
                  aria-label="Exportar dados de status das ordens de serviço para CSV"
              >
                  <DownloadIcon className="w-4 h-4" />
                  CSV
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelStyle={{ fill: '#1e293b', fontWeight: 'bold' }}
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as Status]} />
                  ))}
                </Pie>
                 <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                    labelStyle={{ color: '#1e293b' }}
                />
                <Legend wrapperStyle={{ color: '#64748b' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
    </div>
  );
};

export default Analytics;