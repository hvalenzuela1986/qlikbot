var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: "ef4f80eb-823e-41a8-8974-1d47eaad7e4d",
    appPassword: "ybggCUEWnoDVCUF7j0UXObt"
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Disculpa, no he entendido tu pregunta');
});

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/2b9b5b2a-0d70-47e0-a22b-349a2f92c4a0?subscription-key=25351cce1dd647f9b048f619c5b0a406&verbose=true&timezoneOffset=0&q=');
bot.recognizer(recognizer);

bot.dialog('Saludar', function (session) {
    session.endDialog('Hola ¿En que te puedo ayudar?');
}).triggerAction({
    matches: 'Saludar'
});

bot.dialog('Produccion', [
    function (session, args, next) {
        //session.send('Estamos analizando tu consulta: \'%s\'', session.message.text);

        // try extracting entities
        var divisionEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Division');
        if (divisionEntity) {
            // city entity detected, continue to next step
            session.dialogData.searchType = 'division';
            next({ response: divisionEntity.entity });
        } else {
            // no entities detected, ask user for a destination
            builder.Prompts.text(session, 'Por favor ingresa una division');
        }
    },
    function (session, results) {
        var result = results.response;

        session.send('La producción de %s es 340.000 m3', result);
       
    }
])
.triggerAction({
    matches: 'Produccion'
});
