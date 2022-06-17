const fetch = require('node-fetch');
class Cielo {
    static async compra(body) {
        // const exampleBody =  {
        //     "MerchantOrderId": "2014111701",
        //     "Customer": {
        //         "Name": "TesteCompleto"
        //     },
        //     "Capture": false,
        //     "Payment": {
        //         "Installments": 1,
        //         "CreditCard": {
        //             "CardNumber": "4556009712450999",
        //             "Holder": "Teste Holder",
        //             "ExpirationDate": "05/2023",
        //             "SecurityCode": "767",
        //             "Brand": "Visa",
        //         },
        //         "Type": "CreditCard",
        //         "Amount": 15700
        //     }
        // };
        const response = await fetch('https://apisandbox.cieloecommerce.cielo.com.br/1/sales/', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'MerchantId': process.env.MERCHANT_ID,
                'MerchantKey': process.env.MERCHANT_KEY
            }
        });
        const data = await response.json();
        return data;
    }

    static async captura(paymentId) {
        const response = await fetch(`https://apisandbox.cieloecommerce.cielo.com.br/1/sales/${paymentId}/capture`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'MerchantId': process.env.MERCHANT_ID,
                'MerchantKey': process.env.MERCHANT_KEY
            }
        });
        const data = await response.json();
        return data;
    }

    static async consulta(paymentId) {
        const response = await fetch(`https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/${paymentId}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'MerchantId': process.env.MERCHANT_ID,
                'MerchantKey': process.env.MERCHANT_KEY
            }
        });
        const data = await response.json();
        return data;
    }
}

module.exports = Cielo;
