import { Auth, SendMessage, Session } from "./types"

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


  private buildUrlRequest() {
    return `${this.runtime}/${this.botVersion}`
  }

  private urlSession() {
    return `${this.buildUrlRequest()}/bots/${this.botId}/sessions`
  }

  private buildHeaders() {
    const headers:HeadersInit = new Headers()
    headers.set('X-Org-Id',this.orgId)
    headers.set('X-Request-Id',this.requestId)
    headers.set('Authorization',`Bearer ${this.token}`)
    headers.set('Content-Type','application/json')
    return headers
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
    const requestHeaders = this.buildHeaders()
    const body = JSON.stringify({
      forceConfig : {
        endpoint : this.endpoint
      },
      externalSessionKey : uuid
    })
    try {
      const data = await fetch(this.urlSession(),{body,headers:requestHeaders,method:'POST'})
      if (data.status === 200) {
        const response:Session = await data.json()
        return response
      }
      throw new Error("Error fetch")
    }
    catch (err) {
      console.error(err)
    }
  }

  async sendMessage(payload:{sequenceId:number,inReplyToMessageId:string,text:string,sessionId:string}) {
    const headers = this.buildHeaders()
    const body:SendMessage = {
      message: {
        sequenceId:payload.sequenceId,
        type:"text",
        text:payload.text,
        inReplyToMessageId:payload.inReplyToMessageId
      }
    }
    try {
      const data = await fetch(this.urlMessage(payload.sessionId),{method:"POST",headers,body:JSON.stringify(body)})
      if (data.status === 200) {
        const response:Session = await data.json()
        return response
      }
      throw new Error("Error fetch")
    }
    catch (err) {
      console.error(err)
    }
  }
}