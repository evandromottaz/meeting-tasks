export type Designacao = {
	id: number;
	data: string;
	papel: number;
	usuario: number;
};

export type DesignacaoParams = {
	data: string;
	papelId: number;
	usuarioId: number;
};
