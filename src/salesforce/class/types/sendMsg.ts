export interface SendMessage {
  message:Message
}

type Message = {
  sequenceId:number,
  type:"text",
  text:string,
  inReplyToMessageId:string
}