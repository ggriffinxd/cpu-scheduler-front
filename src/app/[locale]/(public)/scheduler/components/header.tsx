"use client";

import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SchedulerHeaderProps {
	className?: string;
}

export function SchedulerHeader({ className }: SchedulerHeaderProps) {
	const t = useTranslations("scheduler.header");

	return (
		<div className="relative -mx-4 -mt-8 mb-4 sm:-mx-6 sm:-mt-10 lg:-mx-8">
			<div className="absolute inset-x-0 top-0 h-full rounded-none border-b border-border/40 bg-card/80 backdrop-blur-lg" />
			<header
				className={cn(
					"relative flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8",
					className,
				)}
			>
				<div className="flex flex-col">
					<span className="text-2xl font-semibold text-foreground">
						{t("title")}
					</span>
					<span className="text-sm text-muted-foreground">{t("subtitle")}</span>
				</div>
				<div className="flex items-center gap-3">
					<LanguageToggle />
					<ThemeToggle />
				</div>
			</header>
		</div>
	);
}

