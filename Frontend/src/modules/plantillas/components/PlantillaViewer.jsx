import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { TipoBadge, CanalBadge, EstadoBadge } from "./PlantillaBadges";

export default function PlantillaViewer({ plantilla }) {
  if (!plantilla) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>{plantilla.Nom_Pla}</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                ID: {plantilla.Id_Pla}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <TipoBadge tipo={plantilla.Tip_Pla} />
            <CanalBadge canal={plantilla.Can_Pla} />
            <EstadoBadge estado={plantilla.Est_Pla} />
          </div>

          <Separator />

          {/* Asunto */}
          {plantilla.Asu_Pla && (
            <div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Asunto
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {plantilla.Asu_Pla}
              </p>
            </div>
          )}

          {/* Contenido */}
          <div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Contenido
            </p>
            <div className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-md">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-words">
                {plantilla.Cue_Pla}
              </p>
            </div>
          </div>

          {/* Variables */}
          {plantilla.Var_Pla && Object.keys(plantilla.Var_Pla).length > 0 && (
            <div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Variables
              </p>
              <div className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-md">
                <code className="text-xs text-zinc-700 dark:text-zinc-300">
                  {JSON.stringify(plantilla.Var_Pla, null, 2)}
                </code>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
