export interface Session {
  sessionId:            string;
  botVersion:           string;
  messages:             Message[];
  processedSequenceIds: number[];
  _links:               Links;
}

interface Links {
  session:  Messages;
  self:     Messages;
  messages: Messages;
}

interface Messages {
  href: string;
}

interface Message {
  id:       string;
  schedule: Schedule;
  type:     string;
  text?:    string;
  widget?:  string;
  choices?: Choice[];
}

interface Choice {
  label: string;
  alias: string;
  id:    string;
}

interface Schedule {
  responseDelayMilliseconds: number;
}
