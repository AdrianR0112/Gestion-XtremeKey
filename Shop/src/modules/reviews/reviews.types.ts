export type Resenia = {
  id: string;
  clienteId: string;
  productoId: string;
  calificacion: number;
  comentario?: string | null;
  aprobada?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReseniaInput = {
  clienteId: string;
  productoId: string;
  calificacion: number;
  comentario?: string;
};

export type ReseniaUpdate = Partial<Omit<ReseniaInput, "clienteId" | "productoId">> & {
  aprobada?: boolean;
};
