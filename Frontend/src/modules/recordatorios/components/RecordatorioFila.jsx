import { CheckCircle2, MessageCircle, RotateCcw, TriangleAlert } from 'lucide-react'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import SuscripcionEstadoBadge from '../../suscripciones/components/SuscripcionEstadoBadge'
import SuscripcionTitularBadge from '../../suscripciones/components/SuscripcionTitularBadge'
import { formatVenceEn, getDiasRestantes, getVencimientoVariant } from '../../suscripciones/utils/vencimiento'

export default function RecordatorioFila({ item, saving, onEnviar, onDesmarcar }) {
  const dias = getDiasRestantes(item)
  const name = [item.Nom_Cli, item.Ape_Cli].filter(Boolean).join(' ') || `Suscripción #${item.Id_Sus}`
  return (
    <article className="rounded-xl border bg-background p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{name}</h3>
            <SuscripcionTitularBadge tipo={item.Tip_Tit_Sus} />
            <SuscripcionEstadoBadge estado={item.Est_Sus} />
          </div>
          <p className="text-sm text-muted-foreground">{item.Nom_Prd}{item.Nom_Var ? ` · ${item.Nom_Var}` : ''}</p>
          {item.Cor_Cue_Sus ? <p className="truncate text-xs text-muted-foreground">Cuenta: {item.Cor_Cue_Sus}</p> : null}
        </div>
        <Badge variant={getVencimientoVariant(dias)}>{formatVenceEn(dias)}</Badge>
      </div>

      {item.reason ? (
        <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />{item.reason}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{item.Tel_Cli || 'Sin teléfono'}</p>
        {item.yaEnviado ? (
          <div className="flex items-center gap-2">
            <Badge variant="success"><CheckCircle2 className="mr-1 size-3" />Enviado</Badge>
            <Button size="sm" variant="ghost" onClick={() => onDesmarcar(item)} disabled={saving}>
              <RotateCcw className="mr-1 size-4" />Deshacer
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => onEnviar(item)} disabled={saving || item.status === 'omitido'}>
            <MessageCircle className="mr-1 size-4" />Enviar WhatsApp
          </Button>
        )}
      </div>
    </article>
  )
}
