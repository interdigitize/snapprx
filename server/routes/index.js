var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SnappRX - Future of Rx' });
});

/*Post from Nurse*/

router.post('/todoc', function(req, res, next){
  console.log();
  createUrl();
  //res.json()
  next();

  function createUrl(){
    console.log('creatingURL');
  };


});

/*Get to Doc*/
router.get('/todoc', function(req, res, next){
  console.log('get todoc')
  //res.json();
  next();
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
});

router.get('/docusign', function(req, res, next){
  console.log('docusign get', req.query);
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
