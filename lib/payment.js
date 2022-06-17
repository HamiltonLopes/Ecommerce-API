const fetch = require('node-fetch');
const axios = require('axios');
class Payment {
    static async compra(body, paymentCompany) {
        let data;
        if (paymentCompany == 'Cielo') {
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
            data = await response.json();
        } else {
            const exampleBody = {
                "api_key": "ak_test_qZ8moDhBmUqUL8v79MmYCTHkp7xRs5",
                "capture": "false",
                "amount": 21000,
                "card_number": "4485963498516074",
                "card_cvv": "123",
                "card_expiration_date": "0922",
                "card_holder_name": "Morpheus Fishburne",
                "customer": {
                    "external_id": "#3311",
                    "name": "Morpheus Fishburne",
                    "type": "individual",
                    "country": "br",
                    "email": "mopheus@nabucodonozor.com",
                    "documents": [
                        {
                            "type": "cpf",
                            "number": "05504156025"
                        }
                    ],
                    "phone_numbers": [
                        "+5511999998888",
                        "+5511888889999"
                    ],
                    "birthday": "1965-01-01"
                },
                "billing": {
                    "name": "Trinity Moss",
                    "address": {
                        "country": "br",
                        "state": "sp",
                        "city": "Cotia",
                        "neighborhood": "Rio Cotia",
                        "street": "Rua Matrix",
                        "street_number": "9999",
                        "zipcode": "06714360"
                    }
                },
                "shipping": {
                    "name": "Neo Reeves",
                    "fee": 1000,
                    "delivery_date": "2000-12-21",
                    "expedited": true,
                    "address": {
                        "country": "br",
                        "state": "sp",
                        "city": "Cotia",
                        "neighborhood": "Rio Cotia",
                        "street": "Rua Matrix",
                        "street_number": "9999",
                        "zipcode": "06714360"
                    }
                },
                "items": [
                    {
                        "id": "r123",
                        "title": "Red pill",
                        "unit_price": 10000,
                        "quantity": 1,
                        "tangible": true
                    },
                    {
                        "id": "b123",
                        "title": "Blue pill",
                        "unit_price": 10000,
                        "quantity": 1,
                        "tangible": true
                    }
                ]
            };
            data = await axios.post('https://api.pagar.me/1/transactions', body);
        }
        return { data: data, company: paymentCompany };
    }

    static async captura(paymentId, paymentCompany) {
        let data;
        if (paymentCompany == 'Cielo') {
            const response = await fetch(`https://apisandbox.cieloecommerce.cielo.com.br/1/sales/${paymentId}/capture`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'MerchantId': process.env.MERCHANT_ID,
                    'MerchantKey': process.env.MERCHANT_KEY
                }
            });
            data = await response.json();
        } else {
            data = await axios.post(`https://api.pagar.me/1/transactions/${paymentId}/capture`, {"api_key":process.env.API_KEY});
        }
        return data;
    }

    static async consulta(paymentId) {
        let data;
        if(paymentId.match(/(.{1,}\-){3,}/) != null){
            const response = await fetch(`https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/${paymentId}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'MerchantId': process.env.MERCHANT_ID,
                    'MerchantKey': process.env.MERCHANT_KEY
                }
            });
            data = await response.json();
        }else{
            data = await axios.get(`https://api.pagar.me/1/transactions/${paymentId}`,{params: {"api_key":process.env.API_KEY}});
        }
        return data;
    }
}

module.exports = Payment;
