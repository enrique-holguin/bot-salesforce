import { EVENTS, MemoryDB, addKeyword,utils } from "@bot-whatsapp/bot";
import { BaileysProvider } from "@bot-whatsapp/provider-baileys";
import { SalesForce } from "src/salesforce/class";

const flowWelcome = addKeyword<BaileysProvider,MemoryDB>(EVENTS.WELCOME).addAction(async (ctx,{extensions,flowDynamic,endFlow,provider,database,state}) => {
  const salesforce:SalesForce = extensions?.salesforce
  const myState = state.getMyState()
  if (!myState?.session) {
    const uuid = salesforce.generateUUID()
    const response = await salesforce.initSession(uuid)
    state.update({uuid,response,session:true})
    for (let message of response.messages) {
      await utils.delay(800)
      await flowDynamic(message.text)
      await utils.delay(800)
    }
    return endFlow()
  }
  return endFlow("Sesión ya iniciada")
})

export default flowWelcome