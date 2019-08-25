provider "aws" {
  region = "ap-southeast-2"
}

provider "cloudflare" {
  email = "${var.cloudflare_email}"
  token = "${var.cloudflare_token}"
}
