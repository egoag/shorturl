variable "s3_bucket" {
  type = "string"
  description = "Bucket name"
}

variable "s3_path" {
  type = "string"
  description = "Bucket path to source code, starts with \"/\", like \"/client/prod\""
  default = "client/prod"
}

variable "domain" {
  type = "string"
  description = "Domain, \"example.com\" for example"
}

variable "domain_name" {
  type = "string"
  description = "Domain name, \"@\" for example"
}

variable "cloudflare_email" {
  type = "string"
  description = "Your Cloudflare account email"
}

variable "cloudflare_token" {
  type = "string"
  description = "Your Cloudflare \"Global API Key\""
}

variable "cache_max_ttl" {
  default = 31536000
}

variable "cache_default_ttl" {
  default = 86400
}


