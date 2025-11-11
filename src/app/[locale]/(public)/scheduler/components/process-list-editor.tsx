'use client';

import { useState } from "react";

export interface SchedulerProcessInput {
	id: number;
	tempoCpu: number;
	prioridade: number;
}

interface ProcessListEditorProps {
	processes: SchedulerProcessInput[];
	onAdd: (process: Omit<SchedulerProcessInput, "id">) => void;
	onRemove: (id: number) => void;
	onReset: () => void;
	onSeed?: () => void;
}

export function ProcessListEditor({
	processes,
	onAdd,
	onRemove,
	onReset,
	onSeed,
}: ProcessListEditorProps) {
	const [tempoCpu, setTempoCpu] = useState<number>(5);
	const [prioridade, setPrioridade] = useState<number>(1);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (tempoCpu <= 0) {
			return;
		}

		onAdd({ tempoCpu, prioridade });
		setTempoCpu(5);
		setPrioridade(1);
	};

	return (
		<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Processos de Entrada
					</h2>
					<p className="text-sm text-muted-foreground">
						Informe o tempo de CPU necessário e a prioridade (1-5).
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80"
						onClick={onReset}
					>
						Limpar lista
					</button>
					{onSeed ? (
						<button
							type="button"
							className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/15"
							onClick={onSeed}
						>
							Carregar exemplo
						</button>
					) : null}
				</div>
			</div>

			<form
				onSubmit={handleSubmit}
				className="mt-4 grid gap-3 rounded-xl border border-dashed border-border/50 bg-muted/40 p-4 sm:grid-cols-3"
			>
				<label className="flex flex-col gap-2">
					<span className="text-sm font-medium text-muted-foreground">
						Tempo de CPU (quantums)
					</span>
					<input
						type="number"
						min={1}
						value={tempoCpu}
						onChange={(event) => setTempoCpu(Number(event.target.value))}
						className="rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						required
					/>
				</label>

				<label className="flex flex-col gap-2">
					<span className="text-sm font-medium text-muted-foreground">
						Prioridade (1 = maior)
					</span>
					<input
						type="number"
						min={1}
						max={5}
						value={prioridade}
						onChange={(event) => setPrioridade(Number(event.target.value))}
						className="rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						required
					/>
				</label>

				<div className="flex items-end">
					<button
						type="submit"
						className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
					>
						Adicionar processo
					</button>
				</div>
			</form>

			<div className="mt-4 overflow-x-auto">
				<table className="min-w-full divide-y divide-border text-sm">
					<thead>
						<tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
							<th className="px-3 py-2 font-medium">ID</th>
							<th className="px-3 py-2 font-medium">Tempo CPU</th>
							<th className="px-3 py-2 font-medium">Prioridade</th>
							<th className="px-3 py-2 font-medium text-right">Ações</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border">
						{processes.length === 0 ? (
							<tr>
								<td
									className="px-3 py-4 text-center text-muted-foreground"
									colSpan={4}
								>
									Nenhum processo cadastrado.
								</td>
							</tr>
						) : (
							processes.map((processo) => (
								<tr key={processo.id} className="text-foreground">
									<td className="px-3 py-2 font-medium">P{processo.id}</td>
									<td className="px-3 py-2">{processo.tempoCpu} q</td>
									<td className="px-3 py-2">{processo.prioridade}</td>
									<td className="px-3 py-2 text-right">
										<button
											type="button"
											className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
											onClick={() => onRemove(processo.id)}
										>
											Remover
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

