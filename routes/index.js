
var express = require('express');
var router = express.Router();
const dialogflow = require('dialogflow');
var uuidv4 =require('uuid/v4');
router.get('/dialogflow-gw', async function(req, res, next) {
  res.send({});
});
/* GET home page. */
router.post('/dialogflow-gw', async function(req, res, next) {



  //const uuid = require('uuid');

  /**
   * Send a query to the dialogflow agent, and return the query result.
   * @param {string} projectId The project to be used
   */


  res.send(await runSample('',req.body));
});

async function runSample(projectId = '',req) {
  // A unique identifier for the given session

  const config={
    

  }
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient(config);
  let sessionPath;
  if(!req.session){
    sessionPath = sessionClient.sessionPath(projectId, uuidv4());
  }else{
    sessionPath = sessionClient.sessionPath(projectId, req.session);
  }


  // The text query request.
  req.session=sessionPath;

  // Send request and log result
  const responses = await sessionClient.detectIntent(req);

  const res= responses[0];
  if(res.queryResult.allRequiredParamsPresent) {
    const result = res.queryResult.fulfillmentMessages.filter(v => v.platform === 'ACTIONS_ON_GOOGLE');

    console.log(result)

    if(result.length>0){
      res.queryResult.fulfillmentMessages=result
    }else{
      res.queryResult.fulfillmentMessages = res.queryResult.fulfillmentMessages.filter(v => v.platform === 'PLATFORM_UNSPECIFIED');
    }

  }else{
    res.queryResult.fulfillmentMessages = res.queryResult.fulfillmentMessages.filter(v => v.platform === 'PLATFORM_UNSPECIFIED');

  }



  return res;


}

module.exports = router;
