'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Escalonador } from "@/lib/scheduler/escalonador";
import { SchedulerApp } from "@/lib/scheduler/mainApp";
import type { ProcessParams, ProcessSnapshot } from "@/lib/types/scheduler";
import {
	AlgorithmMenu,
	type AlgorithmOption,
	type SchedulerAlgorithmId,
} from "./components/algorithm-menu";
import { SchedulerHeader } from "./components/header";
import { ExecutionTimeline } from "./components/execution-timeline";
import {
	ProcessListEditor,
	type SchedulerProcessInput,
} from "./components/process-list-editor";

const splitList = (value: string): string[] =>
	value
		.split("|")
		.map((item) => item.trim())
		.filter(Boolean);

const exemploProcessos: SchedulerProcessInput[] = [
	{ id: 1, tempoCpu: 6, prioridade: 2 },
	{ id: 2, tempoCpu: 3, prioridade: 1 },
	{ id: 3, tempoCpu: 8, prioridade: 4 },
	{ id: 4, tempoCpu: 4, prioridade: 3 },
];

export default function SchedulerPage() {
	const tPage = useTranslations("scheduler.page");
	const tStatus = useTranslations("scheduler.status");
	const tSections = useTranslations("scheduler.sections");
	const tLegend = useTranslations("scheduler.legend");
	const tButtons = useTranslations("scheduler.buttons");
	const tErrors = useTranslations("scheduler.errors");
	const tHelpers = useTranslations("scheduler.helpers");
	const tControls = useTranslations("scheduler.controls");
	const tAlgorithms = useTranslations("scheduler.algorithms");

	const algorithmOptions = useMemo<AlgorithmOption[]>(() => {
		const options: AlgorithmOption[] = [
			{
				id: "fcfs",
				title: tAlgorithms("fcfs.title"),
				description: tAlgorithms("fcfs.description"),
				hints: splitList(tAlgorithms("fcfs.hints")),
				requirements: splitList(tAlgorithms("fcfs.requirements")),
			},
			{
				id: "rr",
				title: tAlgorithms("rr.title"),
				description: tAlgorithms("rr.description"),
				hints: splitList(tAlgorithms("rr.hints")),
				requirements: splitList(tAlgorithms("rr.requirements")),
			},
			{
				id: "priority",
				title: tAlgorithms("priority.title"),
				description: tAlgorithms("priority.description"),
				hints: splitList(tAlgorithms("priority.hints")),
				requirements: splitList(tAlgorithms("priority.requirements")),
			},
			{
				id: "sjf",
				title: tAlgorithms("sjf.title"),
				description: tAlgorithms("sjf.description"),
				hints: splitList(tAlgorithms("sjf.hints")),
				requirements: splitList(tAlgorithms("sjf.requirements")),
			},
		];
		return options;
	}, [tAlgorithms]);

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
			setError(tErrors("noProcesses"));
			return;
		}
		if (selectedAlgorithm === "rr" && quantum <= 0) {
			setError(tErrors("invalidQuantum"));
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
					: tErrors("unexpected"),
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
			<div className="flex w-full flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
				<SchedulerHeader />
				<div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
					<header className="flex flex-col gap-6 text-foreground md:flex-row md:items-start md:justify-between">
					<div className="space-y-4">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								{tPage("title")}
							</h1>
							<p className="mt-2 max-w-2xl text-sm text-muted-foreground">
								{tPage("description")}
							</p>
						</div>
					</div>
					<div className="rounded-xl border border-border bg-card/80 p-3 text-sm text-muted-foreground shadow-sm">
						<p className="font-semibold text-foreground">{tStatus("title")}</p>
						<p>{isSimulating ? tStatus("processing") : tStatus("idle")}</p>
						{steps.length > 0 ? (
							<p className="mt-1 text-xs">
								{tStatus("lastRun", { steps: steps.length })}
							</p>
						) : null}
					</div>
					</header>

					<section className="space-y-4">
						<h2 className="text-lg font-semibold text-foreground">
							{tSections("algorithms")}
						</h2>
						<AlgorithmMenu
							algorithms={algorithmOptions}
							selected={selectedAlgorithm}
							onSelect={handleAlgorithmChange}
							requirementsLabel={tAlgorithms("requirementsLabel")}
						/>
					</section>

					<section className="space-y-4">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<h2 className="text-lg font-semibold text-foreground">
								{tSections("parameters")}
							</h2>
							{selectedAlgorithm === "rr" ? (
								<label className="flex items-center gap-3 rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
									<span>{tControls("quantum")}</span>
									<input
										type="number"
										min={1}
										value={quantum}
										onChange={(event) => setQuantum(Number(event.target.value))}
										className="w-20 rounded-full border border-primary/30 bg-background px-2 py-1 text-center text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
									/>
									<span>{tControls("quantumUnit")}</span>
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
								{tSections("run")}
							</h2>
							<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
								<span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
									{tLegend("executing")}
								</span>
								<span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-amber-500">
									{tLegend("ready")}
								</span>
								<span className="inline-flex items-center gap-1 rounded-full bg-slate-500/20 px-2.5 py-1 text-slate-500">
									{tLegend("finished")}
								</span>
							</div>
						</div>

						<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<h3 className="text-base font-semibold text-foreground">
										{tPage("simulateHeading", {
											algorithm:
												algorithmOptions.find((opt) => opt.id === selectedAlgorithm)
													?.title ?? "",
										})}
									</h3>
									<p className="text-sm text-muted-foreground">
										{tPage("simulateDescription")}
									</p>
								</div>
								<button
									type="button"
									onClick={runSimulation}
									disabled={isSimulating}
									className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{isSimulating ? tButtons("simulateLoading") : tButtons("simulate")}
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
								{tHelpers("quickTipsTitle")}
							</h3>
							<ul className="mt-2 space-y-2 text-sm text-muted-foreground">
								{splitList(tHelpers("quickTips")).map((tip) => (
									<li key={tip}>{tip}</li>
								))}
							</ul>
						</div>
						<div>
							<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
								{tHelpers("aboutTitle")}
							</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								{tHelpers.rich("aboutDescription", {
									link: (chunks) => (
										<a
											href={tHelpers("linkUrl")}
											target="_blank"
											rel="noreferrer"
											className="text-primary underline underline-offset-4"
										>
											{chunks}
										</a>
									),
								})}
							</p>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

