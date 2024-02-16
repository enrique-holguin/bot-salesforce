import { SalesForce } from "./class";

const INIT_SALESFORCE = async () => {
  const salesforce = new SalesForce()
  await salesforce.getToken()
  const uuid = salesforce.generateUUID()
  await salesforce.initSession(uuid)
}

export default INIT_SALESFORCE