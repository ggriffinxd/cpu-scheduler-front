import { ProcessState } from "../types/scheduler";
import type {
	ProcessParams,
	ProcessSnapshot,
} from "../types/scheduler";

export class Process {
	public tempoExec: number;
	public estado: ProcessState;

	constructor(
		public readonly id: number,
		public readonly tempoCpu: number,
		public readonly prioridade: number,
		params?: { tempoExec?: number; estado?: ProcessState },
	) {
		const exec = params?.tempoExec ?? 0;
		if (exec < 0 || exec > tempoCpu) {
			throw new Error("tempoExec inválido para o processo.");
		}

		this.tempoExec = exec;
		this.estado = params?.estado ?? ProcessState.Pronto;
	}

	get tempoRestante(): number {
		return Math.max(this.tempoCpu - this.tempoExec, 0);
	}

	setEstado(estado: ProcessState): void {
		this.estado = estado;
	}

	toSnapshot(): ProcessSnapshot {
		return {
			id: this.id,
			tempoCpu: this.tempoCpu,
			prioridade: this.prioridade,
			tempoExec: this.tempoExec,
			tempoRestante: this.tempoRestante,
			estado: this.estado,
		};
	}

	executar(quantum: number): void {
		if (quantum <= 0) {
			throw new Error("O quantum deve ser maior que zero.");
		}
		if (this.estado === ProcessState.Finalizado) {
			return;
		}

		const tempoExecutado = Math.min(quantum, this.tempoRestante);
		this.tempoExec += tempoExecutado;

		if (this.tempoExec >= this.tempoCpu) {
			this.tempoExec = this.tempoCpu;
			this.estado = ProcessState.Finalizado;
		}
	}
}

export const createProcess = ({
	id,
	tempoCpu,
	prioridade,
	tempoExec,
	estado,
}: ProcessParams): Process =>
	new Process(id, tempoCpu, prioridade, { tempoExec, estado });
