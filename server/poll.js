var 	async = require("async"),		// async module
    	request = require("request"),		// request module
    	email = process.env.email,				// your account email
    	password = process.env.password,			// your account password
    	integratorKey = process.env.integratorKey,			// your account Integrator Key (found on Preferences -> API page)
    	baseUrl = ""; 				// we will retrieve this

async.waterfall(
[
	function(next) {
		var url = "https://demo.docusign.net/restapi/v2/login_information";
		var body = "";	// no request body for login api call

		var options = initializeRequest(url, "GET", body, email, password);

		request(options, function(err, res, body) {
			if(!parseResponseBody(err, res, body)) {
				return;
			}
			baseUrl = JSON.parse(body).loginAccounts[0].baseUrl;
			next(null); // call next function
		});
	},

	function(next) {
		var date = new Date();
		var curr_day = date.getDate();
		var curr_month = date.getMonth();
		var curr_year = date.getFullYear();
		if( curr_month != 0 )
			curr_month;
		else { // special case if in January
			curr_month = 12;
			curr_year -= 1;
		}

    var url  = baseUrl + "/envelopes?from_date=" + curr_month + "%2F" + curr_day + "%2F" + curr_year;
    console.log(curr_day, curr_month, url);
		var body = "";	// no request body needed for this api call

		// set request url, method, body, and headers
		var options = initializeRequest(url, "GET", body, email, password);

		// send the request...
		request(options, function(err, res, body) {
			parseResponseBody(err, res, body);
		});
    }]
);

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

function addRequestHeaders(options, email, password) {
	dsAuthHeader = JSON.stringify({
		"Username": email,
		"Password": password,
		"IntegratorKey": integratorKey	// global
	});
	options.headers["X-DocuSign-Authentication"] = dsAuthHeader;
}

function parseResponseBody(err, res, body) {
	console.log("\r\nAPI Call Result: \r\n", JSON.parse(body));
	if( res.statusCode != 200 && res.statusCode != 201)	{ // success statuses
		console.log("Error calling webservice, status is: ", res.statusCode);
		console.log("\r\n", err);
		return false;
	}
	return true;
}