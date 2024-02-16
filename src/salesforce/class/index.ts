import { Auth } from "./types"

export class SalesForce {
  private readonly clientId = process.env.CLIENT_ID
  private readonly clientSecret = process.env.CLIENT_SECRET
  private readonly orgId = process.env.X_Org_Id 
  private readonly requestId = process.env.X_Request_Id
  private readonly endpoint = process.env.ENDPOINT
  private readonly postSession = process.env.POSTFIX_SESSION
  public readonly token:string 

  constructor() {}
  buildUrl(post:string) {
    return `${this.endpoint}/${post}`
  }
  async getToken() {
    const url = this.buildUrl(this.postSession)
    console.log(url)
    const formData = new URLSearchParams();
    formData.append('client_id', this.clientId);
    formData.append('client_secret', this.clientSecret);
    formData.append('grant_type', 'client_credentials');
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};
    try {
    const data =  await fetch(url,{method: "POST",body:formData,headers})
    const payload:Auth = await data.json()
    return payload.access_token
  }
  catch(err) {
    console.error(err)
  }
  }
}