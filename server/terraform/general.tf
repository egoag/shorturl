provider "aws" {
  region = "ap-southeast-2"
}

variable "lambda_version"     { default = "0.1.0"}
variable "s3_bucket"          { default = "shorturl-node-bucket"}
