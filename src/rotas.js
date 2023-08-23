const express = require ('express')
const {autenticacao} = require('./intermediarios')
const { listarContas, novaConta, atualizarConta, excluirConta } = require('./controladores/contas')
const { depositar, verificarSaldo, verificarExtrato, sacar, transferir } = require('./controladores/transacoes')

const rotas = express()

rotas.get('/contas', autenticacao,  listarContas  ) //Listar contas bancárias
rotas.post('/contas', novaConta) // criar conta bancária
rotas.put('/contas/:numeroConta/usuario', atualizarConta) //Atualizar usuário
rotas.delete('/contas/:numeroConta', excluirConta) //Deletar
rotas.post('/transacoes/depositar', depositar) //Depositar
rotas.post('/transacoes/sacar', sacar) //Sacar
rotas.post('/transacoes/transferir', transferir) //Transferir
rotas.get('/contas/saldo', verificarSaldo) // Saldo
rotas.get('/contas/extrato', verificarExtrato) //Extrato


module.exports = rotas