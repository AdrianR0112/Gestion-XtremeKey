export default function RenovacionCard({ label, value, className = "" }) {
	return (
		<div className={`rounded-md border p-3 ${className}`.trim()}>
			<p className="text-xs text-zinc-500">{label}</p>
			<p className="font-medium mt-1">{value}</p>
		</div>
	);
}
