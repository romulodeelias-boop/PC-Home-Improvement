import React, { useState, useCallback, useMemo } from 'react';
import { Service, WorkOrder, Status, View } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ServiceManagement from './components/ServiceManagement';
import WorkOrderManagement from './components/WorkOrderManagement';
import Analytics from './components/Analytics';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Aplicação de Primer', description: 'Preparação da superfície com fundo primer.', estimatedDurationHours: 2, photos: [] },
    { id: '2', name: 'Pintura Base (Laca)', description: 'Aplicação da camada de cor base em laca.', estimatedDurationHours: 4, photos: [] },
    { id: '3', name: 'Aplicação de Verniz', description: 'Camada de verniz para brilho e proteção.', estimatedDurationHours: 3, photos: [] },
    { id: '4', name: 'Polimento Técnico', description: 'Polimento para remoção de imperfeições e brilho intenso.', estimatedDurationHours: 5, photos: [] },
  ]);

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    { id: 'wo-1', clientName: 'João Silva', itemDescription: 'Gabinete Cozinha (5 portas)', serviceId: '2', paintColor: 'Preto Ninja', status: Status.Completed, createdAt: new Date(2023, 10, 1), scheduledStartDate: new Date(2023, 10, 1), startedAt: new Date(2023, 10, 1, 9), completedAt: new Date(2023, 10, 1, 14), price: 1200, photos: [] },
    { id: 'wo-2', clientName: 'Maria Oliveira', itemDescription: 'Portas de Guarda-roupas (2)', serviceId: '3', paintColor: 'Branco Banchisa', status: Status.InProgress, createdAt: new Date(2023, 10, 2), scheduledStartDate: new Date(2023, 10, 2), startedAt: new Date(2023, 10, 2, 10), price: 850, photos: [] },
    { id: 'wo-3', clientName: 'Carlos Pereira', itemDescription: 'Balcão de Banheiro', serviceId: '1', status: Status.Pending, createdAt: new Date(2023, 10, 3), scheduledStartDate: new Date(2023, 10, 10), price: 400, photos: [] },
    { id: 'wo-4', clientName: 'Ana Costa', itemDescription: 'Mesa de Jantar e 4 cadeiras', serviceId: '4', paintColor: 'Vermelho Arpoador', status: Status.Pending, createdAt: new Date(2023, 10, 4), price: 1800, photos: [] },
    { id: 'wo-5', clientName: 'Pedro Martins', itemDescription: 'Gabinete Pia (3 portas)', serviceId: '2', paintColor: 'Cinza Silk', status: Status.Canceled, createdAt: new Date(2023, 10, 5), scheduledStartDate: new Date(2023, 10, 7), price: 650, photos: []},
  ]);

  const handleSetView = (newView: View) => {
    setView(newView);
    setIsMobileNavOpen(false); // Close mobile nav on selection
  };

  const addService = useCallback((service: Omit<Service, 'id'>) => {
    setServices(prev => [...prev, { ...service, id: `s-${Date.now()}` }]);
  }, []);

  const updateService = useCallback((updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  }, []);

  const deleteService = useCallback((serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  }, []);

  const addWorkOrder = useCallback((workOrder: Omit<WorkOrder, 'id' | 'status' | 'createdAt'>) => {
    setWorkOrders(prev => [...prev, { ...workOrder, id: `wo-${Date.now()}`, status: Status.Pending, createdAt: new Date() }]);
  }, []);
  
  const updateWorkOrder = useCallback((updatedWorkOrder: WorkOrder) => {
    setWorkOrders(prev => prev.map(wo => wo.id === updatedWorkOrder.id ? updatedWorkOrder : wo));
  }, []);

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard setView={setView} />;
      case 'services':
        return <ServiceManagement services={services} addService={addService} updateService={updateService} deleteService={deleteService} />;
      case 'work-orders':
        return <WorkOrderManagement workOrders={workOrders} services={services} addWorkOrder={addWorkOrder} updateWorkOrder={updateWorkOrder} />;
      case 'analytics':
        return <Analytics workOrders={workOrders} services={services} />;
      default:
        return <Dashboard setView={setView} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-primary">
      <Sidebar 
        currentView={view} 
        setView={handleSetView} 
        isMobileOpen={isMobileNavOpen} 
        setMobileOpen={setIsMobileNavOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;