import { EVENTS, MemoryDB, addKeyword,utils } from "@bot-whatsapp/bot";
import { BaileysProvider } from "@bot-whatsapp/provider-baileys";
import { SalesForce } from "src/salesforce/class";
import { UserState } from "./types";

const flowWelcome = addKeyword<BaileysProvider,MemoryDB>(EVENTS.WELCOME).addAction(async (ctx,{extensions,flowDynamic,endFlow,provider,database,state}) => {
  const jid = (ctx as unknown as {key:{remoteJid:string}}).key.remoteJid
  const salesforce:SalesForce = extensions?.salesforce
  const myState = state.getMyState<UserState>()
  if (!myState?.session) {
    const uuid = salesforce.generateUUID()
    console.log(salesforce.token)
    const response = await salesforce.initSession(uuid)
    const id = parseInt(response.processedSequenceIds.toString())
    const inReplyToMessageId = response.messages[response.messages.length -1].id
    await state.update({uuid,response,session:true,sequenceId:id,sessionId:response.sessionId,inReplyToMessageId})
    for (let message of response.messages) {
      if (message.type === "choices") {
        state.update({idNext:message.id})
        await utils.delay(500)
        await provider.sendPoll(jid,'Select an option',{
          options: message.choices.map(msg => msg.label),
          multiselect: false
        })
      }
      await utils.delay(600)
      await flowDynamic(message.text)
      await utils.delay(600)
    }
    return endFlow()
  }
  const {inReplyToMessageId,sequenceId,sessionId} = myState as UserState
  const response = await salesforce.sendMessage({inReplyToMessageId,sequenceId,sessionId,text:ctx.body})
  console.log(response)
  const newMessageId = response.messages[response.messages.length -1].id
  for (let message of response.messages) {
    if (message.type === "sessionEnded") await state.update({session:false})
    if (message.type === "choices") {
      state.update({idNext:message.id})
      await utils.delay(500)
      await provider.sendPoll(jid,'Select an option',{
        options: message.choices.map(msg => msg.label),
        multiselect: false
      })
    }
    await utils.delay(600)
    await flowDynamic(message.text)
    await utils.delay(600)
  }
  await state.update({response,sequenceId:sequenceId+1,inReplyToMessageId:newMessageId})
  return endFlow()
}
)

export default flowWelcome