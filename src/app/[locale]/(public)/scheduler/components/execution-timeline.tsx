'use client';

import { useMemo } from "react";
import type { ProcessSnapshot } from "@/lib/types/scheduler";

interface ExecutionTimelineProps {
	steps: ProcessSnapshot[][];
	currentStep: number;
	onStepChange: (step: number) => void;
	isPlaying: boolean;
	onTogglePlay: () => void;
	onNext: () => void;
	onPrevious: () => void;
	onFirst: () => void;
	onLast: () => void;
}

const stateStyles: Record<
	ProcessSnapshot["estado"],
	{ label: string; className: string }
> = {
	pronto: { label: "Pronto", className: "bg-amber-500/20 text-amber-500" },
	executando: {
		label: "Executando",
		className: "bg-emerald-500/20 text-emerald-500",
	},
	bloqueado: {
		label: "Bloqueado",
		className: "bg-rose-500/20 text-rose-500",
	},
	finalizado: {
		label: "Finalizado",
		className: "bg-slate-500/20 text-slate-500",
	},
};

export function ExecutionTimeline({
	steps,
	currentStep,
	onStepChange,
	isPlaying,
	onTogglePlay,
	onNext,
	onPrevious,
	onFirst,
	onLast,
}: ExecutionTimelineProps) {
	const currentSnapshot = steps[currentStep] ?? [];

	const timelineSummary = useMemo(() => {
		const totalSteps = steps.length;
		const executandoPorPasso = steps.map((step) =>
			step.find((processo) => processo.estado === "executando"),
		);
		return {
			totalSteps,
			executandoPorPasso,
		};
	}, [steps]);

	const progressPercent =
		timelineSummary.totalSteps > 0
			? Math.round(((currentStep + 1) / timelineSummary.totalSteps) * 100)
			: 0;

	return (
		<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Execução passo a passo
					</h2>
					<p className="text-sm text-muted-foreground">
						Acompanhe cada quantum executado e o estado atual de cada processo.
					</p>
				</div>
				{steps.length > 0 ? (
					<div className="flex items-center gap-3 rounded-full border border-border bg-muted/40 px-4 py-2 text-sm">
						<span className="font-semibold text-muted-foreground">Passo</span>
						<span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
							{currentStep + 1} / {steps.length}
						</span>
					</div>
				) : null}
			</div>

			{steps.length > 1 ? (
				<div className="mt-6 flex flex-col gap-3">
					<div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-wrap items-center gap-2">
							<button
								type="button"
								onClick={onFirst}
								className="rounded-full border border-border px-3 py-1 text-xs font-semibold transition hover:bg-muted/60"
							>
								Início
							</button>
							<button
								type="button"
								onClick={onPrevious}
								className="rounded-full border border-border px-3 py-1 text-xs font-semibold transition hover:bg-muted/60"
							>
								Anterior
							</button>
							<button
								type="button"
								onClick={onTogglePlay}
								className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/15"
							>
								{isPlaying ? "Pausar" : "Reproduzir"}
							</button>
							<button
								type="button"
								onClick={onNext}
								className="rounded-full border border-border px-3 py-1 text-xs font-semibold transition hover:bg-muted/60"
							>
								Próximo
							</button>
							<button
								type="button"
								onClick={onLast}
								className="rounded-full border border-border px-3 py-1 text-xs font-semibold transition hover:bg-muted/60"
							>
								Fim
							</button>
						</div>
						<div className="flex items-center gap-2 text-xs font-semibold">
							<span className="text-muted-foreground">Progresso</span>
							<span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
								{progressPercent}%
							</span>
						</div>
					</div>
				</div>
			) : null}

			{steps.length > 1 ? (
				<div className="mt-6">
					<input
						type="range"
						min={0}
						max={steps.length - 1}
						value={currentStep}
						onChange={(event) => onStepChange(Number(event.target.value))}
						className="w-full accent-primary"
					/>
					<div className="mt-2 flex justify-between text-xs text-muted-foreground">
						<span>Início</span>
						<span>Término</span>
					</div>
				</div>
			) : null}

			{timelineSummary.totalSteps > 0 ? (
				<div className="mt-6 flex flex-col gap-3">
					<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
						Processo ativo por quantum
					</h3>
					<div className="flex flex-wrap gap-2">
						{timelineSummary.executandoPorPasso.map((processo, index) => (
							<div
								key={`step-${index}`}
								className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
							>
								<span className="font-semibold text-foreground">
									T{index + 1}
								</span>
								<span>→</span>
								<span>
									{processo ? `P${processo.id}` : "Sem execução"}
								</span>
							</div>
						))}
					</div>
				</div>
			) : null}

			<div className="mt-6 overflow-x-auto">
				<table className="min-w-full divide-y divide-border text-sm">
					<thead>
						<tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
							<th className="px-3 py-2 font-medium">Processo</th>
							<th className="px-3 py-2 font-medium">Estado</th>
							<th className="px-3 py-2 font-medium">CPU total</th>
							<th className="px-3 py-2 font-medium">Executado</th>
							<th className="px-3 py-2 font-medium">Restante</th>
							<th className="px-3 py-2 font-medium">Progresso</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border">
						{currentSnapshot.length === 0 ? (
							<tr>
								<td
									className="px-3 py-6 text-center text-muted-foreground"
									colSpan={6}
								>
									Execute uma simulação para visualizar os resultados.
								</td>
							</tr>
						) : (
							currentSnapshot.map((processo) => {
								const progress =
									processo.tempoCpu > 0
										? Math.round((processo.tempoExec / processo.tempoCpu) * 100)
										: 0;
								const { label, className } = stateStyles[processo.estado];
								return (
									<tr key={processo.id}>
										<td className="px-3 py-3 font-semibold text-foreground">
											P{processo.id}
										</td>
										<td className="px-3 py-3">
											<span
												className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
											>
												{label}
											</span>
										</td>
										<td className="px-3 py-3">{processo.tempoCpu} q</td>
										<td className="px-3 py-3">{processo.tempoExec} q</td>
										<td className="px-3 py-3">{processo.tempoRestante} q</td>
										<td className="px-3 py-3">
											<div className="h-2 w-full rounded-full bg-muted">
												<div
													className="h-2 rounded-full bg-primary transition-all"
													style={{ width: `${progress}%` }}
												/>
											</div>
											<span className="mt-1 block text-xs text-muted-foreground">
												{progress}%
											</span>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

