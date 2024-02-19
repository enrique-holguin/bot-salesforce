import { EVENTS, MemoryDB, addKeyword,utils } from "@bot-whatsapp/bot";
import { BaileysProvider } from "@bot-whatsapp/provider-baileys";
import { SalesForce } from "src/salesforce/class";
import { UserState } from "./types";

const flowWelcome = 
addKeyword<BaileysProvider,MemoryDB>(EVENTS.WELCOME).addAction(async (ctx,{extensions,flowDynamic,endFlow,provider,database,state}) => {
  const jid = (ctx as unknown as {key:{remoteJid:string}}).key.remoteJid
  const salesforce:SalesForce = extensions?.salesforce
  const myState = state.getMyState()
  if (!myState?.session) {
    const uuid = salesforce.generateUUID()
    console.log(salesforce.token)
    const response = await salesforce.initSession(uuid)
    const id = parseInt(response.processedSequenceIds.toString())
    const inReplyToMessageId = response.messages[response.messages.length -1].id
    await state.update({uuid,response,session:true,sequenceId:id+1,sessionId:response.sessionId,inReplyToMessageId})
    for (let message of response.messages) {
      if (message.type === "choices") {
        await state.update({idNext:message.id})
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
  console.log(myState)
  const id = parseInt(myState.response.processedSequenceIds.toString())
  await utils.delay(700)
  const response = await salesforce.sendMessage({inReplyToMessageId,sequenceId:id+1,sessionId,text:ctx.body})
  console.log('Messages -->',response.messages[response.messages.length -1])
  console.log(response)
  try {
    const newMessageId = response.messages[response.messages.length -1].id
    await state.update({response,sequenceId:parseInt(response.processedSequenceIds.toString()),inReplyToMessageId:newMessageId})
  for (let message of response.messages) { 
    if (message.type === "sessionEnded") await state.update({session:false})
    if (message.type === "choices") {
      await state.update({idNext:message.id})
      await utils.delay(500)
      await provider.sendPoll(jid,'Select an option',{
        options: message.choices.map(msg => msg.label),
        multiselect: false
      })
    }
    await utils.delay(600)
    await flowDynamic(message.text)
    await utils.delay(1000)
  }
  return endFlow()
  }
  catch(err) {
    console.error(err)
    await state.update({session:false})
    return endFlow("We had a problem processing the message, the session will be restarted ❌")
  }
}
)

export default flowWelcome