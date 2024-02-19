import { Session } from "src/salesforce/class/types"

export type UserState = {
  uuid:string,
  response:Session,
  session?:boolean
  sequenceId:number,
  sessionId:string,
  inReplyToMessageId:string
} | undefined