import React, { useState, useEffect, useMemo } from 'react';
import { WorkOrder, Service, Status } from '../types';
import Modal from './Modal';
import WorkOrderDetail from './WorkOrderDetail';

interface WorkOrderManagementProps {
  workOrders: WorkOrder[];
  services: Service[];
  addWorkOrder: (workOrder: Omit<WorkOrder, 'id' | 'status' | 'createdAt'>) => void;
  updateWorkOrder: (workOrder: WorkOrder) => void;
}

const WorkOrderForm: React.FC<{
    onSubmit: (wo: Omit<WorkOrder, 'id' | 'status' | 'createdAt'> | WorkOrder) => void;
    services: Service[];
    onClose: () => void;
    initialData?: WorkOrder | null;
}> = ({ onSubmit, services, onClose, initialData }) => {
    const [clientName, setClientName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [paintColor, setPaintColor] = useState('');
    const [scheduledStartDate, setScheduledStartDate] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [photos, setPhotos] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setClientName(initialData.clientName);
            setItemDescription(initialData.itemDescription);
            setServiceId(initialData.serviceId);
            setPaintColor(initialData.paintColor || '');
            setScheduledStartDate(initialData.scheduledStartDate ? new Date(initialData.scheduledStartDate).toISOString().split('T')[0] : '');
            setPrice(initialData.price ?? '');
            setPhotos(initialData.photos);
        } else {
            setClientName('');
            setItemDescription('');
            setServiceId(services.length > 0 ? services[0].id : '');
            setPaintColor('');
            setScheduledStartDate('');
            setPrice('');
            setPhotos([]);
        }
    }, [initialData, services]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPhotos(prevPhotos => [...prevPhotos, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemovePhoto = (index: number) => {
        setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientName || !itemDescription || !serviceId) return;
        const scheduledDate = scheduledStartDate ? new Date(scheduledStartDate + 'T00:00:00') : undefined;
        
        const commonData = {
            clientName, 
            itemDescription, 
            serviceId, 
            paintColor: paintColor || undefined, 
            scheduledStartDate: scheduledDate,
            price: price ? Number(price) : undefined,
            photos
        };

        if (initialData) {
            onSubmit({
                ...initialData,
                ...commonData
            });
        } else {
            onSubmit(commonData);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Nome do Cliente</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} required className="w-full bg-slate-100 text-text-primary rounded-md p-2 border border-secondary focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Descrição do Item (Ex: Gabinete de Cozinha)</label>
                <input type="text" value={itemDescription} onChange={e => setItemDescription(e.target.value)} required className="w-full bg-slate-100 text-text-primary rounded-md p-2 border border-secondary focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
             <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Cor da Tinta (Opcional)</label>
                <input type="text" value={paintColor} onChange={e => setPaintColor(e.target.value)} placeholder="Ex: Branco Neve, Cinza Grafite" className="w-full bg-slate-100 text-text-primary rounded-md p-2 border border-secondary focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Serviço</label>
                    <select value={serviceId} onChange={e => setServiceId(e.target.value)} required className="w-full bg-slate-100 text-text-primary rounded-md p-2 border border-secondary focus:ring-2 focus:ring-primary focus:border-primary">
                        {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Preço (R$)</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Ex: 1250.00" className="w-full bg-slate-100 text-text-primary rounded-md p-2 border border-secondary focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Data de Início Agendada (Opcional)</label>
                <input type="date" value={scheduledStartDate} onChange={e => setScheduledStartDate(e.target.value)} className="w-full bg-slate-100 text-text-primary rounded-md p-2 border border-secondary focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
             <div>
                 <label className="block text-sm font-medium text-text-secondary mb-1">Fotos (Antes/Depois)</label>
                 <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"/>
            </div>

            {photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                            <img src={photo} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                            <button 
                                type="button" 
                                onClick={() => handleRemovePhoto(index)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remover foto"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg bg-slate-200 hover:bg-slate-300 text-text-primary font-semibold transition-colors">Cancelar</button>
                <button type="submit" className="py-2 px-4 rounded-lg bg-primary hover:bg-sky-600 text-white font-semibold transition-colors">{initialData ? 'Atualizar Ordem de Serviço' : 'Criar Ordem de Serviço'}</button>
            </div>
        </form>
    );
};

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
    const colorClasses = {
      [Status.Pending]: 'bg-yellow-100 text-yellow-800',
      [Status.InProgress]: 'bg-blue-100 text-blue-800',
      [Status.Completed]: 'bg-green-100 text-green-800',
      [Status.Canceled]: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClasses[status]}`}>
        {status}
      </span>
    );
};

const PhotoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
  </svg>
);

const WorkOrderManagement: React.FC<WorkOrderManagementProps> = ({ workOrders, services, addWorkOrder, updateWorkOrder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  const [viewingPhotos, setViewingPhotos] = useState<string[] | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [clientNameFilter, setClientNameFilter] = useState('');
  const [paintColorFilter, setPaintColorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [detailedViewOrder, setDetailedViewOrder] = useState<WorkOrder | null>(null);

  const filteredWorkOrders = useMemo(() => {
    let filtered = [...workOrders];

    if (clientNameFilter) {
      filtered = filtered.filter(wo => 
        wo.clientName.toLowerCase().includes(clientNameFilter.toLowerCase())
      );
    }
    
    if (paintColorFilter) {
        filtered = filtered.filter(wo =>
            wo.paintColor && wo.paintColor.toLowerCase().includes(paintColorFilter.toLowerCase())
        );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(wo => wo.status === statusFilter);
    }

    if (startDateFilter) {
      const start = new Date(startDateFilter + 'T00:00:00').getTime();
      filtered = filtered.filter(wo => wo.createdAt.getTime() >= start);
    }

    if (endDateFilter) {
      const end = new Date(endDateFilter + 'T23:59:59').getTime();
      filtered = filtered.filter(wo => wo.createdAt.getTime() <= end);
    }

    return filtered.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [workOrders, clientNameFilter, paintColorFilter, statusFilter, startDateFilter, endDateFilter]);
  
  const openModalForNew = () => {
    setEditingWorkOrder(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (workOrder: WorkOrder) => {
    setEditingWorkOrder(workOrder);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWorkOrder(null);
  };

  const getServiceName = (serviceId: string) => {
    return services.find(s => s.id === serviceId)?.name || 'N/A';
  }

  const handleStatusChange = (wo: WorkOrder, newStatus: Status) => {
    let updatedWo = { ...wo, status: newStatus };
    if (newStatus === Status.InProgress && !wo.startedAt) {
      updatedWo.startedAt = new Date();
    } else if (newStatus === Status.Completed) {
      updatedWo.completedAt = new Date();
    }
    updateWorkOrder(updatedWo);
  };
  
  const handleFormSubmit = (woData: Omit<WorkOrder, 'id' | 'status' | 'createdAt'> | WorkOrder) => {
    if ('id' in woData) {
        updateWorkOrder(woData as WorkOrder);
    } else {
        addWorkOrder(woData as Omit<WorkOrder, 'id' | 'status' | 'createdAt'>);
    }
    closeModal();
  }
  
  const handleViewDetails = (workOrder: WorkOrder) => {
    setDetailedViewOrder(workOrder);
  };

  const handleClearFilters = () => {
    setClientNameFilter('');
    setPaintColorFilter('');
    setStatusFilter('all');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  const handleOpenPhotoViewer = (photos: string[]) => {
    setViewingPhotos(photos);
    setCurrentPhotoIndex(0);
  };

  const handleClosePhotoViewer = () => {
      setViewingPhotos(null);
  };

  const goToPreviousPhoto = () => {
      setCurrentPhotoIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const goToNextPhoto = () => {
      if (viewingPhotos) {
          setCurrentPhotoIndex(prev => (prev < viewingPhotos.length - 1 ? prev + 1 : prev));
      }
  };
  
  if (detailedViewOrder) {
    return (
      <WorkOrderDetail
        workOrder={detailedViewOrder}
        services={services}
        onClose={() => setDetailedViewOrder(null)}
        updateWorkOrder={(updatedWo) => {
            updateWorkOrder(updatedWo);
            setDetailedViewOrder(updatedWo);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-text-primary">Ordens de Serviço</h1>
        <button onClick={openModalForNew} className="self-end md:self-auto bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Nova Ordem de Serviço
        </button>
      </div>
      
      <div className="bg-surface p-4 rounded-lg mb-6 shadow-sm border border-secondary">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label htmlFor="client-name-filter" className="block text-sm font-medium text-text-secondary mb-1">Cliente</label>
                <input 
                    type="text" 
                    id="client-name-filter"
                    value={clientNameFilter}
                    onChange={e => setClientNameFilter(e.target.value)}
                    placeholder="Pesquisar por nome..."
                    className="w-full bg-slate-100 text-text-primary rounded-md p-2 border border-secondary focus:ring-2 focus:ring-primary focus:border-primary"
                />
            </div>

            <div>
                <label htmlFor="paint-color-filter" className="block text-sm font-medium text-text-secondary mb-1">Cor da Tinta</label>
                <input 
                    type="text" 
                    id="paint-color-filter"
                    value={paintColorFilter}
                    onChange={e => setPaintColorFilter(e.target.value)}
                    placeholder="Pesquisar por cor..."
                    className="w-full bg-slate-100 text-text-primary rounded-md p-2 border border-secondary focus:ring-2 focus:ring-primary focus:border-primary"
                />
            </div>

            <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                <select 
                    id="status-filter"
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value as Status | 'all')}
                    className="w-full bg-slate-100 text-text-primary rounded-md p-2 border border-secondary focus:ring-2 focus:ring-primary focus:border-primary"
                >
                    <option value="all">Todos</option>
                    {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div>
                <label htmlFor="start-date-filter" className="block text-sm font-medium text-text-secondary mb-1">Criado Desde</label>
                <input 
                    type="date" 
                    id="start-date-filter"
                    value={startDateFilter}
                    onChange={e => setStartDateFilter(e.target.value)}
                    className="w-full bg-slate-100 text-text-primary rounded-md p-2 border border-secondary focus:ring-2 focus:ring-primary focus:border-primary"
                />
            </div>
            
            <div>
                <label htmlFor="end-date-filter" className="block text-sm font-medium text-text-secondary mb-1">Criado Até</label>
                <input 
                    type="date" 
                    id="end-date-filter"
                    value={endDateFilter}
                    onChange={e => setEndDateFilter(e.target.value)}
                    className="w-full bg-slate-100 text-text-primary rounded-md p-2 border border-secondary focus:ring-2 focus:ring-primary focus:border-primary"
                />
            </div>

            <div className="md:col-start-4">
              <label className="block text-sm font-medium text-transparent mb-1">Limpar</label>
              <button 
                  onClick={handleClearFilters}
                  className="w-full py-2 px-4 rounded-lg bg-slate-200 hover:bg-slate-300 text-text-primary font-semibold transition-colors"
              >
                  Limpar Filtros
              </button>
            </div>
          </div>
      </div>

      <div className="bg-surface rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-secondary bg-slate-50">
              <tr>
                <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider">Cliente / Item</th>
                <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider">Serviço</th>
                <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider text-center">Fotos</th>
                <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider">Status</th>
                <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider">Datas</th>
                <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary">
              {filteredWorkOrders.length > 0 ? (
                filteredWorkOrders.map(wo => (
                  <tr key={wo.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <button 
                        onClick={() => handleViewDetails(wo)}
                        className="font-medium text-primary hover:underline text-left transition-colors"
                      >
                        {wo.clientName}
                      </button>
                      <p className="text-sm text-text-secondary">{wo.itemDescription}</p>
                      {wo.paintColor && <p className="text-xs text-sky-600 mt-1">Cor: {wo.paintColor}</p>}
                      {wo.price && <p className="text-xs font-semibold text-green-600 mt-1">R$ {wo.price.toFixed(2)}</p>}
                    </td>
                    <td className="p-4 text-text-primary">{getServiceName(wo.serviceId)}</td>
                    <td className="p-4 text-center">
                      {wo.photos.length > 0 ? (
                          <button 
                              onClick={() => handleOpenPhotoViewer(wo.photos)} 
                              className="inline-flex items-center justify-center gap-2 bg-slate-200 text-text-primary font-semibold py-1 px-3 rounded-full hover:bg-slate-300 transition-colors text-sm"
                              aria-label={`Ver ${wo.photos.length} fotos`}
                          >
                            <PhotoIcon className="w-4 h-4" />
                            <span>{wo.photos.length}</span>
                          </button>
                      ) : (
                          <span className="text-text-secondary text-sm">-</span>
                      )}
                    </td>
                    <td className="p-4"><StatusBadge status={wo.status} /></td>
                    <td className="p-4 text-sm">
                      <p className="text-text-primary">Criado: {wo.createdAt.toLocaleDateString()}</p>
                      {wo.scheduledStartDate && <p className="text-text-secondary">Agendado: {wo.scheduledStartDate.toLocaleDateString()}</p>}
                      {wo.startedAt && <p className="text-text-secondary">Iniciado: {wo.startedAt.toLocaleDateString()}</p>}
                      {wo.completedAt && <p className="text-text-secondary">Concluído: {wo.completedAt.toLocaleDateString()}</p>}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-2">
                        <button onClick={() => openModalForEdit(wo)} className="text-xs bg-yellow-400 text-yellow-900 w-20 text-center py-1 px-2 rounded hover:bg-yellow-500 font-semibold">Editar</button>
                        {wo.status === Status.Pending && <button onClick={() => handleStatusChange(wo, Status.InProgress)} className="text-xs bg-blue-400 text-white w-20 text-center py-1 px-2 rounded hover:bg-blue-500 font-semibold">Iniciar</button>}
                        {wo.status === Status.InProgress && <button onClick={() => handleStatusChange(wo, Status.Completed)} className="text-xs bg-green-400 text-white w-20 text-center py-1 px-2 rounded hover:bg-green-500 font-semibold">Concluir</button>}
                        {(wo.status === Status.Pending || wo.status === Status.InProgress) && <button onClick={() => handleStatusChange(wo, Status.Canceled)} className="text-xs bg-red-400 text-white w-20 text-center py-1 px-2 rounded hover:bg-red-500 font-semibold">Cancelar</button>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-text-secondary">
                    Nenhuma ordem de serviço encontrada com os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
       <Modal isOpen={isModalOpen} onClose={closeModal} title={editingWorkOrder ? 'Editar Ordem de Serviço' : 'Criar Nova Ordem de Serviço'}>
            <WorkOrderForm 
                onSubmit={handleFormSubmit} 
                services={services} 
                onClose={closeModal}
                initialData={editingWorkOrder}
            />
        </Modal>
        <Modal isOpen={!!viewingPhotos} onClose={handleClosePhotoViewer} title="Fotos da Ordem de Serviço">
            {viewingPhotos && viewingPhotos.length > 0 && (
                <div className="relative flex flex-col items-center">
                    <div className="relative w-full h-96 flex items-center justify-center bg-slate-200 rounded-lg mb-4">
                        <img
                            key={currentPhotoIndex}
                            src={viewingPhotos[currentPhotoIndex]}
                            alt={`Foto ${currentPhotoIndex + 1}`}
                            className="max-h-full max-w-full object-contain"
                        />
                        {viewingPhotos.length > 1 && (
                            <>
                                <button
                                    onClick={goToPreviousPhoto}
                                    disabled={currentPhotoIndex === 0}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    aria-label="Foto anterior"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button
                                    onClick={goToNextPhoto}
                                    disabled={currentPhotoIndex === viewingPhotos.length - 1}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    aria-label="Próxima foto"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </>
                        )}
                    </div>
                    <p className="text-text-secondary">
                        Foto {currentPhotoIndex + 1} de {viewingPhotos.length}
                    </p>
                </div>
            )}
        </Modal>
    </div>
  );
};

export default WorkOrderManagement;