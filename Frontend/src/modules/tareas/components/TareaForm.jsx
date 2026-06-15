import { Button } from "../../../components/ui/button";
import FormSection from "../../../components/form-section";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { PRIORIDADES_TAREA, ESTADOS_TAREA, validateTareaForm } from "../schemas/tarea.schema";

export default function TareaForm({ form, setForm, onSubmit, onCancel, loading, sheetMode }) {
  const errors = validateTareaForm(form);

  return (
		<form onSubmit={onSubmit} className="space-y-5">
			<FormSection title="Resumen" description="Información principal y seguimiento de la tarea.">
			<div className="space-y-2">
        <Label htmlFor="Tit_Tar">Título *</Label>
        <Input
          id="Tit_Tar"
          value={form.Tit_Tar}
          onChange={(e) => setForm({ ...form, Tit_Tar: e.target.value })}
          placeholder="Ingresa el título de la tarea"
          maxLength="200"
          disabled={loading}
        />
        {errors.Tit_Tar && <p className="text-xs text-red-600">{errors.Tit_Tar}</p>}
        <p className="text-xs text-zinc-500">{form.Tit_Tar.length}/200</p>
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="Des_Tar">Descripción</Label>
        <Textarea
          id="Des_Tar"
          value={form.Des_Tar}
          onChange={(e) => setForm({ ...form, Des_Tar: e.target.value })}
          placeholder="Ingresa una descripción (opcional)"
          disabled={loading}
          rows={3}
        />
        {errors.Des_Tar && <p className="text-xs text-red-600">{errors.Des_Tar}</p>}
      </div>

      {/* Prioridad */}
      <div className="space-y-2">
        <Label htmlFor="Pri_Tar">Prioridad</Label>
        <Select value={form.Pri_Tar} onValueChange={(value) => setForm({ ...form, Pri_Tar: value })} disabled={loading}>
          <SelectTrigger id="Pri_Tar">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRIORIDADES_TAREA.map((prio) => (
              <SelectItem key={prio} value={prio}>
                {prio.charAt(0).toUpperCase() + prio.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.Pri_Tar && <p className="text-xs text-red-600">{errors.Pri_Tar}</p>}
      </div>

      {/* Estado */}
      <div className="space-y-2">
        <Label htmlFor="Est_Tar">Estado</Label>
        <Select value={form.Est_Tar} onValueChange={(value) => setForm({ ...form, Est_Tar: value })} disabled={loading}>
          <SelectTrigger id="Est_Tar">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ESTADOS_TAREA.map((estado) => (
              <SelectItem key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1).replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.Est_Tar && <p className="text-xs text-red-600">{errors.Est_Tar}</p>}
      </div>

      {/* Progreso */}
      <div className="space-y-2">
        <Label htmlFor="Pro_Tar">Progreso (%)</Label>
        <Input
          id="Pro_Tar"
          type="number"
          min="0"
          max="100"
          value={form.Pro_Tar}
          onChange={(e) => setForm({ ...form, Pro_Tar: e.target.value })}
          placeholder="0 - 100"
          disabled={loading}
        />
        {errors.Pro_Tar && <p className="text-xs text-red-600">{errors.Pro_Tar}</p>}
      </div>

      {/* Fecha límite */}
      <div className="space-y-2">
        <Label htmlFor="Fec_Lim_Tar">Fecha Límite</Label>
        <Input
          id="Fec_Lim_Tar"
          type="date"
          value={form.Fec_Lim_Tar}
          onChange={(e) => setForm({ ...form, Fec_Lim_Tar: e.target.value })}
          disabled={loading}
        />
        {errors.Fec_Lim_Tar && <p className="text-xs text-red-600">{errors.Fec_Lim_Tar}</p>}
      </div>

      {/* Fecha de completación */}
      {form.Est_Tar === "completada" && (
        <div className="space-y-2">
          <Label htmlFor="Fec_Com_Tar">Fecha de Completación</Label>
          <Input
            id="Fec_Com_Tar"
            type="datetime-local"
            value={form.Fec_Com_Tar}
            onChange={(e) => setForm({ ...form, Fec_Com_Tar: e.target.value })}
            disabled={loading}
          />
				{errors.Fec_Com_Tar && <p className="text-xs text-red-600">{errors.Fec_Com_Tar}</p>}
			</div>
		)}
			</FormSection>

			<FormSection title="Vínculos" description="Relaciona la tarea con clientes o ventas existentes.">
			<div className="grid md:grid-cols-2 gap-4">
			<div className="space-y-2">
				<Label htmlFor="Id_Cli">ID del Cliente</Label>
        <Input
          id="Id_Cli"
          type="number"
          value={form.Id_Cli}
          onChange={(e) => setForm({ ...form, Id_Cli: e.target.value })}
          placeholder="(Opcional)"
          disabled={loading}
        />
        {errors.Id_Cli && <p className="text-xs text-red-600">{errors.Id_Cli}</p>}
      </div>

      {/* Venta ID */}
      <div className="space-y-2">
        <Label htmlFor="Id_Ven">ID de la Venta</Label>
        <Input
          id="Id_Ven"
          type="number"
          value={form.Id_Ven}
          onChange={(e) => setForm({ ...form, Id_Ven: e.target.value })}
          placeholder="(Opcional)"
          disabled={loading}
        />
				{errors.Id_Ven && <p className="text-xs text-red-600">{errors.Id_Ven}</p>}
			</div>
			</div>
			</FormSection>

			<div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex justify-end gap-2 border-t bg-background px-6 py-4">
				<Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
					Cancelar
				</Button>
				<Button
					type="submit"
					disabled={loading || Object.keys(errors).length > 0}
				>
          {loading ? "Guardando..." : sheetMode === "create" ? "Crear Tarea" : "Actualizar Tarea"}
        </Button>
      </div>
    </form>
  );
}
