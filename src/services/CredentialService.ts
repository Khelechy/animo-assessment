import { Agent } from "@aries-framework/core";
import { Schema } from "indy-sdk";


type animoAttributes = {
    name: string;
    value: string;
};

const animoTestAttributes = [
    { name: "name", value: "Jane Doe" },
    { name: "group", value: "Animo Hackathon Group A" },
];

const registerCredentialDefinition = async (issuer: Agent, schema: Schema) =>
    issuer.ledger.registerCredentialDefinition({
    schema,
    supportRevocation: false,
    tag: "default",
});

const registerSchema = async (issuer: Agent) =>
  issuer.ledger.registerSchema({
    attributes: ["name", "group"],
    name: "Identity",
    version: "1.0",
});
  
const issueCredential = async (
    issuer: Agent,
    credentialDefinitionId: string,
    connectionId: string,
    attributes: animoAttributes[]
) =>
issuer.credentials.offerCredential({
    protocolVersion: "v1",
    connectionId,
    credentialFormats: {
        indy: {
            credentialDefinitionId,
            attributes,
        },
    },
});

export {registerCredentialDefinition, issueCredential, registerSchema};
export { animoAttributes, animoTestAttributes }