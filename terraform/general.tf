provider "aws" {
  region = "ap-southeast-2"
}

provider "aws" {
  alias = "global"
  region = "us-east-1"
}


provider "cloudflare" {
  email = "${var.cloudflare_email}"
  token = "${var.cloudflare_token}"
}
