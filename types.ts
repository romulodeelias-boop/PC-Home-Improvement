export enum Status {
  Pending = 'Pendente',
  InProgress = 'Em Andamento',
  Completed = 'Concluído',
  Canceled = 'Cancelado',
}

export interface Service {
  id: string;
  name: string;
  description: string;
  estimatedDurationHours: number;
  photos: string[]; // Base64 encoded images
}

export interface WorkOrder {
  id: string;
  clientName: string;
  itemDescription: string;
  serviceId: string;
  paintColor?: string;
  scheduledStartDate?: Date;
  price?: number;
  photos: string[]; // Base64 encoded images for before/after
  status: Status;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export type View = 'dashboard' | 'services' | 'work-orders' | 'analytics';