import 'dotenv/config'
import INIT_BOT from './bot'
import INIT_SALESFORCE from './salesforce'

const main = async () => {
  const salesforce = await INIT_SALESFORCE()
  INIT_BOT(salesforce)
}

main()