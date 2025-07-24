import express from 'express';
import usuariosRoutes from '@/usuarios/routes';
import papeisRoutes from '@/papeis/routes';
import designacoesRoutes from '@/designacoes/routes';

const app = express();
app.use(express.json());

app.use('/usuarios', usuariosRoutes);
app.use('/papeis', papeisRoutes);
app.use('/designacoes', designacoesRoutes);

app.listen(3000, () => {
	console.log('Servidor rodando na porta 3000');
});
