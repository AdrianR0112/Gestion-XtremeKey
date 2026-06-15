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
import {
  TIPOS_PLANTILLA,
  CANALES_PLANTILLA,
  ESTADOS_PLANTILLA,
  validatePlantillaForm,
} from "../schemas/plantilla.schema";

export default function PlantillaForm({ form, setForm, onSubmit, onCancel, loading, sheetMode }) {
  const errors = validatePlantillaForm(form);

  const handleVariablesChange = (e) => {
    const value = e.target.value;
    try {
      const parsed = value ? JSON.parse(value) : {};
      setForm({ ...form, Var_Pla: parsed });
    } catch (e) {
      // Mantener el valor como está si no es JSON válido
      setForm({ ...form, Var_Pla: value });
    }
  };

  const variablesString =
    typeof form.Var_Pla === "string" ? form.Var_Pla : JSON.stringify(form.Var_Pla || {});

  return (
		<form onSubmit={onSubmit} className="space-y-5">
			<FormSection title="Identificación" description="Nombre, tipo, canal y asunto de la plantilla.">
			<div className="space-y-2">
        <Label htmlFor="Nom_Pla">Nombre *</Label>
        <Input
          id="Nom_Pla"
          value={form.Nom_Pla}
          onChange={(e) => setForm({ ...form, Nom_Pla: e.target.value })}
          placeholder="Ingresa el nombre de la plantilla"
          maxLength="150"
          disabled={loading}
        />
        {errors.Nom_Pla && <p className="text-xs text-red-600">{errors.Nom_Pla}</p>}
        <p className="text-xs text-zinc-500">{form.Nom_Pla.length}/150</p>
      </div>

      {/* Tipo */}
      <div className="space-y-2">
        <Label htmlFor="Tip_Pla">Tipo</Label>
        <Select
          value={form.Tip_Pla}
          onValueChange={(value) => setForm({ ...form, Tip_Pla: value })}
          disabled={loading}
        >
          <SelectTrigger id="Tip_Pla">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIPOS_PLANTILLA.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo.charAt(0).toUpperCase() + tipo.slice(1).replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.Tip_Pla && <p className="text-xs text-red-600">{errors.Tip_Pla}</p>}
      </div>

      {/* Canal */}
      <div className="space-y-2">
        <Label htmlFor="Can_Pla">Canal</Label>
        <Select
          value={form.Can_Pla}
          onValueChange={(value) => setForm({ ...form, Can_Pla: value })}
          disabled={loading}
        >
          <SelectTrigger id="Can_Pla">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CANALES_PLANTILLA.map((canal) => (
              <SelectItem key={canal} value={canal}>
                {canal.charAt(0).toUpperCase() + canal.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.Can_Pla && <p className="text-xs text-red-600">{errors.Can_Pla}</p>}
      </div>

      {/* Asunto (solo si no es SMS o Push) */}
      {(form.Can_Pla === "email" || form.Can_Pla === "whatsapp") && (
        <div className="space-y-2">
          <Label htmlFor="Asu_Pla">Asunto</Label>
          <Input
            id="Asu_Pla"
            value={form.Asu_Pla}
            onChange={(e) => setForm({ ...form, Asu_Pla: e.target.value })}
            placeholder="Ingresa el asunto"
            maxLength="200"
            disabled={loading}
          />
          {errors.Asu_Pla && <p className="text-xs text-red-600">{errors.Asu_Pla}</p>}
				<p className="text-xs text-zinc-500">{form.Asu_Pla.length}/200</p>
			</div>
		)}
			</FormSection>

			<FormSection title="Contenido" description="Texto principal y variables dinámicas disponibles.">
			<div className="space-y-2">
				<Label htmlFor="Cue_Pla">Contenido *</Label>
        <Textarea
          id="Cue_Pla"
          value={form.Cue_Pla}
          onChange={(e) => setForm({ ...form, Cue_Pla: e.target.value })}
          placeholder="Ingresa el contenido de la plantilla. Usa {{variable}} para variables dinámicas."
          disabled={loading}
          rows={6}
        />
        {errors.Cue_Pla && <p className="text-xs text-red-600">{errors.Cue_Pla}</p>}
      </div>

      {/* Variables JSON */}
      <div className="space-y-2">
        <Label htmlFor="Var_Pla">Variables (JSON)</Label>
        <Textarea
          id="Var_Pla"
          value={variablesString}
          onChange={handleVariablesChange}
          placeholder='{"variable": "valor", "otra": "valor2"}'
          disabled={loading}
          rows={3}
        />
        {errors.Var_Pla && <p className="text-xs text-red-600">{errors.Var_Pla}</p>}
				<p className="text-xs text-zinc-500">Ingresa un JSON válido con las variables dinámicas</p>
			</div>
			</FormSection>

			<FormSection title="Estado" description="Controla si la plantilla está disponible para uso.">
			<div className="space-y-2">
				<Label htmlFor="Est_Pla">Estado</Label>
        <Select
          value={form.Est_Pla}
          onValueChange={(value) => setForm({ ...form, Est_Pla: value })}
          disabled={loading}
        >
          <SelectTrigger id="Est_Pla">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ESTADOS_PLANTILLA.map((estado) => (
              <SelectItem key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
				{errors.Est_Pla && <p className="text-xs text-red-600">{errors.Est_Pla}</p>}
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
          {loading
            ? "Guardando..."
            : sheetMode === "create"
            ? "Crear Plantilla"
            : "Actualizar Plantilla"}
        </Button>
      </div>
    </form>
  );
}
