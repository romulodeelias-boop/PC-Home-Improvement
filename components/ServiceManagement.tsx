import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import Modal from './Modal';

interface ServiceManagementProps {
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;
  deleteService: (serviceId: string) => void;
}

const ServiceForm: React.FC<{
    onSubmit: (service: Omit<Service, 'id' | 'photos'> | Service) => void;
    initialData?: Service | null;
    onClose: () => void;
}> = ({ onSubmit, initialData, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [estimatedDurationHours, setEstimatedDurationHours] = useState(1);
    const [photos, setPhotos] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setEstimatedDurationHours(initialData.estimatedDurationHours);
            setPhotos(initialData.photos);
        } else {
            setName('');
            setDescription('');
            setEstimatedDurationHours(1);
            setPhotos([]);
        }
    }, [initialData]);

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
        const serviceData = { name, description, estimatedDurationHours, photos };
        if (initialData) {
            onSubmit({ ...serviceData, id: initialData.id });
        } else {
            onSubmit(serviceData);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Nome do Serviço</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-100 text-text-primary rounded-md p-2 border border-secondary focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Descrição</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full bg-slate-100 text-text-primary rounded-md p-2 border border-secondary focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Duração Estimada (horas)</label>
                <input type="number" value={estimatedDurationHours} onChange={e => setEstimatedDurationHours(Number(e.target.value))} min="1" required className="w-full bg-slate-100 text-text-primary rounded-md p-2 border border-secondary focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div>
                 <label className="block text-sm font-medium text-text-secondary mb-1">Fotos</label>
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
                <button type="submit" className="py-2 px-4 rounded-lg bg-primary hover:bg-sky-600 text-white font-semibold transition-colors">{initialData ? 'Atualizar Serviço' : 'Adicionar Serviço'}</button>
            </div>
        </form>
    );
};

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.293a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const ServiceManagement: React.FC<ServiceManagementProps> = ({ services, addService, updateService, deleteService }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingPhotos, setViewingPhotos] = useState<string[] | null>(null);

  const openModalForNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };
  
  const handleFormSubmit = (serviceData: Omit<Service, 'id'> | Service) => {
    if ('id' in serviceData) {
        updateService(serviceData as Service);
    } else {
        addService(serviceData as Omit<Service, 'id'>);
    }
    closeModal();
  };
  
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

  const handleExportCSV = () => {
    const dataToExport = services.map(({ name, description, estimatedDurationHours }) => ({
        name,
        description,
        estimatedDurationHours,
    }));

    exportToCSV(
        dataToExport,
        'lista_de_servicos.csv',
        { 
            name: 'Nome', 
            description: 'Descrição', 
            estimatedDurationHours: 'Duração Estimada (h)' 
        }
    );
  };


  return (
    <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-text-primary">Gerenciamento de Serviços</h1>
            <div className="flex self-end md:self-auto gap-4">
                <button onClick={handleExportCSV} className="bg-slate-200 text-text-primary font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors flex items-center">
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    Exportar CSV
                </button>
                <button onClick={openModalForNew} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Adicionar Serviço
                </button>
            </div>
        </div>
        <div className="bg-surface rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-secondary bg-slate-50">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider">Nome</th>
                            <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider">Descrição</th>
                            <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider text-center">Fotos</th>
                            <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider text-center">Duração (h)</th>
                            <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary">
                        {services.map(service => (
                            <tr key={service.id} className="hover:bg-slate-50">
                                <td className="p-4 font-medium text-text-primary">{service.name}</td>
                                <td className="p-4 text-text-secondary max-w-sm truncate">{service.description}</td>
                                <td className="p-4 text-center">
                                    {service.photos.length > 0 ? (
                                        <button onClick={() => setViewingPhotos(service.photos)} className="text-sm text-primary hover:underline">
                                           Ver ({service.photos.length})
                                        </button>
                                    ) : (
                                        <span className="text-text-secondary text-sm">N/A</span>
                                    )}
                                </td>
                                <td className="p-4 text-text-primary text-center">{service.estimatedDurationHours}</td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => openModalForEdit(service)} className="text-blue-600 hover:text-blue-800 font-semibold">Editar</button>
                                        <button onClick={() => deleteService(service.id)} className="text-red-600 hover:text-red-800 font-semibold">Excluir</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingService ? 'Editar Serviço' : 'Adicionar Novo Serviço'}>
            <ServiceForm onSubmit={handleFormSubmit} initialData={editingService} onClose={closeModal} />
        </Modal>

        <Modal isOpen={!!viewingPhotos} onClose={() => setViewingPhotos(null)} title="Fotos do Serviço">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-1">
                {viewingPhotos?.map((photo, index) => (
                    <img key={index} src={photo} alt={`Serviço ${index + 1}`} className="w-full h-auto object-contain rounded-lg" />
                ))}
            </div>
        </Modal>
    </div>
  );
};

export default ServiceManagement;