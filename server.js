const path = require('path');
const express = require('express');


const request = require('request');
const app = express();

// set static folder
app.use(express.static(path.join(__dirname, 'public')));



// Add your credentials:
// Add your client ID and secret
var CLIENT =
  'AcZbQTP69gFLXIUlYvZn70en5fmhlBDxckrrPKjAM1qsS8RK0fGha5-AnbHlyKixKwJvxVKvzAQFAypq';
var SECRET =
  'EAUktPewH6uj5H5bnYPyA3STzhIQvPAvXHQpjmxacAlIx-zvaQVXEpDKP16VxEQpLRo-800UKEts_sjZ';
var PAYPAL_API = 'https://api.sandbox.paypal.com';

  // Set up the payment:
  // 1. Set up a URL to handle requests from the PayPal button
 app
 .post('/my-api/create-payment/', function(req, res)
  {
    // 2. Call /v1/payments/payment to set up the payment
    request.post(PAYPAL_API + '/v1/payments/payment',
    {
      auth:
      {
        user: CLIENT,
        pass: SECRET
      },
      body:
      {
        intent: 'sale',
        payer:
        {
          payment_method: 'paypal'
        },
        transactions: [
        {
          amount:
          {
            total: '5.99',
            currency: 'USD'
          }
        }],
        redirect_urls:
        {
          return_url: 'http://localhost:3000',
          cancel_url: 'http://localhost:3000'
        }
      },
      json: true
    }, function(err, response)
    {
      if (err)
      {
        console.error(err);
        return res.sendStatus(500);
      }
      // 3. Return the payment ID to the client
      res.json(
      {
        id: response.body.id
      });
    });
  })
  // Execute the payment:
  // 1. Set up a URL to handle requests from the PayPal button.
  .post('/my-api/execute-payment/', function(req, res)
  {
    // 2. Get the payment ID and the payer ID from the request body.
    var paymentID = req.body.paymentID;
    var payerID = req.body.payerID;
    // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
    request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID +
      '/execute',
      {
        auth:
        {
          user: CLIENT,
          pass: SECRET
        },
        body:
        {
          payer_id: payerID,
          transactions: [
          {
            amount:
            {
              total: '10.99',
              currency: 'USD'
            }
          }]
        },
        json: true
      },
      function(err, response)
      {
        if (err)
        {
          console.error(err);
          return res.sendStatus(500);
        }
        // 4. Return a success response to the client
        res.json(
        {
          status: 'success'
        });
      });
  })
  
  const port = process.env.PORT || 3000;
  app.listen(port, function()
  {
    console.log(`Server listening at http://localhost:${port}/`);
  });
// Run `node ./server.js` in your terminal