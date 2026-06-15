import { Badge } from "../components/ui/badge";

export default function Footer() {
    return (
        <footer className="mt-6 border-t border-zinc-200 px-4 py-4 text-sm text-zinc-500 sm:px-6 xl:px-10 dark:border-zinc-800 dark:text-zinc-400">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
                <p className="text-center sm:text-left">©2026 POS. Disenado para gestion comercial diaria.</p>
                <Badge variant="secondary">DevPotter</Badge>
            </div>
        </footer>
    );
}
