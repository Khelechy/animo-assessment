import {
    Agent,
    InitConfig,
    AutoAcceptCredential,
    WsOutboundTransport,
    HttpOutboundTransport,
    OutOfBandRecord,
    ConnectionEventTypes,
    ConnectionStateChangedEvent,
    DidExchangeState,
} from "@aries-framework/core";
import { agentDependencies, HttpInboundTransport } from "@aries-framework/node";
import { BCOVRIN_TEST_GENESIS } from '../utils/genesisTransactions'
import fetch from 'node-fetch'
import dotenv from 'dotenv';

dotenv.config();


const did = process.env.DID;

const getGenesisTransaction = async (url: string) => {
    const response = await fetch(url)
    return await response.text()
}

const initializeIssuerAgent = async () => {
    const genesisTransactionsBCovrinTestNet = await getGenesisTransaction('http://test.bcovrin.vonx.io/genesis')

    const config: InitConfig = {
        label: 'Animo SSI Engine',
        walletConfig: {
            id: 'animo test 7',
            key: 'animo test 7',
        },
        publicDidSeed: did,
        indyLedgers: [
            {
                id: 'bcovrin-test-net',
                isProduction: false,
                indyNamespace: 'bcovrin:test',
                genesisTransactions: genesisTransactionsBCovrinTestNet,
            },
        ],
        autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
        autoAcceptConnections: true,
        endpoints: ['http://localhost:3000'],
    }

    const agent = new Agent({config, dependencies: agentDependencies })

    agent.registerOutboundTransport(new WsOutboundTransport())
  
    agent.registerOutboundTransport(new HttpOutboundTransport())
  
    agent.registerInboundTransport(new HttpInboundTransport({ port: 3000 }))
  
    await agent.initialize()
    return agent
}

const setupConnectionListener = (
    issuer: Agent,
    outOfBandRecord: OutOfBandRecord
  ) => {
    issuer.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, async ({ payload }) => {
      if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) return
      if (payload.connectionRecord.state === DidExchangeState.Completed) {
        // the connection is now ready for usage in other protocols!
        console.log(`Connection for out-of-band id ${outOfBandRecord.id} completed`)
      }
    })
  }
  

export {initializeIssuerAgent, setupConnectionListener};