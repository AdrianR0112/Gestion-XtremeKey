import { useState } from "react";
import { Check, Copy, ExternalLink, Phone, TriangleAlert } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { buildWaMeUrl } from "../../../utils/whatsapp";

export default function SuscripcionMensajeDialog({
	open,
	onOpenChange,
	datos,
	mensaje,
	setMensaje,
	cargando,
	error,
}) {
	const [copiado, setCopiado] = useState(false);

	// El texto es editable, asi que la URL se rearma con lo que haya ahora en el
	// textarea y no con la que vino del servidor.
	const url = datos ? buildWaMeUrl(datos.telefono, mensaje) : "";
	const puedeEnviar = Boolean(url) && Boolean(String(mensaje).trim());

	const copiar = async () => {
		try {
			await navigator.clipboard.writeText(mensaje);
			setCopiado(true);
			setTimeout(() => setCopiado(false), 2000);
		} catch {
			// Sin permiso de portapapeles no hay nada que hacer: queda el textarea
			// para seleccionar a mano.
		}
	};

	const abrirWhatsapp = () => {
		if (!puedeEnviar) return;
		window.open(url, "_blank", "noopener,noreferrer");
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl p-0 max-h-[90vh] overflow-y-auto">
				<DialogHeader className="px-6 pt-6">
					<DialogTitle>Enviar mensaje por WhatsApp</DialogTitle>
					<DialogDescription>
						Revisa el texto antes de abrir WhatsApp. El envío lo confirmas tú dentro de la aplicación.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-5 px-6 pb-6">
					{cargando ? <p className="text-sm text-zinc-500">Generando mensaje...</p> : null}

					{error ? (
						<div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100">
							{error}
						</div>
					) : null}

					{datos ? (
						<>
							<div className="rounded-xl border bg-muted/30 p-4">
								<p className="font-medium">{datos.titular.nombre}</p>
								<p className="mt-0.5 text-sm text-zinc-500">
									{datos.servicio} · {datos.estado}
								</p>
								<p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-300">
									<Phone className="size-4" />
									{datos.telefono}
									<span className="text-zinc-500">({datos.titular.tipo})</span>
								</p>
							</div>

							{datos.avisos?.length ? (
								<div className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
									{datos.avisos.map((aviso) => (
										<p
											key={aviso}
											className="flex items-start gap-1.5 text-xs text-amber-900 dark:text-amber-100"
										>
											<TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
											{aviso}
										</p>
									))}
								</div>
							) : null}

							<div className="space-y-2">
								<Label>Mensaje</Label>
								<Textarea
									value={mensaje}
									onChange={(event) => setMensaje(event.target.value)}
									rows={9}
									className="font-mono text-xs leading-relaxed"
								/>
								<p className="text-xs text-zinc-500">
									Puedes ajustarlo solo para este envío. Para cambiarlo siempre, edita la plantilla
									{datos.plantilla?.Nom_Pla ? ` "${datos.plantilla.Nom_Pla}"` : ""} en Plantillas.
								</p>
							</div>
						</>
					) : null}
				</div>

				<div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 border-t bg-background px-6 py-4">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button type="button" variant="outline" onClick={copiar} disabled={!puedeEnviar}>
						{copiado ? <Check className="size-4 mr-1" /> : <Copy className="size-4 mr-1" />}
						{copiado ? "Copiado" : "Copiar"}
					</Button>
					<Button type="button" onClick={abrirWhatsapp} disabled={!puedeEnviar}>
						<ExternalLink className="size-4 mr-1" />
						Abrir WhatsApp
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
