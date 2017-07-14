const moment = require('moment');
const builder = require('botbuilder');
const restify = require('restify');
const server = restify.createServer();

// Setup bot
const connector = new builder.ChatConnector({
    //appId: process.env.MICROSOFT_APP_ID,
    //appPassword: process.env.MICROSOFT_APP_PASSWORD
    appId: "ef4f80eb-823e-41a8-8974-1d47eaad7e4d",
    appPassword: "ybggCUEWnoDVCUF7j0UXObt"
});
const bot = new builder.UniversalBot(connector);

// Setup LUIS
const recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/2b9b5b2a-0d70-47e0-a22b-349a2f92c4a0?subscription-key=25351cce1dd647f9b048f619c5b0a406&verbose=true&timezoneOffset=0&q=');
const intents = new builder.IntentDialog({ recognizers: [recognizer] });

// Setup Intents
intents.matches('Saludar', function (session, results) {
    session.send('Hola ¿En que te puedo ayudar?');
});

intents.matches('Produccion', [function (session, args, next) {
    var divisionEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Division');
    session.send('Estamos analizando la Produccion de %s',divisionEntity);
}]);

intents.onDefault(builder.DialogAction.send('No he entendido lo que quieres decir'));

bot.dialog('/', intents);

// Setup Restify Server
server.post('/api/messages', connector.listen());

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s escuchando %s', server.name, server.url);
});
