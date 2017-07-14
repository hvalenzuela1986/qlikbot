const moment = require('moment');
const builder = require('botbuilder');
const restify = require('restify');
const server = restify.createServer();

// Setup bot
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
const bot = new builder.UniversalBot(connector);

// Setup LUIS
const recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/2b9b5b2a-0d70-47e0-a22b-349a2f92c4a0?subscription-key=25351cce1dd647f9b048f619c5b0a406&verbose=true&timezoneOffset=0&q=');
const intents = new builder.IntentDialog({ recognizers: [recognizer] });

// Setup Intents
intents.matches('Saludar', function (session, results) {
    session.send('Hola ¿En que te puedo ayudar?');
});

intents.onDefault(builder.DialogAction.send('No he entendido lo que quieres decir'));

bot.dialog('/', intents);

// Setup Restify Server
server.post('/api/messages', connector.listen());

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s escuchando %s', server.name, server.url);
});

var QRS = require('qrs');
var config = {
    "host": 'qs.arauco.cl',
    "useSSL": true,
	"port": 4242,
    "xrfkey": 'ABCDEFG123456789',
    "authentication": "header",
    "headerKey": 'X-Qlik-User',
    "headerValue": 'UserDirectory:Internal;UserId:sa_repository'
};
var qrs = new QRS( config );

// Now run your command like
qrs.get('qrs/about', function( data ) {
	console.log(data);
});