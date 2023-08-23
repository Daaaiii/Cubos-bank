const {
  contas,
  saques,
  depositos,
  transferencias,
} = require("../bancodedados");
const { format } = require("date-fns");

//* Depositar

const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;

  const contaExistente = contas.find((conta) => conta.numero == numero_conta);

  if (!contaExistente || !valor || isNaN(valor)) {
    return res
      .status(404)
      .json({ mensagem: "O número da conta e o valor são obrigatórios!" });
  }
  const novoSaldo = contaExistente.saldo + parseFloat(valor);

  contaExistente.saldo = novoSaldo;

  const data = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  const deposito = { data, numero_conta, valor };

  depositos.push(deposito);

  res.sendStatus(200);
};

//* Sacar

const sacar = (req, res) => {
  const { numero_conta, valor, senha } = req.body;

  const contaExistente = contas.find((conta) => conta.numero == numero_conta);

  if (!contaExistente || !valor || isNaN(valor) || isNaN(senha)) {
    return res.status(404).json({
      mensagem: "O número da conta, a senha e o valor são obrigatórios!",
    });
  } else if (senha !== contaExistente.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha incorreta" });
  } else if (contaExistente.saldo < valor) {
    return res.status(409).json({ mensagem: "Saldo insuficiente" });
  }
  const novoSaldo = contaExistente.saldo - parseFloat(valor);

  contaExistente.saldo = novoSaldo;

  const data = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  const saque = { data, numero_conta, valor };

  saques.push(saque);

  res.sendStatus(200);
};

//* Transferir

const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  const contaOrigem = contas.find(
    (conta) => conta.numero == numero_conta_origem
  );
  const contaDestino = contas.find(
    (conta) => conta.numero == numero_conta_destino
  );

  if (!contaOrigem || !contaDestino) {
    return res
      .status(404)
      .json({ mensagem: "A conta de origem ou destino não existe" });
  } else if (isNaN(senha)) {
    return res.status(401).json({ mensagem: "Senha inválida" });
  } else if (senha !== contaOrigem.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha incorreta" });
  } else if (contaOrigem.saldo < valor) {
    return res.status(409).json({ mensagem: "Saldo insuficiente" });
  }
  const novoSaldoOrigem = contaOrigem.saldo - parseFloat(valor);
  const novoSaldoDestino = contaDestino.saldo + parseFloat(valor);

  contaOrigem.saldo = novoSaldoOrigem;
  contaDestino.saldo = novoSaldoDestino;

  const data = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  const transferencia = {
    data,
    numero_conta_origem,
    numero_conta_destino,
    valor,
  };

  transferencias.push(transferencia);

  res.sendStatus(200);
};

//* Verificar Saldo

const verificarSaldo = (req, res) => {
  const senha = req.query.senha;
  const numeroConta = req.query.numero_conta;

  const contaExistente = contas.find((conta) => conta.numero == numeroConta);

  if (!contaExistente) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada" });
  } else if (isNaN(senha)) {
    return res.status(400).json({ mensagem: "A senha é inválida" });
  } else if (senha !== contaExistente.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha incorreta" });
  }

  const saldo = {
    saldo: contaExistente.saldo,
  };

  return res.status(200).json(saldo);
};

//* Verificar Extrato

const verificarExtrato = (req, res) => {
  const numeroConta = req.query.numero_conta;
  const senha = req.query.senha;

  const contaExistente = contas.find((conta) => conta.numero == numeroConta);

  if (!contaExistente) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada" });
  } else if (isNaN(senha)) {
    return res.status(400).json({ mensagem: "A senha é inválida" });
  } else if (senha !== contaExistente.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha incorreta" });
  }

  const depositosNaConta = depositos.filter(
    (deposito) => deposito.numero_conta === numeroConta
  );
  const saquesNaConta = saques.filter(
    (saque) => saque.numero_conta === numeroConta
  );

  let transferenciasEnviadas = [];
  let transferenciasRecebidas = [];

  for (const transferencia of transferencias) {
    if (transferencia.numero_conta_origem === numeroConta) {
      transferenciasEnviadas.push(transferencia);
    }
    if (transferencia.numero_conta_destino === numeroConta) {
      transferenciasRecebidas.push(transferencia);
    }
  }

  const extrato = {
    depositos: depositosNaConta,
    saques: saquesNaConta,
    transferenciasEnviadas,
    transferenciasRecebidas,
  };

  return res.status(200).json(extrato);
};

module.exports = {
  depositar,
  verificarSaldo,
  verificarExtrato,
  sacar,
  transferir,
};
