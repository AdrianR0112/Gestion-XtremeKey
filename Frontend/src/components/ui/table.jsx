import { cn } from "../../lib/utils";

function Table({ className, ...props }) {
    return (
        <div
            data-slot="table-container"
            className="relative w-full max-w-full overflow-x-auto overscroll-x-contain [scrollbar-gutter:stable]"
        >
            <table className={cn("w-full min-w-max caption-bottom text-sm md:min-w-full", className)} {...props} />
        </div>
    );
}

function TableHeader({ className, ...props }) {
    return <thead className={cn("[&_tr]:border-b [&_tr]:border-zinc-200 dark:[&_tr]:border-zinc-800", className)} {...props} />;
}

function TableBody({ className, ...props }) {
    return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

function TableRow({ className, ...props }) {
    return <tr className={cn("border-b border-zinc-200 bg-card transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50", className)} {...props} />;
}

function TableHead({ className, ...props }) {
    return <th className={cn("h-10 whitespace-nowrap px-3 text-left align-middle font-medium text-zinc-500 sm:px-4 dark:text-zinc-400", className)} {...props} />;
}

function TableCell({ className, ...props }) {
    return <td className={cn("p-3 align-middle sm:p-4", className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
