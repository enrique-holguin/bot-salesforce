export interface Message {
  botVersion:           string;
  messages:             MessageElement[];
  processedSequenceIds: number[];
  _links:               Links;
}

interface Links {
  self: Self;
}

interface Self {
  href: string;
}

interface MessageElement {
  id:       string;
  schedule: Schedule;
  type:     string;
  text:     string;
}

interface Schedule {
  responseDelayMilliseconds: number;
}
