const fs = require("fs");
const path = require("path");
const uuid = require('uuid/v1');

var express = require('express');
var router = express.Router();

const docuSignRequest = require('./docusigntest.js');

var fileupload = require("express-fileupload");


router.post('/notification', function(req, res, next){
  console.log(req.body);
  console.log(req.query);
  res.status(200).end();
});

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
          console.log('> > >  >URL', url);
          // notify(url, req.body.recipientEmail);
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

module.exports = router;
