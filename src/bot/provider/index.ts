import { createProvider } from "@bot-whatsapp/bot";
import { BaileysProvider } from "@bot-whatsapp/provider-baileys";

const BOT_PROVIDER = createProvider(BaileysProvider)

export default BOT_PROVIDER