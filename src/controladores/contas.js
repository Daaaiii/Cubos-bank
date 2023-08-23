const { contas } = require("../bancodedados");

let numero = 1;

//* Listar Contas

const listarContas = (req, res) => {
  res.json(contas);
};

//* Criar Conta

const criarConta = (conta) => {
  const saldoInicial = 0;
  const usuario = { ...conta };
  const criarUsuario = { numero, saldo: saldoInicial, usuario };
  numero++;
  contas.push(criarUsuario);
};

//* Cadastrar nova Conta

const novaConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios" });
  }

  const cpfExistente = contas.some((conta) => conta.usuario.cpf === cpf);
  const emailExistente = contas.some((conta) => conta.usuario.email === email);

  if (cpfExistente || emailExistente) {
    return res
      .status(400)
      .json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
  }

  const novaConta = {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha,
  };

  criarConta(novaConta);

  res.status(200).json({ mensagem: "Conta cadastrada com sucesso" });
};

//* Atualizar Conta

const atualizarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const numeroConta = Number(req.params.numeroConta);

  const contaExistente = contas.find((conta) => conta.numero === numeroConta);

  if (!contaExistente) {
    return res
      .status(404)
      .json({ mensagem: "Conta não encontrada para atualização" });
  }

  const cpfExistente = contas.some(
    (conta) => conta.usuario.cpf === cpf && conta.numero !== numeroConta
  );
  const emailExistente = contas.some(
    (conta) => conta.usuario.email === email && conta.numero !== numeroConta
  );

  if (cpfExistente) {
    return res
      .status(400)
      .json({ mensagem: "Já existe outra conta com o CPF informado!" });
  } else if (emailExistente) {
    return res
      .status(400)
      .json({ mensagem: "Já existe outra conta com o e-mail informado!" });
  }

  const novaConta = {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha,
  };
  contaExistente.usuario = novaConta;

  return res.status(200).json({ mensagem: "Conta atualizada com sucesso" });
};

//* Excluir conta

const excluirConta = (req, res) => {
  const numeroConta = Number(req.params.numeroConta);

  if (isNaN(numeroConta)) {
    return res.status(400).json({ mensagem: "O número da conta é inválido" });
  }

  const contaASerExcluidaIndex = contas.findIndex(
    (conta) => conta.numero === numeroConta
  );

  if (contaASerExcluidaIndex === -1) {
    return res.status(404).json({ mensagem: "Conta não encontrada" });
  }

  const contaASerExcluida = contas[contaASerExcluidaIndex];

  if (contaASerExcluida.saldo !== 0) {
    return res.status(400).json({
      mensagem: "Conta não pode ser excluída porque o saldo não é zero.",
    });
  }

  contas.splice(contaASerExcluidaIndex, 1);

  return res.status(200).json({ mensagem: "Conta excluída com sucesso." });
};

module.exports = { listarContas, novaConta, atualizarConta, excluirConta };
