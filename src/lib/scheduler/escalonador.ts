import { ProcessState, type ProcessSnapshot, type SchedulerObserver } from "../types/scheduler";
import type { ProcessList } from "./lista-encadeada";
import type { Process } from "./processo";

const snapshotLista = (lista: ProcessList): ProcessSnapshot[] =>
	lista.toArray().map((processo) => processo.toSnapshot());

export class Escalonador {
	constructor(private observer?: SchedulerObserver) {}

	setObserver(observer?: SchedulerObserver): void {
		this.observer = observer;
	}

	private notify(lista: ProcessList): void {
		if (this.observer) {
			this.observer(snapshotLista(lista));
		}
	}

	private cpuExecuta(processo: Process, quantum: number): void {
		processo.executar(quantum);
	}

	private isFinalizado(lista: ProcessList): boolean {
		let finalizado = true;
		lista.forEach((processo) => {
			if (processo.estado !== ProcessState.Finalizado) {
				finalizado = false;
			}
		});
		return finalizado;
	}

	primeiroChegarPrimeiroServido(lista: ProcessList): void {
		lista.mutate((no) => {
			const processo = no.info;
			if (processo.estado === ProcessState.Finalizado) {
				return;
			}

			processo.setEstado(ProcessState.Executando);
			this.notify(lista);

			while (processo.tempoRestante > 0) {
				this.cpuExecuta(processo, 1);
				this.notify(lista);
			}

			processo.setEstado(ProcessState.Finalizado);
			this.notify(lista);
		});
	}

	ordenaPorTempoCpu(lista: ProcessList): void {
		const processosOrdenados = [...lista.toArray()].sort(
			(a, b) => a.tempoCpu - b.tempoCpu,
		);

		let indice = 0;
		lista.mutate((no) => {
			const processoOrdenado = processosOrdenados[indice];
			if (processoOrdenado) {
				no.info = processoOrdenado;
				indice += 1;
			}
		});
	}

	jobMenorPrimeiro(lista: ProcessList): void {
		this.ordenaPorTempoCpu(lista);

		lista.mutate((no) => {
			const processo = no.info;
			if (processo.estado === ProcessState.Finalizado) {
				return;
			}

			processo.setEstado(ProcessState.Executando);
			this.notify(lista);

			while (processo.tempoRestante > 0) {
				this.cpuExecuta(processo, 1);
				this.notify(lista);
			}

			processo.setEstado(ProcessState.Finalizado);
			this.notify(lista);
		});
	}

	roundRobin(lista: ProcessList, quantum: number): void {
		if (quantum <= 0) {
			throw new Error("O quantum deve ser maior que zero.");
		}

		while (!this.isFinalizado(lista)) {
			let executou = false;

			lista.mutate((no) => {
				const processo = no.info;

				if (processo.estado === ProcessState.Finalizado) {
					return;
				}

				processo.setEstado(ProcessState.Executando);
				this.notify(lista);

				const tempoRestante = processo.tempoRestante;
				const tempoExecutado = Math.min(quantum, tempoRestante);
				this.cpuExecuta(processo, tempoExecutado);

				if (processo.tempoRestante > 0) {
					processo.setEstado(ProcessState.Pronto);
				}

				this.notify(lista);
				executou = true;
			});

			if (!executou) {
				break;
			}
		}
	}

	filaPrioridades(filas: ProcessList[]): void {
		filas.forEach((fila) => {
			if (!fila.isEmpty()) {
				this.primeiroChegarPrimeiroServido(fila);
			}
		});
	}
}

