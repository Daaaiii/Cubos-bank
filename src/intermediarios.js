  const {banco} = require('./bancodedados')

const autenticacao = (req, res, next) => {
    const { senha_banco } = req.query;

    if (senha_banco !== banco.senha) {
      return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" });
    }
    
    next();
  };



    module.exports = {autenticacao}