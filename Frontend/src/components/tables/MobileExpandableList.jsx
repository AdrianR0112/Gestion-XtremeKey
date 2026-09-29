import { useEffect, useId, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export default function MobileExpandableList({
	items = [],
	getItemId,
	renderSummary,
	renderLeading,
	renderDetails,
	renderActions,
	emptyMessage = "No hay resultados.",
	resetKey,
	onItemOpen,
	className,
}) {
	const [expandedId, setExpandedId] = useState(null);
	const reactId = useId().replace(/:/g, "");
	const itemIds = useMemo(
		() => items.map((item, index) => String(getItemId(item, index))),
		[items, getItemId]
	);
	const itemIdsKey = itemIds.join("|");

	useEffect(() => {
		setExpandedId(null);
	}, [resetKey]);

	useEffect(() => {
		if (expandedId !== null && !itemIds.includes(expandedId)) {
			setExpandedId(null);
		}
	}, [expandedId, itemIds, itemIdsKey]);

	if (!items.length) {
		return (
			<div className={cn("rounded-xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground md:hidden", className)}>
				{emptyMessage}
			</div>
		);
	}

	return (
		<div className={cn("space-y-2 md:hidden", className)}>
			{items.map((item, index) => {
				const itemId = String(getItemId(item, index));
				const expanded = expandedId === itemId;
				const panelId = `mobile-row-${reactId}-${index}`;

				return (
					<article
						key={itemId}
						className={cn(
							"overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-colors",
							expanded && "border-primary/40 ring-1 ring-primary/15"
						)}
					>
						<div className="flex items-stretch">
							{renderLeading ? (
								<div className="flex shrink-0 items-center border-r px-3" onClick={(event) => event.stopPropagation()}>
									{renderLeading(item)}
								</div>
							) : null}
						<button
							type="button"
							className="flex min-h-16 min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
							aria-expanded={expanded}
							aria-controls={panelId}
							onClick={() => {
								setExpandedId((current) => {
									const next = current === itemId ? null : itemId;
									if (next !== null) onItemOpen?.(item);
									return next;
								});
							}}
						>
							<div className="min-w-0 flex-1">{renderSummary(item, { expanded })}</div>
							<ChevronDown
								className={cn("size-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")}
								aria-hidden="true"
							/>
						</button>
						</div>

						{expanded ? (
							<div id={panelId} role="region" className="border-t bg-muted/15 px-4 py-4">
								<div className="space-y-3">{renderDetails?.(item)}</div>
								{renderActions ? (
									<div className="mt-4 grid grid-cols-2 gap-2 border-t pt-4 [&_[data-slot=button]]:min-h-11 [&_[data-slot=button]]:w-full" onClick={(event) => event.stopPropagation()}>
										{renderActions(item)}
									</div>
								) : null}
							</div>
						) : null}
					</article>
				);
			})}
		</div>
	);
}

export function MobileDetailGrid({ children, className }) {
	return <dl className={cn("grid grid-cols-1 gap-2 text-sm min-[380px]:grid-cols-2", className)}>{children}</dl>;
}

export function MobileDetail({ label, value, children, className }) {
	return (
		<div className={cn("min-w-0 rounded-lg border bg-background p-3", className)}>
			<dt className="text-xs text-muted-foreground">{label}</dt>
			<dd className="mt-1 break-words font-medium">{value ?? children ?? "—"}</dd>
		</div>
	);
}
