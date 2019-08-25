data "template_file" "api_swagger" {
  template = "${file("swagger.yaml")}"

  vars = {
    lambda_arn = "${aws_lambda_function.default.invoke_arn}"
  }
}

resource "aws_api_gateway_rest_api" "default" {
  name        = "ShortUrlAPI"
  description = "API to access application"
  body        = "${data.template_file.api_swagger.rendered}"
}

resource "aws_api_gateway_deployment" "default" {
  rest_api_id = "${aws_api_gateway_rest_api.default.id}"
  stage_name  = "default"
}

resource "aws_api_gateway_domain_name" "default" {
  domain_name = "${var.domain_name}.${var.domain}"
  regional_certificate_arn = "${aws_acm_certificate_validation.cert.certificate_arn}"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_base_path_mapping" "default" {
  api_id = "${aws_api_gateway_rest_api.default.id}"
  stage_name = "${aws_api_gateway_deployment.default.stage_name}"
  domain_name = "${aws_api_gateway_domain_name.default.domain_name}"
}


resource "cloudflare_record" "cname" {
  domain = "${var.domain}"
  name = "${var.domain_name}"
  type = "CNAME"
  value = "${aws_api_gateway_domain_name.default.regional_domain_name}"
  ttl = 1 # 1: auto
}

output "record" {
  value = "${cloudflare_record.cname.hostname}"
}

output "url" {
  value = "${aws_api_gateway_deployment.default.invoke_url}"
}
