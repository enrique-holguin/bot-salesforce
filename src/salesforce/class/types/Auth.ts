export interface Auth {
  access_token: string;
  signature:    string;
  scope:        string;
  instance_url: string;
  id:           string;
  token_type:   string;
  issued_at:    string;
}
