export enum ProcessState {
	Pronto = "pronto",
	Executando = "executando",
	Bloqueado = "bloqueado",
	Finalizado = "finalizado",
}

export interface ProcessParams {
	id: number;
	tempoCpu: number;
	prioridade: number;
	tempoExec?: number;
	estado?: ProcessState;
}

export interface ProcessSnapshot {
	id: number;
	tempoCpu: number;
	prioridade: number;
	tempoExec: number;
	tempoRestante: number;
	estado: ProcessState;
}

export type SchedulerObserver = (snapshot: ProcessSnapshot[]) => void;

