import type { Process } from "./processo";

export class ProcessNode {
	constructor(
		public info: Process,
		public prox: ProcessNode | null = null,
	) {}
}

export class ProcessList {
	private head: ProcessNode | null = null;

	static fromArray(processos: Process[]): ProcessList {
		const list = new ProcessList();
		processos.forEach((processo) => {
			list.insertFinal(processo);
		});
		return list;
	}

	insertInicio(processo: Process): void {
		const novoNo = new ProcessNode(processo, this.head);
		this.head = novoNo;
	}

	insertFinal(processo: Process): void {
		const novoNo = new ProcessNode(processo);

		if (!this.head) {
			this.head = novoNo;
			return;
		}

		let atual = this.head;
		while (atual.prox) {
			atual = atual.prox;
		}
		atual.prox = novoNo;
	}

	removeInicio(): Process | null {
		if (!this.head) {
			return null;
		}

		const removido = this.head.info;
		this.head = this.head.prox;
		return removido;
	}

	removeFinal(): Process | null {
		if (!this.head) {
			return null;
		}

		if (!this.head.prox) {
			const removido = this.head.info;
			this.head = null;
			return removido;
		}

		let anterior = this.head;
		let atual = this.head.prox;

		while (atual?.prox) {
			anterior = atual;
			atual = atual.prox;
		}

		if (!atual) {
			return null;
		}

		anterior.prox = null;
		return atual.info;
	}

	isEmpty(): boolean {
		return this.head === null;
	}

	toArray(): Process[] {
		const processos: Process[] = [];
		let atual = this.head;

		while (atual) {
			processos.push(atual.info);
			atual = atual.prox;
		}

		return processos;
	}

	forEach(callback: (processo: Process) => void): void {
		let atual = this.head;

		while (atual) {
			callback(atual.info);
			atual = atual.prox;
		}
	}

	mutate(callback: (node: ProcessNode) => void): void {
		let atual = this.head;

		while (atual) {
			callback(atual);
			atual = atual.prox;
		}
	}
}

