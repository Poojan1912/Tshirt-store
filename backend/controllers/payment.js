const { User } = require("../models/user");

const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "hb5cwczwtd3zz6ff",
    publicKey: "nddzcmr4d2h7s935",
    privateKey: "fb436e86b40abc7be8e8a0070176922e"
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, (err, response) => {
        if (err) {
            res.status(500).json(err)
        } else {
            res.send(response)
        }
    });
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true
        }
    }, (err, result) => {
        if(err){
            res.status(500).json(err);
        } else {
            res.send(result)
        }
    });
}