import { cn } from "../lib/utils";

export default function FormSection({ title, description, className, contentClassName, children }) {
	return (
		<section className={cn("rounded-xl border bg-muted/20 p-4 space-y-4", className)}>
			<div className="space-y-1">
				<h3 className="text-sm font-semibold">{title}</h3>
				{description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
			</div>
			<div className={cn("space-y-4", contentClassName)}>{children}</div>
		</section>
	);
}
