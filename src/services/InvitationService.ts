import { Agent } from "@aries-framework/core";

const createNewInvitation = async (agent: Agent) => {
  const outOfBandRecord = await agent.oob.createInvitation()
  return {
    invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({ domain: 'http://localhost:3000' }),
    outOfBandRecord,
  }
}

export default createNewInvitation;