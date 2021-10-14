var DynamicsWebApi = require('dynamics-web-api');
var AuthenticationContext = require('adal-node').AuthenticationContext;

var authorityUrl = 'https://login.microsoftonline.com/[your endpoint]/oauth2/token';   //OAuth Token Endpoint
var resource = '[your CRM URL]'; //CRM Organization URL
var clientId = '[your clientID]';  //Dynamics 365 Client Id when registered in Azure
var username = '[your CRM ID]';
var password = '[your CRM password]';

var adalContext = new AuthenticationContext(authorityUrl);

function acquireToken(dynamicsWebApiCallback) {
    function adalCallback(error, token) {
        if (!error) {
            dynamicsWebApiCallback(token);
        }
        else {
            console.log('Token has not been retrieved. Error: ' + error.stack);
        }
    }
    adalContext.acquireTokenWithUsernamePassword(resource, username, password, clientId, adalCallback);
}

//create DynamicsWebApi object
var dynamicsWebApi = new DynamicsWebApi({
    webApiUrl: 'https://qcrmdev.crm5.dynamics.com/api/data/v9.1/',
    onTokenRefresh: acquireToken
});


//call WhoAmI
dynamicsWebApi.executeUnboundFunction("WhoAmI").then(function (response) {
    console.log('Hello Dynamics 365! My id is: ' + response.UserId);
}).catch(function (error) {
    console.log(error.message);
});


//call entity "new_q1s"
var request = {
    collection: "new_q1s",
    select: ["new_name"],
}

dynamicsWebApi.retrieveMultipleRequest(request)
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {

        console.log(error)
    });