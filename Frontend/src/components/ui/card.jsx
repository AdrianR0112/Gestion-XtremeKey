import { cn } from "../../lib/utils";

function Card({ className, ...props }) {
    return (
        <div
            className={cn(
                "min-w-0 rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50",
                className
            )}
            {...props}
        />
    );
}

function CardHeader({ className, ...props }) {
    return <div className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
    return <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />;
}

function CardDescription({ className, ...props }) {
    return <p className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)} {...props} />;
}

function CardContent({ className, ...props }) {
    return <div className={cn("p-4 pt-0 sm:p-6 sm:pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }) {
    return <div className={cn("flex items-center p-4 pt-0 sm:p-6 sm:pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
