import type { Escalonador } from "./escalonador";
import { ProcessList } from "./lista-encadeada";
import { createProcess } from "./processo";
import type { ProcessParams } from "../types/scheduler";

const MAX_PRIORIDADE = 5;

const criarFila = (processos: ProcessParams[]): ProcessList => {
	const fila = new ProcessList();

	processos.forEach((params, index) => {
		const processo = createProcess(params);
		if (index === 0) {
			fila.insertInicio(processo);
		} else {
			fila.insertFinal(processo);
		}
	});

	return fila;
};

const criarFilasPrioridade = (
	processos: ProcessParams[],
): ProcessList[] => {
	const filas = Array.from({ length: MAX_PRIORIDADE }, () => new ProcessList());

	processos.forEach((params) => {
		const processo = createProcess(params);
		const indice = Math.min(Math.max(processo.prioridade - 1, 0), MAX_PRIORIDADE - 1);
		const fila = filas[indice];

		if (fila.isEmpty()) {
			fila.insertInicio(processo);
		} else {
			fila.insertFinal(processo);
		}
	});

	return filas;
};

export class SchedulerApp {
	constructor(private readonly escalonador: Escalonador) {}

	testaFCFS(processos: ProcessParams[]): ProcessList {
		const filaProntos = criarFila(processos);
		this.escalonador.primeiroChegarPrimeiroServido(filaProntos);
		return filaProntos;
	}

	testaRoundRobin(processos: ProcessParams[], quantum: number): ProcessList {
		const filaProntos = criarFila(processos);
		this.escalonador.roundRobin(filaProntos, quantum);
		return filaProntos;
	}

	testaJobMenor(processos: ProcessParams[]): ProcessList {
		const filaProntos = criarFila(processos);
		this.escalonador.jobMenorPrimeiro(filaProntos);
		return filaProntos;
	}

	testaFilaPrioridades(processos: ProcessParams[]): ProcessList[] {
		const filas = criarFilasPrioridade(processos);
		this.escalonador.filaPrioridades(filas);
		return filas;
	}
}

