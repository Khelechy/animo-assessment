import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import {initializeIssuerAgent, setupConnectionListener}  from  "./src/services/AgentService"
import createNewInvitation from "./src/services/InvitationService"
import { registerCredentialDefinition, registerSchema, issueCredential, animoAttributes, animoTestAttributes } from "./src/services/CredentialService"
import { Agent } from "@aries-framework/core";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

let sAgent :Agent
let oobId :string = ""
let cdId :string = ""

//Initialize issuer agent
const setup = async () => {
  const agent = await initializeIssuerAgent();
  sAgent = agent // Mock single instance agent in DI container, by saving in a variable

  const credentialId = await registerSchemaAndCredentials(agent);
  //One can save credentialDefinition Id for subsequent credential issuance
  //we save in a variable for sake of this assessement
  cdId = credentialId
  console.log("credential Id " + credentialId)


  //setupConnectionListener(agent, outOfBandRecord)
}

//Run Setup
void setup()


//Functions
const registerSchemaAndCredentials = async (agent: Agent) : Promise<string> => {
  const schema = await registerSchema(agent);
  const credentialDefinition = await registerCredentialDefinition(
    agent,
    schema
  );
  return credentialDefinition.id
}

const createInvitation = async (agent: Agent) => {
  const { invitationUrl, outOfBandRecord } = await createNewInvitation(agent);
  console.log(outOfBandRecord.id, invitationUrl)
  //One can save outOfBandRecord Id for subsequent credential issuance
  //we save in a variable for sake of this assessement
  oobId = outOfBandRecord.id
  return invitationUrl
}

const issue = async(agent: Agent, credentialDefinitionId: string, outOfBandRecordId: string, attributes: animoAttributes[]) => await issueCredential(
  agent,
  credentialDefinitionId,
  outOfBandRecordId,
  attributes
);



app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/invitations/create', async (req: Request, res: Response) => {
  //Create New Invitation
  const url = await createInvitation(sAgent)
  res.json(url)
});

app.post('/credentials/issue', async (req: Request, res: Response) => {
  issue(sAgent, cdId, oobId, animoTestAttributes)
  res.send({"message": "sucsess"})
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});