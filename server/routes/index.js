const fs = require("fs");
const path = require("path");
const uuid = require('uuid/v1');

var express = require('express');
var router = express.Router();

const docuSignRequest = require('./docusigntest.js');

// var upload = multer({ dest: 'uploads/' })
var fileupload = require("express-fileupload");

router.post('/todoc', function(req, res, next){
  console.log(req.body);

  if (req.files && req.files.rx) {
    const fn = uuid() + '.jpg';
    req.files.rx.mv(path.join(__dirname,'uploads',fn), function(err) {
      if (err) {
        console.log('file receive error');
        throw err;
      }
      fs.readFile(path.join(__dirname,'uploads',fn), (err, document) => {
        if (err) {
          console.log('file read error');
          throw err;
        }

        console.log('[index.js]', req.body.recipientName, req.body.recipientEmail);
        docuSignRequest(req.body.recipientName, req.body.recipientEmail, fn, document, function(url) {
          console.log('URL', url);
          res.status(200).send(url);
        });
      });
    });
  }
});

// app.post('/profile', upload.single('avatar'), function (req, res, next) {
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any
// })

/*Get to Doc*/
router.get('/todoc', function(req, res, next){
  console.log('[index.js]', req.query);
  fs.readFile(path.join(__dirname,'chamba.jpg'), (err, document) => {
    if (err) throw err;
    docuSignRequest(`Dr. ${req.query.recipientEmail}`, req.query.recipientEmail, 'chamba.jpg', document, function(url) {
      console.log('URL', url);
      res.status(200).send({url});
    });
  });
});

/*Post from Doctor*/
router.post('/topharm', function(req, res, next){
  console.log('post topharm');
  sendToPharm();
  notify();
  //res.json();
  next();

  function sendToPharm(){
    console.log('Post Route to Telesign')
  }

});

/*Get to Pharm*/

router.get('/topharm', function(req, res, next){
  console.log('get topharm')
  res.json();
  next();
})


router.post('/docusign', function(req, res, next){
  console.log('docusign post', req.query);
  res.send('200');
});

router.get('/docusign', function(req, res, next){
  console.log('docusign get', req.query);
  res.send('200');
});

function notify(){
var TeleSignSDK = require('telesignsdk');


const customerId = "DCE62E42-750D-4B42-B1F0-FABB01817C61"; // Todo: find in portal.telesign.com
const apiKey = "vUlYMnvCLjMzfHpSY6q5L5rJ1oVoV4yN7ev2bvtlzDNUTFJYlzf5XxQdZSRMsk9nH703IodqeN/XxiXT6HkR+w=="; // Todo: find in portal.telesign.com
const rest_endpoint = "https://rest-api.telesign.com"; // Todo: Enterprise customer, change this!
const timeout = 10*1000; // 10 secs

const client = new TeleSignSDK( customerId,
    apiKey,
    rest_endpoint,
    timeout // optional
    // userAgent
);

const phoneNumber = 17085190579;
const message = "The perscription for Paul Zipser has been filled at Fred's Pharmacy";
const messageType = "ARN";

console.log("## MessagingClient.message ##");

function messageCallback(error, responseBody) {
    if (error === null) {
        console.log(`Messaging response for messaging phone number: ${phoneNumber}` +
            ` => code: ${responseBody['status']['code']}` +
            `, description: ${responseBody['status']['description']}`);
    } else {
        console.error("Unable to send message. " + error);
    }
}

client.sms.message(messageCallback, phoneNumber, message, messageType);
};

module.exports = router;
