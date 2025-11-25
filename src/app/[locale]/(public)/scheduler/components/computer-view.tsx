'use client';

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProcessSnapshot } from "@/lib/types/scheduler";

interface ComputerViewProps {
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

const stateClassMap: Record<ProcessSnapshot["estado"], string> = {
	pronto: "bg-amber-500/20 text-amber-500 border-amber-500/30",
	executando: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
	bloqueado: "bg-rose-500/20 text-rose-500 border-rose-500/30",
	finalizado: "bg-slate-500/20 text-slate-500 border-slate-500/30",
};

const stateIconMap: Record<ProcessSnapshot["estado"], string> = {
	pronto: "⏳",
	executando: "⚡",
	bloqueado: "🔒",
	finalizado: "✅",
};

export function ComputerView({
	steps,
	currentStep,
	onStepChange,
	isPlaying,
	onTogglePlay,
	onNext,
	onPrevious,
	onFirst,
	onLast,
}: ComputerViewProps) {
	const t = useTranslations("scheduler.timeline");
	const tControls = useTranslations("scheduler.controls");
	const currentSnapshot = steps[currentStep] ?? [];
	const previousSnapshot = currentStep > 0 ? steps[currentStep - 1] ?? [] : [];

	const executingProcess = useMemo(() => {
		return currentSnapshot.find((p) => p.estado === "executando");
	}, [currentSnapshot]);

	const processTabs = useMemo(() => {
		return currentSnapshot.map((processo) => ({
			...processo,
			isActive: processo.estado === "executando",
		}));
	}, [currentSnapshot]);

	// Calcular métricas em tempo real
	const metrics = useMemo(() => {
		if (steps.length === 0) return null;

		const processMetrics = currentSnapshot.map((proc) => {
			// Encontrar quando o processo começou e terminou
			let startTime = -1;
			let endTime = -1;
			let waitTime = 0;

			steps.forEach((step, stepIndex) => {
				const procInStep = step.find((p) => p.id === proc.id);
				if (procInStep) {
					if (procInStep.estado === "executando" && startTime === -1) {
						startTime = stepIndex;
					}
					if (procInStep.estado === "finalizado" && endTime === -1) {
						endTime = stepIndex;
					}
					if (procInStep.estado === "pronto" && startTime === -1) {
						waitTime++;
					}
				}
			});

			return {
				id: proc.id,
				waitTime,
				startTime: startTime >= 0 ? startTime : null,
				endTime: endTime >= 0 ? endTime : null,
				turnaroundTime: endTime >= 0 && startTime >= 0 ? endTime - startTime + 1 : null,
			};
		});

		const avgWaitTime =
			processMetrics.reduce((sum, m) => sum + m.waitTime, 0) / processMetrics.length;
		const avgTurnaroundTime =
			processMetrics
				.filter((m) => m.turnaroundTime !== null)
				.reduce((sum, m) => sum + (m.turnaroundTime || 0), 0) /
			processMetrics.filter((m) => m.turnaroundTime !== null).length;

		return {
			processMetrics,
			avgWaitTime: isNaN(avgWaitTime) ? 0 : avgWaitTime,
			avgTurnaroundTime: isNaN(avgTurnaroundTime) ? 0 : avgTurnaroundTime,
		};
	}, [steps, currentSnapshot]);

	// Preparar dados para o diagrama de Gantt
	const ganttData = useMemo(() => {
		if (steps.length === 0) return [];

		const processMap = new Map<number, Array<{ step: number; estado: string }>>();

		steps.forEach((step, stepIndex) => {
			step.forEach((proc) => {
				if (!processMap.has(proc.id)) {
					processMap.set(proc.id, []);
				}
				processMap.get(proc.id)!.push({ step: stepIndex, estado: proc.estado });
			});
		});

		return Array.from(processMap.entries()).map(([id, states]) => ({
			id,
			states,
		}));
	}, [steps]);

	// Processos na fila de prontos
	const readyQueue = useMemo(() => {
		return currentSnapshot.filter((p) => p.estado === "pronto");
	}, [currentSnapshot]);

	const progressPercent =
		steps.length > 0
			? Math.round(((currentStep + 1) / steps.length) * 100)
			: 0;

	const stateLabelMap: Record<ProcessSnapshot["estado"], string> = {
		pronto: t("states.ready"),
		executando: t("states.running"),
		bloqueado: t("states.blocked"),
		finalizado: t("states.finished"),
	};

	if (steps.length === 0) {
		return (
			<div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<div className="mb-4 text-6xl">💻</div>
					<h3 className="text-lg font-semibold text-foreground mb-2">
						{t("empty")}
					</h3>
					<p className="text-sm text-muted-foreground">
						Execute uma simulação para visualizar o processamento
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Janela do Computador */}
			<div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
				{/* Barra de Título da Janela */}
				<div className="flex items-center justify-between bg-muted/40 px-4 py-2 border-b border-border">
					<div className="flex items-center gap-2">
						<div className="flex gap-1.5">
							<div className="w-3 h-3 rounded-full bg-red-500/80"></div>
							<div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
							<div className="w-3 h-3 rounded-full bg-green-500/80"></div>
						</div>
						<span className="text-xs font-medium text-muted-foreground ml-2">
							CPU Scheduler - {t("title")}
						</span>
					</div>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<span className="font-semibold">{t("stepLabel")}</span>
						<span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-semibold">
							{currentStep + 1} / {steps.length}
						</span>
					</div>
				</div>

				{/* Abas de Processos */}
				<div className="bg-muted/20 border-b border-border">
					<div className="flex overflow-x-auto scrollbar-hide">
						{processTabs.map((processo) => {
							const isExecuting = processo.estado === "executando";
							const progress =
								processo.tempoCpu > 0
									? Math.round((processo.tempoExec / processo.tempoCpu) * 100)
									: 0;

							// Detectar mudança de estado
							const prevProc = previousSnapshot.find((p) => p.id === processo.id);
							const stateChanged = prevProc && prevProc.estado !== processo.estado;
							const justStartedExecuting =
								stateChanged && processo.estado === "executando";

							return (
								<motion.div
									key={processo.id}
									initial={{ opacity: 0, y: -10 }}
									animate={{
										opacity: 1,
										y: 0,
										scale: justStartedExecuting ? [1, 1.05, 1] : 1,
									}}
									transition={{
										duration: 0.3,
										scale: justStartedExecuting
											? { duration: 0.5, repeat: 1, repeatType: "reverse" }
											: undefined,
									}}
									className={`
										relative flex items-center gap-2 px-4 py-3 border-b-2 transition-all cursor-pointer
										${isExecuting
											? "border-emerald-500 bg-emerald-500/10"
											: "border-transparent hover:bg-muted/40"
										}
									`}
								>
									<motion.span
										key={`${processo.id}-${processo.estado}`}
										initial={{ scale: 0, rotate: -180 }}
										animate={{ scale: 1, rotate: 0 }}
										transition={{ duration: 0.4, type: "spring" }}
										className="text-lg"
									>
										{stateIconMap[processo.estado]}
									</motion.span>
									<div className="flex flex-col min-w-[80px]">
										<span className={`text-sm font-semibold ${isExecuting ? "text-emerald-500" : "text-foreground"}`}>
											P{processo.id}
										</span>
										<motion.span
											key={`label-${processo.id}-${processo.estado}`}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="text-xs text-muted-foreground"
										>
											{stateLabelMap[processo.estado]}
										</motion.span>
									</div>
									{isExecuting && (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"
										>
											<motion.div
												animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
												transition={{ duration: 1, repeat: Infinity }}
												className="w-full h-full bg-emerald-500 rounded-full"
											/>
										</motion.div>
									)}
									{stateChanged && (
										<motion.div
											initial={{ scale: 0, opacity: 0 }}
											animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
											transition={{ duration: 0.6 }}
											className="absolute inset-0 bg-primary/20 rounded-lg pointer-events-none"
										/>
									)}
									{/* Barra de progresso na aba */}
									{processo.estado !== "finalizado" && (
										<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted">
											<motion.div
												initial={{ width: 0 }}
												animate={{ width: `${progress}%` }}
												transition={{ duration: 0.3 }}
												className={`h-full ${isExecuting ? "bg-emerald-500" : "bg-primary"}`}
											/>
										</div>
									)}
								</motion.div>
							);
						})}
					</div>
				</div>

				{/* Área de Processamento Principal */}
				<div className="p-6 bg-gradient-to-br from-background to-muted/20 min-h-[400px]">
					<AnimatePresence mode="wait">
						{executingProcess ? (
							<motion.div
								key={`executing-${executingProcess.id}-${currentStep}`}
								initial={{ opacity: 0, scale: 0.9, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.9, y: -20 }}
								transition={{ duration: 0.4 }}
								className="flex flex-col items-center justify-center h-full"
							>
								{/* Monitor/CPU Visual */}
								<div className="relative mb-8">
									{/* Monitor */}
									<div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-8 shadow-2xl border-2 border-emerald-500/30 overflow-hidden">
										{/* Efeito de brilho pulsante */}
										<motion.div
											animate={{
												boxShadow: [
													"0 0 20px rgba(16, 185, 129, 0.3)",
													"0 0 40px rgba(16, 185, 129, 0.5)",
													"0 0 20px rgba(16, 185, 129, 0.3)",
												],
											}}
											transition={{ duration: 2, repeat: Infinity }}
											className="absolute inset-0 rounded-lg"
										/>
										
										{/* Efeito de ondas de processamento */}
										<motion.div
											animate={{
												scale: [1, 1.2, 1],
												opacity: [0.1, 0.3, 0.1],
											}}
											transition={{ duration: 2, repeat: Infinity }}
											className="absolute inset-0 bg-emerald-500/20 rounded-lg"
										/>
										
										{/* Conteúdo do Monitor */}
										<div className="relative z-10 text-center">
											<motion.div
												animate={{ rotate: [0, 5, -5, 0] }}
												transition={{ duration: 2, repeat: Infinity }}
												className="text-6xl mb-4"
											>
												⚡
											</motion.div>
											<h3 className="text-2xl font-bold text-emerald-400 mb-2">
												Processando P{executingProcess.id}
											</h3>
											<div className="text-sm text-slate-400 mb-4">
												{stateLabelMap.executando}
											</div>
											
											{/* Barra de Progresso Animada */}
											<div className="w-64 h-3 bg-slate-700 rounded-full overflow-hidden mx-auto mb-2 relative">
												<motion.div
													initial={{ width: 0 }}
													animate={{
														width: `${Math.round((executingProcess.tempoExec / executingProcess.tempoCpu) * 100)}%`,
													}}
													transition={{ duration: 0.5 }}
													className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 relative overflow-hidden"
												>
													{/* Efeito de brilho animado na barra */}
													<motion.div
														animate={{
															x: ["-100%", "100%"],
														}}
														transition={{
															duration: 1.5,
															repeat: Infinity,
															ease: "linear",
														}}
														className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/3"
													/>
												</motion.div>
											</div>
											
											<div className="flex justify-between text-xs text-slate-500 mt-2">
												<span>{executingProcess.tempoExec}q / {executingProcess.tempoCpu}q</span>
												<span>{executingProcess.tempoRestante}q restante</span>
											</div>
										</div>
									</div>

									{/* Indicadores de atividade */}
									<div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
										{[1, 2, 3].map((i) => (
											<motion.div
												key={i}
												animate={{
													scale: [1, 1.2, 1],
													opacity: [0.5, 1, 0.5],
												}}
												transition={{
													duration: 1,
													repeat: Infinity,
													delay: i * 0.2,
												}}
												className="w-2 h-2 bg-emerald-500 rounded-full"
											/>
										))}
									</div>
								</div>

								{/* Informações do Processo */}
								<div className="grid grid-cols-3 gap-4 w-full max-w-md">
									<div className="bg-muted/40 rounded-lg p-3 text-center border border-border">
										<div className="text-xs text-muted-foreground mb-1">Prioridade</div>
										<div className="text-lg font-bold text-foreground">
											{executingProcess.prioridade}
										</div>
									</div>
									<div className="bg-muted/40 rounded-lg p-3 text-center border border-border">
										<div className="text-xs text-muted-foreground mb-1">Tempo CPU</div>
										<div className="text-lg font-bold text-foreground">
											{executingProcess.tempoCpu}q
										</div>
									</div>
									<div className="bg-muted/40 rounded-lg p-3 text-center border border-border">
										<div className="text-xs text-muted-foreground mb-1">Progresso</div>
										<div className="text-lg font-bold text-emerald-500">
											{Math.round((executingProcess.tempoExec / executingProcess.tempoCpu) * 100)}%
										</div>
									</div>
								</div>
							</motion.div>
						) : (
							<motion.div
								key="idle"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="flex flex-col items-center justify-center h-full"
							>
								<div className="text-6xl mb-4">💤</div>
								<h3 className="text-xl font-semibold text-muted-foreground">
									CPU em espera
								</h3>
								<p className="text-sm text-muted-foreground mt-2">
									Nenhum processo em execução
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Controles */}
				<div className="bg-muted/30 border-t border-border p-4">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div className="flex flex-wrap items-center gap-2">
							<button
								type="button"
								onClick={onFirst}
								className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
							>
								⏮ {t("controls.first")}
							</button>
							<button
								type="button"
								onClick={onPrevious}
								className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
							>
								⏪ {t("controls.previous")}
							</button>
							<button
								type="button"
								onClick={onTogglePlay}
								className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/15"
							>
								{isPlaying ? "⏸ " + t("controls.pause") : "▶ " + t("controls.play")}
							</button>
							<button
								type="button"
								onClick={onNext}
								className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
							>
								{t("controls.next")} ⏩
							</button>
							<button
								type="button"
								onClick={onLast}
								className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
							>
								{t("controls.last")} ⏭
							</button>
						</div>
						<div className="flex items-center gap-3">
							<span className="text-xs text-muted-foreground font-semibold">
								{t("controls.progress")}
							</span>
							<div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${progressPercent}%` }}
									transition={{ duration: 0.3 }}
									className="h-full bg-primary"
								/>
							</div>
							<span className="text-xs font-semibold text-primary min-w-[3rem]">
								{progressPercent}%
							</span>
						</div>
					</div>
					{steps.length > 1 && (
						<div className="mt-3">
							<input
								type="range"
								min={0}
								max={steps.length - 1}
								value={currentStep}
								onChange={(event) => onStepChange(Number(event.target.value))}
								className="w-full accent-primary"
							/>
							<div className="flex justify-between text-xs text-muted-foreground mt-1">
								<span>{t("range.start")}</span>
								<span>{t("range.end")}</span>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Indicador de Uso de CPU */}
			{steps.length > 0 && (
				<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
							Uso da CPU
						</h3>
						<span className="text-xs text-muted-foreground">
							Passo {currentStep + 1} de {steps.length}
						</span>
					</div>
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<div className="flex-1 h-8 bg-muted rounded-full overflow-hidden relative">
								<motion.div
									initial={{ width: 0 }}
									animate={{
										width: executingProcess
											? "100%"
											: "0%",
									}}
									transition={{ duration: 0.3 }}
									className={`h-full ${
										executingProcess
											? "bg-gradient-to-r from-emerald-400 to-emerald-600"
											: "bg-slate-500"
									}`}
								>
									{executingProcess && (
										<motion.div
											animate={{
												backgroundPosition: ["0%", "100%"],
											}}
											transition={{
												duration: 1,
												repeat: Infinity,
												ease: "linear",
											}}
											className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
											style={{
												backgroundSize: "200% 100%",
											}}
										/>
									)}
								</motion.div>
								<div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
									{executingProcess ? `P${executingProcess.id} executando` : "CPU ociosa"}
								</div>
							</div>
							<div className="text-sm font-bold text-foreground min-w-[3rem] text-right">
								{executingProcess ? "100%" : "0%"}
							</div>
						</div>
						<div className="text-xs text-muted-foreground">
							{executingProcess
								? `Processando P${executingProcess.id} - ${executingProcess.tempoExec}q / ${executingProcess.tempoCpu}q`
								: "Aguardando processos na fila"}
						</div>
					</div>
				</div>
			)}

			{/* Métricas em Tempo Real */}
			{metrics && (
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="rounded-xl border border-border bg-card p-4 shadow-sm"
					>
						<div className="text-xs text-muted-foreground mb-1">Tempo Médio de Espera</div>
						<div className="text-2xl font-bold text-foreground">
							{metrics.avgWaitTime.toFixed(1)}q
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="rounded-xl border border-border bg-card p-4 shadow-sm"
					>
						<div className="text-xs text-muted-foreground mb-1">Tempo Médio de Retorno</div>
						<div className="text-2xl font-bold text-foreground">
							{metrics.avgTurnaroundTime.toFixed(1)}q
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="rounded-xl border border-border bg-card p-4 shadow-sm"
					>
						<div className="text-xs text-muted-foreground mb-1">Processos Ativos</div>
						<div className="text-2xl font-bold text-emerald-500">
							{currentSnapshot.filter((p) => p.estado === "executando").length}
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="rounded-xl border border-border bg-card p-4 shadow-sm"
					>
						<div className="text-xs text-muted-foreground mb-1">Processos Finalizados</div>
						<div className="text-2xl font-bold text-slate-500">
							{currentSnapshot.filter((p) => p.estado === "finalizado").length}
						</div>
					</motion.div>
				</div>
			)}

			{/* Visualização de Fila de Prontos */}
			{readyQueue.length > 0 && (
				<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
					<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
						Fila de Prontos
					</h3>
					<div className="flex flex-wrap gap-3">
						{readyQueue.length === 0 ? (
							<div className="text-sm text-muted-foreground italic">
								Nenhum processo na fila de prontos
							</div>
						) : (
							readyQueue.map((processo, index) => {
								const wasInQueue = previousSnapshot.some(
									(p) => p.id === processo.id && p.estado === "pronto",
								);
								const isNew = !wasInQueue;

								return (
									<motion.div
										key={processo.id}
										initial={{ opacity: 0, x: isNew ? -20 : 0, scale: isNew ? 0.8 : 1 }}
										animate={{ opacity: 1, x: 0, scale: 1 }}
										transition={{
											delay: index * 0.1,
											type: isNew ? "spring" : undefined,
											stiffness: isNew ? 200 : undefined,
										}}
										whileHover={{ scale: 1.05, y: -2 }}
										className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 cursor-pointer transition-shadow hover:shadow-md"
									>
										<motion.span
											animate={{ rotate: [0, 10, -10, 0] }}
											transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
											className="text-lg"
										>
											⏳
										</motion.span>
										<div>
											<div className="font-semibold text-foreground">P{processo.id}</div>
											<div className="text-xs text-muted-foreground">
												Prioridade: {processo.prioridade}
											</div>
										</div>
										<div className="ml-2 text-xs text-muted-foreground">
											{processo.tempoRestante}q restante
										</div>
										{isNew && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: [0, 1.2, 1] }}
												transition={{ duration: 0.4 }}
												className="w-2 h-2 bg-amber-500 rounded-full"
											/>
										)}
									</motion.div>
								);
							})
						)}
					</div>
				</div>
			)}

			{/* Diagrama de Gantt */}
			{steps.length > 0 && (
				<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
					<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
						Diagrama de Gantt - Timeline de Execução
					</h3>
					<div className="overflow-x-auto">
						<div className="min-w-full space-y-2">
							{/* Legenda do tempo */}
							<div className="flex gap-1 mb-4">
								{Array.from({ length: Math.min(steps.length, 20) }).map((_, i) => (
									<div
										key={i}
										className={`flex-1 text-center text-xs font-semibold ${
											i === currentStep ? "text-primary" : "text-muted-foreground"
										}`}
									>
										T{i + 1}
									</div>
								))}
								{steps.length > 20 && (
									<div className="text-xs text-muted-foreground">...</div>
								)}
							</div>

							{/* Barras de cada processo */}
							{ganttData.map((procData) => {
								const proc = currentSnapshot.find((p) => p.id === procData.id);
								if (!proc) return null;

								return (
									<div key={procData.id} className="flex items-center gap-3">
										<div className="w-16 text-sm font-semibold text-foreground">
											P{procData.id}
										</div>
										<div className="flex-1 flex gap-0.5 h-8 relative">
											{procData.states.slice(0, 20).map((state, idx) => {
												const isCurrent = idx === currentStep;
												const procInStep = steps[idx]?.find((p) => p.id === procData.id);
												const colorMap: Record<string, string> = {
													executando: "bg-emerald-500",
													pronto: "bg-amber-500",
													bloqueado: "bg-rose-500",
													finalizado: "bg-slate-500",
												};

												return (
													<motion.div
														key={idx}
														initial={{ scale: 0.8, opacity: 0 }}
														animate={{
															scale: isCurrent ? 1.15 : 1,
															opacity: 1,
														}}
														whileHover={{ scale: 1.2, zIndex: 10 }}
														transition={{ duration: 0.2 }}
														className={`flex-1 rounded cursor-pointer transition-all ${
															colorMap[state.estado] || "bg-muted"
														} ${
															isCurrent
																? "ring-2 ring-primary ring-offset-1 shadow-lg"
																: "hover:ring-1 hover:ring-primary/50"
														}`}
														title={`T${idx + 1}: ${stateLabelMap[state.estado as ProcessSnapshot["estado"]]}${
															procInStep
																? ` - Executado: ${procInStep.tempoExec}q / ${procInStep.tempoCpu}q`
																: ""
														}`}
														onClick={() => onStepChange(idx)}
													>
														{isCurrent && (
															<motion.div
																animate={{
																	opacity: [0.5, 1, 0.5],
																}}
																transition={{
																	duration: 1,
																	repeat: Infinity,
																}}
																className="absolute inset-0 bg-white/20 rounded"
															/>
														)}
													</motion.div>
												);
											})}
											{procData.states.length > 20 && (
												<div className="text-xs text-muted-foreground ml-2">
													+{procData.states.length - 20}
												</div>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>
					{/* Legenda de cores */}
					<div className="flex flex-wrap gap-4 mt-4 text-xs">
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 rounded bg-emerald-500"></div>
							<span className="text-muted-foreground">Executando</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 rounded bg-amber-500"></div>
							<span className="text-muted-foreground">Pronto</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 rounded bg-rose-500"></div>
							<span className="text-muted-foreground">Bloqueado</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 rounded bg-slate-500"></div>
							<span className="text-muted-foreground">Finalizado</span>
						</div>
					</div>
				</div>
			)}

			{/* Gráfico de Progresso ao Longo do Tempo */}
			{steps.length > 1 && (
				<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
					<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
						Evolução do Progresso
					</h3>
					<div className="space-y-4">
						{currentSnapshot.map((proc) => {
							const progressHistory = steps.map((step) => {
								const procInStep = step.find((p) => p.id === proc.id);
								if (!procInStep) return 0;
								return Math.round((procInStep.tempoExec / procInStep.tempoCpu) * 100);
							});

							return (
								<div key={proc.id} className="space-y-1">
									<div className="flex items-center justify-between text-xs">
										<span className="font-semibold text-foreground">P{proc.id}</span>
										<span className="text-muted-foreground">
											{Math.round((proc.tempoExec / proc.tempoCpu) * 100)}%
										</span>
									</div>
									<div className="relative h-6 bg-muted rounded-full overflow-hidden">
										{/* Linha de progresso histórica */}
										<div className="absolute inset-0 flex">
											{progressHistory.map((progress, idx) => (
												<div
													key={idx}
													className="flex-1 border-r border-border/50 last:border-r-0"
													style={{
														background: `linear-gradient(to top, ${
															idx <= currentStep
																? proc.estado === "executando" && idx === currentStep
																	? "rgb(16, 185, 129)"
																	: "rgb(59, 130, 246)"
																: "transparent"
														} ${progress}%, transparent ${progress}%)`,
													}}
												/>
											))}
										</div>
										{/* Indicador do passo atual */}
										<motion.div
											animate={{
												left: `${(currentStep / (steps.length - 1)) * 100}%`,
											}}
											transition={{ duration: 0.3 }}
											className="absolute top-0 bottom-0 w-0.5 bg-primary"
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Lista de Processos em Formato de Tabela */}
			<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
				<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
					Status dos Processos
				</h3>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-border text-sm">
						<thead>
							<tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
								<th className="px-3 py-2 font-medium">{t("table.process")}</th>
								<th className="px-3 py-2 font-medium">{t("table.state")}</th>
								<th className="px-3 py-2 font-medium">{t("table.cpuTotal")}</th>
								<th className="px-3 py-2 font-medium">{t("table.executed")}</th>
								<th className="px-3 py-2 font-medium">{t("table.remaining")}</th>
								<th className="px-3 py-2 font-medium">{t("table.progress")}</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{currentSnapshot.map((processo) => {
								const progress =
									processo.tempoCpu > 0
										? Math.round((processo.tempoExec / processo.tempoCpu) * 100)
										: 0;
								const label = stateLabelMap[processo.estado];
								const className = stateClassMap[processo.estado];
								return (
									<tr key={processo.id}>
										<td className="px-3 py-3 font-semibold text-foreground">
											P{processo.id}
										</td>
										<td className="px-3 py-3">
											<span
												className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${className}`}
											>
												{stateIconMap[processo.estado]} {label}
											</span>
										</td>
										<td className="px-3 py-3">
											{processo.tempoCpu} {tControls("quantumUnit")}
										</td>
										<td className="px-3 py-3">
											{processo.tempoExec} {tControls("quantumUnit")}
										</td>
										<td className="px-3 py-3">
											{processo.tempoRestante} {tControls("quantumUnit")}
										</td>
										<td className="px-3 py-3">
											<div className="h-2 w-full rounded-full bg-muted">
												<motion.div
													initial={{ width: 0 }}
													animate={{ width: `${progress}%` }}
													transition={{ duration: 0.3 }}
													className={`h-2 rounded-full ${
														processo.estado === "executando"
															? "bg-emerald-500"
															: processo.estado === "finalizado"
															? "bg-slate-500"
															: "bg-primary"
													}`}
												/>
											</div>
											<span className="mt-1 block text-xs text-muted-foreground">
												{progress}%
											</span>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

