    const express = require('express');
    const bodyParser = require('body-parser');
    const nodemailer = require('nodemailer');
    require('dotenv').config();
    // const open = require('open');

    const app = express();
    const port = process.env.PORT || 5000;

    app.use( bodyParser.json() );

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // test get
    app.get('/test', function (request, response) {
        
        console.log('test');
        response.send( 'hello' );
    }); 

    app.post('/test-post', function (request, response) {

        response.send( 'response from test POST - successfull!!!' );

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

    const server = app.listen(port, () => {
        var port = server.address().port;
        console.log("Express is working on port " + port);
        // open( `http://localhost:${port}` );
        // console.log(`Listening on port ${port}`)
    });