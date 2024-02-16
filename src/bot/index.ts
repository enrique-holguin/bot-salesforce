import { createBot } from "@bot-whatsapp/bot";
import BOT_DB from "./database";
import BOT_FLOW from "./flow";
import BOT_PROVIDER from "./provider";

const INIT_BOT = async () => {
  return await createBot({flow:BOT_FLOW,database:BOT_DB,provider:BOT_PROVIDER})
}

export default INIT_BOT