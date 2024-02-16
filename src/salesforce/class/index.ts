import { Auth, Session } from "./types"

export class SalesForce {
  private readonly clientId = process.env.CLIENT_ID
  private readonly clientSecret = process.env.CLIENT_SECRET
  private readonly orgId = process.env.X_Org_Id 
  private readonly requestId = process.env.X_Request_Id
  private readonly endpoint = process.env.ENDPOINT
  private readonly postSession = process.env.POSTFIX_SESSION
  private readonly runtime = process.env.RUNTIME_URL
  private readonly botId = process.env.BOT_ID
  private readonly botVersion = process.env.BOT_VERSION
  public token:string 

  constructor() {
  }

  /**
   * 
   * @param state "bots" se usa para iniciar una sesión y "sessions" para continuar la sesión
   * @returns 
   */
  private buildUrlRequest() {
    return `${this.runtime}/${this.botVersion}`
  }

  private urlSession() {
    return `${this.buildUrlRequest()}/bots/${this.botId}/sessions`
  }

  /**
   * 
   * @param sessionId id obtenido cuando se inicia sesión o se envía un mensaje
   * @returns 
   */
  private urlMessage(sessionId:string) {
    return `${this.buildUrlRequest()}/sessions/${sessionId}/messages`
  }
  private buildUrl(post:string) {
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
    const data =  await fetch(url,{method: "POST",body:formData,headers})
    const payload:Auth = await data.json()
    this.token = payload.access_token
  }
  
  generateUUID() {
    return global.crypto.randomUUID()
  }

  async initSession(uuid:string) {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('X-Org-Id',this.orgId)
    requestHeaders.set('X-Request-Id',this.requestId)
    requestHeaders.set('Authorization',`Bearer ${this.token}`)
    requestHeaders.set('Content-Type','application/json')
    const body = JSON.stringify({
      forceConfig : {
        endpoint : this.endpoint
      },
      externalSessionKey : uuid
    })
    try {
      const data = await fetch(this.urlSession(),{body,headers:requestHeaders,method:'POST'})
      const response:Session = await data.json()
      console.log(response.messages)
    }
    catch (err) {
      console.error(err)
    }
  }
}