import { createBot } from "@bot-whatsapp/bot";
import BOT_DB from "./database";
import BOT_FLOW from "./flow";
import BOT_PROVIDER from "./provider";
import { SalesForce } from "src/salesforce/class";

const INIT_BOT = async (salesforce:SalesForce) => {
  return await createBot({flow:BOT_FLOW,database:BOT_DB,provider:BOT_PROVIDER},{extensions:{salesforce}})
}

export default INIT_BOT