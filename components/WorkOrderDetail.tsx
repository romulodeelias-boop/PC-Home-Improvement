import React, { useState } from 'react';
import { WorkOrder, Service, Status } from '../types';
import Modal from './Modal';

const BackIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
    </svg>
);

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
    const colorClasses = {
      [Status.Pending]: 'bg-yellow-100 text-yellow-800',
      [Status.InProgress]: 'bg-blue-100 text-blue-800',
      [Status.Completed]: 'bg-green-100 text-green-800',
      [Status.Canceled]: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colorClasses[status]}`}>
        {status}
      </span>
    );
};

const DetailItem: React.FC<{ label: string; value?: string | number | null; children?: React.ReactNode }> = ({ label, value, children }) => (
    <div>
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        {value ? <p className="text-lg text-text-primary">{value}</p> : <div className="text-lg text-text-primary">{children}</div>}
    </div>
);

interface WorkOrderDetailProps {
  workOrder: WorkOrder;
  services: Service[];
  onClose: () => void;
  updateWorkOrder: (workOrder: WorkOrder) => void;
}

const WorkOrderDetail: React.FC<WorkOrderDetailProps> = ({ workOrder, services, onClose, updateWorkOrder }) => {
  const [viewingPhotos, setViewingPhotos] = useState<string[] | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const service = services.find(s => s.id === workOrder.serviceId);

  const handleStatusChange = (newStatus: Status) => {
    let updatedWo = { ...workOrder, status: newStatus };
    if (newStatus === Status.InProgress && !workOrder.startedAt) {
      updatedWo.startedAt = new Date();
    } else if (newStatus === Status.Completed) {
      updatedWo.completedAt = new Date();
    }
    updateWorkOrder(updatedWo);
  };

  const handleOpenPhotoViewer = (photos: string[], startIndex: number) => {
    setViewingPhotos(photos);
    setCurrentPhotoIndex(startIndex);
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

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onClose} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-slate-200 hover:bg-slate-300 text-text-primary font-semibold transition-colors">
          <BackIcon className="w-5 h-5" />
          Voltar para a Lista
        </button>
      </div>

      <div className="bg-surface rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-secondary pb-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">{workOrder.clientName}</h1>
                <p className="text-md text-text-secondary">{workOrder.itemDescription}</p>
            </div>
            <div className="mt-4 md:mt-0">
                <StatusBadge status={workOrder.status} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div className="md:col-span-2 space-y-6">
                <DetailItem label="Serviço Realizado" value={service?.name} />
                <DetailItem label="Cor da Tinta" value={workOrder.paintColor || 'Não especificada'} />
                <DetailItem label="Preço" value={workOrder.price ? `R$ ${workOrder.price.toFixed(2)}` : 'Não especificado'} />
                <DetailItem label="Descrição do Serviço">
                    <p className="text-md text-text-primary italic">{service?.description}</p>
                </DetailItem>
            </div>
            <div className="space-y-6 bg-slate-50 p-4 rounded-lg border border-secondary">
                 <DetailItem label="Data de Criação" value={workOrder.createdAt.toLocaleDateString()} />
                 <DetailItem label="Início Agendado" value={workOrder.scheduledStartDate ? workOrder.scheduledStartDate.toLocaleDateString() : 'N/A'} />
                 <DetailItem label="Início Efetivo" value={workOrder.startedAt ? workOrder.startedAt.toLocaleDateString() : 'N/A'} />
                 <DetailItem label="Data de Conclusão" value={workOrder.completedAt ? workOrder.completedAt.toLocaleDateString() : 'N/A'} />
            </div>
        </div>
        
        <div className="border-t border-secondary pt-6 mb-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Ações Rápidas</h3>
            <div className="flex flex-wrap gap-4">
              {workOrder.status === Status.Pending && <button onClick={() => handleStatusChange(Status.InProgress)} className="text-sm bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 font-semibold transition-colors">Iniciar Serviço</button>}
              {workOrder.status === Status.InProgress && <button onClick={() => handleStatusChange(Status.Completed)} className="text-sm bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 font-semibold transition-colors">Concluir Serviço</button>}
              {(workOrder.status === Status.Pending || workOrder.status === Status.InProgress) && <button onClick={() => handleStatusChange(Status.Canceled)} className="text-sm bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 font-semibold transition-colors">Cancelar Serviço</button>}
            </div>
        </div>

        {workOrder.photos.length > 0 && (
            <div className="border-t border-secondary pt-6">
                <h3 className="text-xl font-semibold text-text-primary mb-4">Galeria de Fotos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {workOrder.photos.map((photo, index) => (
                        <button key={index} onClick={() => handleOpenPhotoViewer(workOrder.photos, index)} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-lg overflow-hidden group">
                            <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200" />
                        </button>
                    ))}
                </div>
            </div>
        )}
      </div>

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

export default WorkOrderDetail;