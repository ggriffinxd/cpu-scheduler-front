"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export function SchedulerHeader() {
	return (
		<header className="flex w-full items-center justify-between rounded-2xl border border-border bg-card/70 px-4 py-3 shadow-sm backdrop-blur">
			<div className="flex items-center gap-3">
				<Link
					href="/"
					className="text-sm font-semibold text-primary transition hover:text-primary/80"
				>
					CPU Scheduler
				</Link>
				<span className="text-sm text-muted-foreground">Playground</span>
			</div>
			<div className="flex items-center gap-4">
				<ThemeToggle />
			</div>
		</header>
	);
}

