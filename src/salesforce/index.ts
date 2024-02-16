import { SalesForce } from "./class";

const INIT_SALESFORCE = async () => {
  const salesforce = new SalesForce()
  await salesforce.getToken()
}

export default INIT_SALESFORCE