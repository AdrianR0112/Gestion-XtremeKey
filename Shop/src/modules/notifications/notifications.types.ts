export type Notificacion = {
  id: string;
  clienteId?: string | null;
  usuarioId?: string | null;
  tipo: string;
  titulo: string;
  mensaje: string;
  canal?: "email" | "whatsapp" | "in_app" | string;
  leida?: boolean;
  enviadaEn?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NotificacionInput = {
  clienteId?: string;
  usuarioId?: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  canal?: string;
};

export type NotificacionUpdate = Partial<NotificacionInput> & {
  leida?: boolean;
};
