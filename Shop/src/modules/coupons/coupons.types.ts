export type Cupon = {
  id: string;
  codigo: string;
  descripcion?: string | null;
  tipo: "porcentaje" | "monto" | string;
  valor: number;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  usosMaximos?: number | null;
  usosActuales?: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CuponInput = {
  codigo: string;
  descripcion?: string;
  tipo: "porcentaje" | "monto" | string;
  valor: number;
  fechaInicio?: string;
  fechaFin?: string;
  usosMaximos?: number;
  activo?: boolean;
};

export type CuponUpdate = Partial<CuponInput>;

export type CuponUso = {
  id: string;
  cuponId: string;
  clienteId?: string | null;
  ordenId?: string | null;
  usadoEn: string;
};

export type CuponUsoInput = {
  cuponId: string;
  clienteId?: string;
  ordenId?: string;
};

export type CuponUsoUpdate = Partial<CuponUsoInput>;

export type CuponProducto = {
  id: string;
  cuponId: string;
  productoId: string;
};

export type CuponProductoInput = {
  productoId: string;
};
