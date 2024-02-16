import { createFlow } from "@bot-whatsapp/bot";

//Flows
import flowWelcome from "./welcome";

const BOT_FLOW = createFlow([flowWelcome])

export default BOT_FLOW