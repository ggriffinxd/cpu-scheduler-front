'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { Escalonador } from "@/lib/scheduler/escalonador";
import { SchedulerApp } from "@/lib/scheduler/mainApp";
import type { ProcessParams, ProcessSnapshot } from "@/lib/types/scheduler";
import { AlgorithmMenu, type SchedulerAlgorithmId } from "./components/algorithm-menu";
import { SchedulerHeader } from "./components/header";
import { ExecutionTimeline } from "./components/execution-timeline";
import {
	ProcessListEditor,
	type SchedulerProcessInput,
} from "./components/process-list-editor";

const algorithmOptions = [
	{
		id: "fcfs" as const,
		title: "First-Come, First-Served (FCFS)",
		description:
			"Execução sequencial seguindo a ordem de chegada dos processos na fila.",
		hints: [
			"Tempo de espera pode ser alto para processos longos.",
			"Nenhuma preempção é realizada durante a execução.",
		],
		requirements: ["Lista de processos em ordem de chegada."],
	},
	{
		id: "rr" as const,
		title: "Round Robin",
		description:
			"Distribui a CPU em fatias de tempo fixas (quantum) alternando entre processos.",
		hints: [
			"Ideal para sistemas time-sharing.",
			"Processos retornam ao fim da fila caso não finalizem no quantum.",
		],
		requirements: ["Definir um valor de quantum (> 0)."],
	},
	{
		id: "priority" as const,
		title: "Fila de Prioridade",
		description:
			"Processos são distribuídos em filas por prioridade (1 = alta). Cada fila usa FCFS.",
		hints: [
			"Processos de prioridade mais baixa aguardam filas superiores esvaziarem.",
			"Útil para cenários com diferentes níveis de serviço.",
		],
		requirements: ["Prioridade de 1 a 5 para cada processo."],
	},
	{
		id: "sjf" as const,
		title: "Shortest Job First",
		description:
			"Seleciona o processo com menor tempo de CPU restante para execução completa.",
		hints: [
			"Minimiza tempo médio de espera quando tempos são conhecidos.",
			"Sem preempção (variante não-preemptiva).",
		],
		requirements: ["Tempo de CPU estimado para cada processo."],
	},
];

const exemploProcessos: SchedulerProcessInput[] = [
	{ id: 1, tempoCpu: 6, prioridade: 2 },
	{ id: 2, tempoCpu: 3, prioridade: 1 },
	{ id: 3, tempoCpu: 8, prioridade: 4 },
	{ id: 4, tempoCpu: 4, prioridade: 3 },
];

export default function SchedulerPage() {
	const [selectedAlgorithm, setSelectedAlgorithm] =
		useState<SchedulerAlgorithmId>("fcfs");
	const [processes, setProcesses] = useState<SchedulerProcessInput[]>([]);
	const [steps, setSteps] = useState<ProcessSnapshot[][]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [quantum, setQuantum] = useState(2);
	const [isSimulating, setIsSimulating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);

	const nextProcessId = useMemo(
		() => (processes.length === 0 ? 1 : Math.max(...processes.map((p) => p.id)) + 1),
		[processes],
	);

	const handleAddProcess = useCallback(
		(process: Omit<SchedulerProcessInput, "id">) => {
			setProcesses((prev) => [
				...prev,
				{ id: nextProcessId, tempoCpu: process.tempoCpu, prioridade: process.prioridade },
			]);
			setIsPlaying(false);
			setSteps([]);
			setCurrentStep(0);
		},
		[nextProcessId],
	);

	const handleRemoveProcess = useCallback((id: number) => {
		setProcesses((prev) => prev.filter((processo) => processo.id !== id));
		setIsPlaying(false);
	}, []);

	const handleResetProcesses = useCallback(() => {
		setProcesses([]);
		setSteps([]);
		setCurrentStep(0);
		setIsPlaying(false);
	}, []);

	const handleSeedProcesses = useCallback(() => {
		setProcesses(exemploProcessos);
		setSteps([]);
		setCurrentStep(0);
		setIsPlaying(false);
	}, []);

	const handleAlgorithmChange = (algorithm: SchedulerAlgorithmId) => {
		setSelectedAlgorithm(algorithm);
		setSteps([]);
		setCurrentStep(0);
		setIsPlaying(false);
	};

	const runSimulation = () => {
		setError(null);

		if (processes.length === 0) {
			setError("Adicione pelo menos um processo para iniciar a simulação.");
			return;
		}
		if (selectedAlgorithm === "rr" && quantum <= 0) {
			setError("Informe um valor de quantum maior que zero para Round Robin.");
			return;
		}

		setIsSimulating(true);

		const processosParams: ProcessParams[] = processes.map((processo) => ({
			id: processo.id,
			tempoCpu: processo.tempoCpu,
			prioridade: processo.prioridade,
		}));

		const novasEtapas: ProcessSnapshot[][] = [];

		const escalonador = new Escalonador((snapshot) => {
			novasEtapas.push(snapshot.map((processo) => ({ ...processo })));
		});
		const app = new SchedulerApp(escalonador);

		try {
			switch (selectedAlgorithm) {
				case "fcfs":
					app.testaFCFS(processosParams);
					break;
				case "rr":
					app.testaRoundRobin(processosParams, quantum);
					break;
				case "priority":
					app.testaFilaPrioridades(processosParams);
					break;
				case "sjf":
					app.testaJobMenor(processosParams);
					break;
				default:
					break;
			}

			setSteps(novasEtapas);
			setCurrentStep(0);
			setIsPlaying(novasEtapas.length > 1);
		} catch (simulationError) {
			setError(
				simulationError instanceof Error
					? simulationError.message
					: "Erro inesperado durante a simulação.",
			);
		} finally {
			setIsSimulating(false);
		}
	};

	useEffect(() => {
		if (!isPlaying || steps.length === 0) {
			return;
		}

		const interval = window.setInterval(() => {
			setCurrentStep((prev) => {
				const nextStep = prev + 1;
				if (nextStep >= steps.length) {
					window.clearInterval(interval);
					setIsPlaying(false);
					return steps.length - 1;
				}
				return nextStep;
			});
		}, 1000);

		return () => {
			window.clearInterval(interval);
		};
	}, [isPlaying, steps.length]);

	const goToStep = useCallback(
		(step: number) => {
			if (steps.length === 0) {
				return;
			}
			const clamped = Math.min(Math.max(step, 0), steps.length - 1);
			setCurrentStep(clamped);
			setIsPlaying(false);
		},
		[steps.length],
	);

	const handleNext = useCallback(() => {
		goToStep(currentStep + 1);
	}, [currentStep, goToStep]);

	const handlePrevious = useCallback(() => {
		goToStep(currentStep - 1);
	}, [currentStep, goToStep]);

	const handleFirst = useCallback(() => {
		goToStep(0);
	}, [goToStep]);

	const handleLast = useCallback(() => {
		goToStep(steps.length - 1);
	}, [goToStep, steps.length]);

	const handleTogglePlay = useCallback(() => {
		if (steps.length === 0) {
			return;
		}
		setIsPlaying((prev) => !prev);
	}, [steps.length]);

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
				<SchedulerHeader />
				<header className="flex flex-col gap-6 text-foreground md:flex-row md:items-start md:justify-between">
					<div className="space-y-4">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								CPU Scheduler Playground
							</h1>
							<p className="mt-2 max-w-2xl text-sm text-muted-foreground">
								Visualize os principais algoritmos de escalonamento em tempo real.
								Monte sua fila de processos, configure quantum e acompanhe cada
								quantum sendo executado.
							</p>
						</div>
					</div>
					<div className="rounded-xl border border-border bg-card/80 p-3 text-sm text-muted-foreground shadow-sm">
						<p className="font-semibold text-foreground">Status da simulação</p>
						<p>{isSimulating ? "Processando..." : "Aguardando execução"}</p>
						{steps.length > 0 ? (
							<p className="mt-1 text-xs">
								Última execução registrou {steps.length} passos.
							</p>
						) : null}
					</div>
				</header>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold text-foreground">
						Selecione um algoritmo
					</h2>
					<AlgorithmMenu
						algorithms={algorithmOptions}
						selected={selectedAlgorithm}
						onSelect={handleAlgorithmChange}
					/>
				</section>

				<section className="space-y-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<h2 className="text-lg font-semibold text-foreground">
							Parâmetros da simulação
						</h2>
						{selectedAlgorithm === "rr" ? (
							<label className="flex items-center gap-3 rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
								<span>Quantum</span>
								<input
									type="number"
									min={1}
									value={quantum}
									onChange={(event) => setQuantum(Number(event.target.value))}
									className="w-20 rounded-full border border-primary/30 bg-background px-2 py-1 text-center text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
								/>
								<span>q</span>
							</label>
						) : null}
					</div>

					<ProcessListEditor
						processes={processes}
						onAdd={handleAddProcess}
						onRemove={handleRemoveProcess}
						onReset={handleResetProcesses}
						onSeed={handleSeedProcesses}
					/>
				</section>

				<section className="space-y-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<h2 className="text-lg font-semibold text-foreground">
							Executar algoritmo
						</h2>
						<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
							<span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
								● Executando
							</span>
							<span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-amber-500">
								● Pronto
							</span>
							<span className="inline-flex items-center gap-1 rounded-full bg-slate-500/20 px-2.5 py-1 text-slate-500">
								● Finalizado
							</span>
						</div>
					</div>

					<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<h3 className="text-base font-semibold text-foreground">
									Simular {algorithmOptions.find((opt) => opt.id === selectedAlgorithm)?.title}
								</h3>
								<p className="text-sm text-muted-foreground">
									Os dados são processados imediatamente e o histórico é salvo para
									navegação temporal.
								</p>
							</div>
							<button
								type="button"
								onClick={runSimulation}
								disabled={isSimulating}
								className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isSimulating ? "Simulando..." : "Executar simulação"}
							</button>
						</div>
						{error ? (
							<p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
								{error}
							</p>
						) : null}
					</div>
				</section>

				<ExecutionTimeline
					steps={steps}
					currentStep={currentStep}
					onStepChange={goToStep}
					isPlaying={isPlaying}
					onTogglePlay={handleTogglePlay}
					onNext={handleNext}
					onPrevious={handlePrevious}
					onFirst={handleFirst}
					onLast={handleLast}
				/>

				<section className="mt-2 grid gap-4 rounded-2xl border border-dashed border-border/60 bg-muted/20 p-5 sm:grid-cols-2">
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
							Dicas rápidas
						</h3>
						<ul className="mt-2 space-y-2 text-sm text-muted-foreground">
							<li>
								Use o controle deslizante para navegar entre os passos executados
								e observar a evolução dos processos.
							</li>
							<li>
								Experimente diferentes valores de quantum no Round Robin para ver
								como o tempo de espera e o número de passos são afetados.
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
							Sobre esta simulação
						</h3>
						<p className="mt-2 text-sm text-muted-foreground">
							Esta interface utiliza o motor de escalonamento portado diretamente do
							projeto em C open-source{" "}
							<a
								href="https://github.com/KarMiguel/PrjtCpuSch"
								target="_blank"
								rel="noreferrer"
								className="text-primary underline underline-offset-4"
							>
								PrjtCpuSch
							</a>
							, permitindo visualização em tempo real dos estados de cada processo.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}

