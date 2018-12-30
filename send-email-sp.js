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
    app.get('/test-get', function (request, response) {
        response.send( 'hello from GET test request!' );
    }); 
    
    // test POST request
    app.post('/test-post', function (request, response) {
        response.send( 'Response from POST test request - successfull!!!' );
    }); 

    // listen form submiting the form form contact us form
    app.post('/api/send-email-sp', function (request, response) {
        
        const token_received = Buffer.from(request.body.token, 'base64').toString('Base64');

        const emailUserName = process.env.EMAIL_USERNAME_FROM;
        const emailPassword = process.env.EMAIL_PASSWORD_FROM;
        const emailTo = process.env.EMAIL_TO;
        const token_service = process.env.TOKEN;

        if( token_received == token_service ) {
            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: emailUserName,
                    pass: emailPassword    
                },
            });

            var mailOptions = {
                from: `Contact Form <${ request.body.email }>`,
                to: emailTo,
                subject: request.body.subject || 'subject empty',
                text: `client name: ${request.body.name};
                client email: ${request.body.email};
                message: ${request.body.message};`
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    response.send(`Email is not send! It is some problem !!! ${error}`);    
                } else {
                    response.send('Email was send successfully!!!');    
                }
            });
        } 
        
    });

    const server = app.listen(port, () => {
        var port = server.address().port;
    });