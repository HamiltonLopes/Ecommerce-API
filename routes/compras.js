var express = require('express');
var router = express.Router();
var cielo = require('../lib/cielo.js');

/* POST criar compras. */
router.post('/', async function (req, res, next) {
  const result = await cielo.compra(req.body);
  const captureResult = await cielo.captura(result.Payment.PaymentId);
  return captureResult.Status == 2 ? res.status(200).json({ message: "Compra efetuada com sucesso.",
    paymentId: result.Payment.PaymentId }) : res.status(402).json({ error: "Compra não processada, problema no cartão." });
});

/* GET status compras. */
router.get('/:compra_id/status', async function (req, res, next) {
  const {compra_id} = req.params;
  const result = await cielo.consulta(compra_id);
  let resJson = {message : ""};
  switch(result.Payment.Status){
    case 1:
      resJson.message = "Pagamento Autorizado.";
      break;
    case 2:
      resJson.message = "Pagamento Confirmado.";
      break;
    case 12:
      resJson.message = "Pagamento Pendente.";
      break;
    default:
      resJson.message = "Erro no pagamento.";
      break;
  }
  return res.status(200).json(resJson);
});

module.exports = router;
