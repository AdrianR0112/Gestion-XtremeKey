import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

function Drawer({ shouldScaleBackground = true, ...props }) {
	return <DrawerPrimitive.Root data-slot="drawer" shouldScaleBackground={shouldScaleBackground} {...props} />;
}

function DrawerTrigger({ ...props }) {
	return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }) {
	return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }) {
	return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({ className, ...props }) {
	return <DrawerPrimitive.Overlay data-slot="drawer-overlay" className={cn("fixed inset-0 z-50 bg-black/80", className)} {...props} />;
}

function DrawerContent({ className, children, showCloseButton = true, ...props }) {
	return (
		<DrawerPortal>
			<DrawerOverlay />
			<DrawerPrimitive.Content
				data-slot="drawer-content"
				className={cn(
					"fixed inset-x-0 bottom-0 z-50 flex max-h-[calc(100svh-1rem)] flex-col rounded-t-[10px] border bg-background outline-none",
					className
				)}
				{...props}
			>
				<div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
				{children}
				{showCloseButton && (
					<DrawerPrimitive.Close asChild>
						<Button variant="ghost" className="absolute right-3 top-3" size="icon-sm">
							<XIcon />
							<span className="sr-only">Close</span>
						</Button>
					</DrawerPrimitive.Close>
				)}
			</DrawerPrimitive.Content>
		</DrawerPortal>
	);
}

function DrawerHeader({ className, ...props }) {
	return <div data-slot="drawer-header" className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />;
}

function DrawerFooter({ className, ...props }) {
	return <div data-slot="drawer-footer" className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />;
}

function DrawerTitle({ className, ...props }) {
	return <DrawerPrimitive.Title data-slot="drawer-title" className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />;
}

function DrawerDescription({ className, ...props }) {
	return <DrawerPrimitive.Description data-slot="drawer-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export {
	Drawer,
	DrawerTrigger,
	DrawerPortal,
	DrawerClose,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerFooter,
	DrawerTitle,
	DrawerDescription,
};
