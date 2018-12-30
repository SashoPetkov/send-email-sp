    const express = require('express');
    const bodyParser = require('body-parser');
    const nodemailer = require('nodemailer');

    const app = express();
    const port = process.env.PORT || 5000;

    app.use( bodyParser.json() );

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // test GET request
    app.get('/test', function (request, response) {
        response.send( 'hello from GET test request!' );
    }); 
    
    // test POST request
    app.post('/test-post', function (request, response) {
        response.send( 'Response from POST test request - successfull!!!' );
    }); 

    // listen form submiting the form form contact us form
    app.post('/api/send-email-sp', function (request, response) {
        
        const token_string = Buffer.from(request.body.token, 'base64').toString('Base64');
        
        if( token_string.indexOf( 'DQ0NDQ=' > -1 ) ) {
            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD    
                },
            });

            var mailOptions = {
                // from: `${request.body.name} <${ request.body.email }>`,
                from: `Contact Form <${ request.body.email }>`,
                to: 'petkovsasho@gmail.com',
                subject: request.body.subject || 'subject empty',
                text: `client name: ${request.body.name} ;
                       client email: ${request.body.email} ;
                       message: ${request.body.message} ;`
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    response.send(`Email is not send! It is some problem ${process.env}`);    
                } else {
                    response.send('Email is send successfully !');    
                }
            });
        } 
        
    });

    const server = app.listen(port, () => {
        var port = server.address().port;
    });