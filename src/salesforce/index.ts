import { SalesForce } from "./class";

const salesforce = new SalesForce()

const INIT_SALESFORCE = async () => {
  await salesforce.getToken()
  return salesforce
}

export default INIT_SALESFORCE