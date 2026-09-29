import RecordatorioFila from './RecordatorioFila'

const LABELS = {
  ayer: 'Vencieron ayer',
  dia: 'Vencen hoy',
  pre_1: 'Vencen mañana',
  pre_5: 'Vencen en 5 días',
}

export default function RecordatorioGrupo({ group, highlighted, savingId, onEnviar, onDesmarcar }) {
  return (
    <section id={`recordatorios-${group.milestone}`} className={`scroll-mt-4 space-y-3 rounded-2xl p-1 ${highlighted ? 'ring-2 ring-primary/50 ring-offset-4' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{LABELS[group.milestone]}</h2>
        <span className="text-sm text-muted-foreground">{group.items.length}</span>
      </div>
      {group.items.length > 0 ? group.items.map((item) => (
        <RecordatorioFila
          key={`${item.Id_Sus}-${item.milestone}-${item.fechaObjetivo}`}
          item={item}
          saving={savingId === item.Id_Sus}
          onEnviar={onEnviar}
          onDesmarcar={onDesmarcar}
        />
      )) : <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No hay recordatorios en este grupo.</p>}
    </section>
  )
}
