'use client';

import { cn } from "@/lib/utils";

export interface AlgorithmOption {
	id: SchedulerAlgorithmId;
	title: string;
	description: string;
	hints?: string[];
	requirements?: string[];
}

export type SchedulerAlgorithmId = "fcfs" | "rr" | "priority" | "sjf";

interface AlgorithmMenuProps {
	algorithms: AlgorithmOption[];
	selected: SchedulerAlgorithmId;
	onSelect: (algorithm: SchedulerAlgorithmId) => void;
	requirementsLabel: string;
}

export function AlgorithmMenu({
	algorithms,
	selected,
	onSelect,
	requirementsLabel,
}: AlgorithmMenuProps) {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			{algorithms.map((algorithm) => {
				const isSelected = algorithm.id === selected;
				return (
					<button
						key={algorithm.id}
						type="button"
						className={cn(
							"rounded-xl border p-4 text-left transition-all duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
							isSelected
								? "border-primary bg-primary/5 shadow-lg"
								: "border-border bg-card",
						)}
						onClick={() => onSelect(algorithm.id)}
					>
						<div className="flex items-start justify-between gap-4">
							<div>
								<h3 className="text-lg font-semibold text-foreground">
									{algorithm.title}
								</h3>
								<p className="mt-2 text-sm text-muted-foreground">
									{algorithm.description}
								</p>
							</div>
							<div
								className={cn(
									"mt-1 h-2.5 w-2.5 rounded-full",
									isSelected ? "bg-primary" : "bg-muted",
								)}
							/>
						</div>
						{algorithm.hints?.length ? (
							<ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
								{algorithm.hints.map((hint) => (
									<li key={hint} className="flex items-center gap-2">
										<span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary/60" />
										<span>{hint}</span>
									</li>
								))}
							</ul>
						) : null}
						{algorithm.requirements?.length ? (
							<div className="mt-4 rounded-lg border border-dashed border-border/50 bg-muted/30 p-3">
								<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
									{requirementsLabel}
								</p>
								<ul className="mt-2 space-y-1 text-sm text-muted-foreground">
									{algorithm.requirements.map((item) => (
										<li key={item} className="flex items-center gap-2">
											<span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary/40" />
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>
						) : null}
					</button>
				);
			})}
		</div>
	);
}

