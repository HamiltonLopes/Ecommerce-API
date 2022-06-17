var express = require('express');
var router = express.Router();
var payment = require('../lib/payment.js');

/* POST criar compras. */
router.post('/', async function (req, res, next) {

  let result;
  let captureResult;
  let paymentId;
  let error;

  try {
    result = await payment.compra(req.body, "Cielo");
    paymentId = result.data.Payment.PaymentId;
    captureResult = await payment.captura(paymentId, result.company);
  } catch (error) {
    console.error(error);
    error = true;
  }

  if(error || captureResult.Status != 2){
    console.log("Erro de comunicação com Cielo, transferindo transação para Pagarme.");
    try {
      result = await payment.compra(req.body, "Pagarme");
      paymentId = result.data.data.id;
      captureResult = await payment.captura(paymentId, result.company);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno no servidor!" });
    }
  }

  return (captureResult.Status == 2 || captureResult.status == 200) ?
    res.status(200).json({
      message: "Compra efetuada com sucesso.",
      company: result.company,
      paymentId: paymentId
    }) :
    res.status(402).json({
      error: "Compra não processada, problema no cartão.",
      company: result.company
    });

});

/* GET status compras. */
router.get('/:compra_id/status', async function (req, res, next) {
  const { compra_id } = req.params;
  try{
    const result = await payment.consulta(compra_id);
  }catch(error){
    console.error(error.response.data);
  }
  res.send("ok");
  // let resJson = { message: "" };
  // switch (result.Payment.Status) {
  //   case 1:
  //     resJson.message = "Pagamento Autorizado.";
  //     break;
  //   case 2:
  //     resJson.message = "Pagamento Confirmado.";
  //     break;
  //   case 12:
  //     resJson.message = "Pagamento Pendente.";
  //     break;
  //   default:
  //     resJson.message = "Erro no pagamento.";
  //     break;
  // }
  // return res.status(200).json(resJson);
});

module.exports = router;
