import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";

const NONE_OPTION = "__none__";

export default function GastoForm({ form, onChange, onSubmit, onCancel, proveedores = [], compras = [] }) {
  const categoriaOptions = ["operativo", "administrativo", "marketing", "proveedor", "impuesto", "otro"];
  const estadoOptions = ["registrado", "pagado", "cancelado"];

  return (
    <form onSubmit={onSubmit} className="space-y-4 px-6 pb-6">
      <div className="space-y-2">
        <Label>Nombre *</Label>
        <Input value={form.Nom_Gas} onChange={(e) => onChange({ ...form, Nom_Gas: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label>Descripción</Label>
        <Textarea value={form.Des_Gas} onChange={(e) => onChange({ ...form, Des_Gas: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select value={form.Cat_Gas} onValueChange={(v) => onChange({ ...form, Cat_Gas: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona categoría" />
            </SelectTrigger>
            <SelectContent>
              {categoriaOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Monto *</Label>
          <Input type="number" step="0.01" value={form.Mon_Gas} onChange={(e) => onChange({ ...form, Mon_Gas: parseFloat(e.target.value) || 0 })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label>Fecha *</Label>
          <Input type="date" value={form.Fec_Gas} onChange={(e) => onChange({ ...form, Fec_Gas: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select value={form.Est_Gas} onValueChange={(v) => onChange({ ...form, Est_Gas: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {estadoOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label>Proveedor (opcional)</Label>
          <Select
            value={form.Id_Pro == null || form.Id_Pro === "" ? NONE_OPTION : String(form.Id_Pro)}
            onValueChange={(v) => onChange({ ...form, Id_Pro: v === NONE_OPTION ? null : v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona proveedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_OPTION}>-- Ninguno --</SelectItem>
              {proveedores.map((p) => (
                <SelectItem key={p.Id_Pro} value={String(p.Id_Pro)}>
                  {p.Nom_Pro}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Compra relacionada (opcional)</Label>
          <Select
            value={form.Id_Com == null || form.Id_Com === "" ? NONE_OPTION : String(form.Id_Com)}
            onValueChange={(v) => onChange({ ...form, Id_Com: v === NONE_OPTION ? null : v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona compra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_OPTION}>-- Ninguna --</SelectItem>
              {compras.map((c) => (
                <SelectItem key={c.Id_Com} value={String(c.Id_Com)}>
                  {c.Id_Com}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
}
