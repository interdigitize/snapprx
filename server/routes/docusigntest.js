var     async = require("async"),		// async module
        request = require("request"),		// request module
    	fs = require("fs");			// fs module

module.exports = function(recipientName, recipientEmail, documentName, document, cb) {
  console.log('[docusigntest.js]', recipientName, recipientEmail);
var 	email = process.env.email,				// your account email
    	password = process.env.password,			// your account password
    	integratorKey = process.env.integratorKey,			// your Integrator Key (found on the Preferences -> API page)
    // recipientName = "Dr. Who",			// recipient (signer) name
    // recipientEmail = "sm94010@gmail.com"
    // 	documentName = "chamba.jpg",			// copy document with this name into same directory!
    	baseUrl = ""; 				// we will retrieve this through the Login call

async.waterfall(
  [
    /////////////////////////////////////////////////////////////////////////////////////
    // Step 1: Login (used to retrieve your accountId and baseUrl)
    /////////////////////////////////////////////////////////////////////////////////////
    function(next) {
		var url = "https://demo.docusign.net/restapi/v2/login_information";
		var body = "";	// no request body for login api call

		// set request url, method, body, and headers
		var options = initializeRequest(url, "GET", body, email, password);

		// send the request...
		request(options, function(err, res, body) {
			if(!parseResponseBody(err, res, body)) {
				return;
			}
			baseUrl = JSON.parse(body).loginAccounts[0].baseUrl;
			next(null); // call next function
		});
	},

    /////////////////////////////////////////////////////////////////////////////////////
    // Step 2: Request Signature on a PDF Document
    /////////////////////////////////////////////////////////////////////////////////////
    function(next) {

      const event_notification = {
        "url": "http://code.westus.cloudapp.azure.com:8000/docusign",
        "loggingEnabled": "true",
        "requireAcknowledgment": "true",
        "useSoapInterface": "false",
        "includeCertificateWithSoap": "false",
        "signMessageWithX509Cert": "false",
        "includeDocuments": "true",
        "includeEnvelopeVoidReason": "true",
        "includeTimeZone": "true",
        "includeSenderAccountAsCustomField": "true",
        "includeDocumentFields": "true",
        "includeCertificateOfCompletion": "true",
        "envelopeEvents": [
          {
            "envelopeEventStatusCode": "sent"
          },
          {
            "envelopeEventStatusCode": "delivered"
          },
          {
            "envelopeEventStatusCode": "completed"
          },
          {
            "envelopeEventStatusCode": "declined"
          },
          {
            "envelopeEventStatusCode": "voided"
          }
        ],
        "recipientEvents": [
          {
            "recipientEventStatusCode": "Sent"
          },
          {
            "recipientEventStatusCode": "Delivered"
          },
          {
            "recipientEventStatusCode": "Completed"
          },
          {
            "recipientEventStatusCode": "Declined"
          },
          {
            "recipientEventStatusCode": "AuthenticationFailed"
          },
          {
            "recipientEventStatusCode": "AutoResponded"
          }
        ]
      };

    	var url = baseUrl + "/envelopes";
    	// following request body will place 1 signature tab 100 pixels to the right and
    	// 100 pixels down from the top left of the document that you send in the request
		var body = {
			"recipients": {
				"signers": [{
					"email": recipientEmail,
					"name": recipientName,
					"recipientId": 1,
          "clientUserId": "2001",
          "tabs": {
						"signHereTabs": [{
							"xPosition": "100",
							"yPosition": "100",
							"documentId": "1",
							"pageNumber": "1"
						}]
					}
				}]
			},
			"emailSubject": 'Prescription Approval Request',
			"documents": [{
				"name": documentName,
				"documentId": 1,
      }],
      "eventNotification": event_notification,
			"status": "sent"
		};

		// set request url, method, body, and headers
		var options = initializeRequest(url, "POST", body, email, password);

		// change default Content-Type header from "application/json" to "multipart/form-data"
		options.headers["Content-Type"] = "multipart/form-data";

		// configure a multipart http request with JSON body and document bytes
		options.multipart = [{
					"Content-Type": "application/json",
					"Content-Disposition": "form-data",
					"body": JSON.stringify(body),
				}, {
					"Content-Type": "application/pdf",
					'Content-Disposition': 'file; filename="' + documentName + '"; documentId=1',
					"body": document,
				}
		];

		// send the request...
		request(options, function(err, res, body) {
			parseResponseBody(err, res, body);
      envelopeId = JSON.parse(body).envelopeId;
      console.log('envelopeId', envelopeId);
      next(null);
		});
  }, // end function

	//////////////////////////////////////////////////////////////////////
	// Step 3 - Get the Embedded Signing View (aka the recipient view)
	//////////////////////////////////////////////////////////////////////
	function(next) {
		var url = baseUrl + "/envelopes/" + envelopeId + "/views/recipient";
		var method = "POST";
		var body = JSON.stringify({
				"returnUrl": "http://www.docusign.com/devcenter",
				"authenticationMethod": "PaperDocuments",
				"email": recipientEmail,
				"userName": recipientName,
				"clientUserId": "2001",	// must match clientUserId in step 2!
			});

		// set request url, method, body, and headers
		var options = initializeRequest(url, "POST", body, email, password);

		// send the request...
		request(options, function(err, res, body) {
			if(!parseResponseBody(err, res, body))
				return;
			else {
        console.log("\nNavigate to the above URL to start the Embedded Signing workflow...");
        return cb(JSON.parse(body).url);
      }
		});
	}
]);

//***********************************************************************************************
// --- HELPER FUNCTIONS ---
//***********************************************************************************************
function initializeRequest(url, method, body, email, password) {
	var options = {
		"method": method,
		"uri": url,
		"body": body,
		"headers": {}
	};
	addRequestHeaders(options, email, password);
	return options;
}

///////////////////////////////////////////////////////////////////////////////////////////////
function addRequestHeaders(options, email, password) {
	// JSON formatted authentication header (XML format allowed as well)
	dsAuthHeader = JSON.stringify({
		"Username": email,
		"Password": password,
		"IntegratorKey": integratorKey	// global
	});
	// DocuSign authorization header
	options.headers["X-DocuSign-Authentication"] = dsAuthHeader;
}

///////////////////////////////////////////////////////////////////////////////////////////////
function parseResponseBody(err, res, body) {
	console.log("\r\nAPI Call Result: \r\n", JSON.parse(body));
	if( res.statusCode != 200 && res.statusCode != 201)	{ // success statuses
		console.log("Error calling webservice, status is: ", res.statusCode);
		console.log("\r\n", err);
		return false;
	}
	return JSON.parse(body);
}
};