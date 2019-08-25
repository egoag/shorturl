variable "domain" {
  type = "string"
  description = "Domain, \"example.com\" for example"
}

variable "domain_name" {
  type = "string"
  description = "Domain name, \"api\" for example"
}
variable "cloudflare_email" {
  type = "string"
  description = "Your Cloudflare account email"
}

variable "cloudflare_token" {
  type = "string"
  description = "Your Cloudflare \"Global API Key\""
}

variable "lambda_memory" {
  default = 256
}
