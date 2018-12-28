    const express = require('express');
    const bodyParser = require('body-parser');
    const nodemailer = require('nodemailer');
    require('dotenv').config();
    // const open = require('open');
    // const serverless = require('serverless-http');

    const app = express();
    const port = process.env.LISTEN_TO_PORT || 3000;
    // const token = process.env.REACT_APP_EMAIL_TOKEN;
    // const router = express.Router();

    app.use( bodyParser.json() );

    app.get('/', function (request, response) {
        
        console.log('test');
        response.send( 'hello' );
    }); 

    // listen form submiting the form form contact us form
    app.post('/api/send-email-sp', function (request, response) {
        console.log(request.body);
        
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
                from: `${request.body.name} <${ request.body.email }>`,
                to: 'petkovsasho@gmail.com',
                subject: request.body.subject || 'subject empty',
                text: request.body.message
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    response.send('Email is send successfully !');    
                }
            });
        }
        
    });

    // app.use('/.netlify/functions/server', router); 
    // module.exports = app;
    // module.exports.handler = serverless( app );
    app.listen(port, () => {
        // open( 'http://localhost:8080' );
        console.log(`Listening on port ${port}`)
    });