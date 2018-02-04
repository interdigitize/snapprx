function notify(url, dr){
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

var phoneNumber;
var message = 'You have recieved a new perscription to sign  '+url;;
const messageType = "ARN";
if(dr == 'tom.pruim1@gmail.com'){
  phoneNumber = 17085190579;
};
if (dr == 'frank3562@gmail.com') {
  phoneNumber = 16303407876;
}else if( dr == 'sm94010@gmail.com') {
  phoneNumber = 14153356477;
}

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

notify('http://www.espn.com','tom.pruim1@gmail.com');
notify('http://www.espn.com','frank3562@gmail.com');
