resource "aws_api_gateway_rest_api" "default" {
  name        = "ShortUrlAPI"
  description = "API to access application"
  # body        = "${data.template_file.api_swagger.rendered}"
}

resource "aws_api_gateway_resource" "default" {
  rest_api_id = "${aws_api_gateway_rest_api.default.id}"
  parent_id   = "${aws_api_gateway_rest_api.default.root_resource_id}"
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = "${aws_api_gateway_rest_api.default.id}"
  resource_id   = "${aws_api_gateway_rest_api.default.root_resource_id}"
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_root" {
  rest_api_id = "${aws_api_gateway_rest_api.default.id}"
  resource_id = "${aws_api_gateway_method.proxy_root.resource_id}"
  http_method = "${aws_api_gateway_method.proxy_root.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.default.invoke_arn}"
}
resource "aws_api_gateway_method" "default" {
 rest_api_id = "${aws_api_gateway_rest_api.default.id}" 
 resource_id = "${aws_api_gateway_resource.default.id}"
 http_method = "ANY"
 authorization = "NONE"
}

resource "aws_api_gateway_integration" "default" {
 rest_api_id = "${aws_api_gateway_rest_api.default.id}" 
 resource_id = "${aws_api_gateway_method.default.resource_id}"
 http_method = "${aws_api_gateway_method.default.http_method}"

 integration_http_method = "POST"
 type                    = "AWS_PROXY"
 uri                     = "${aws_lambda_function.default.invoke_arn}"
}

resource "aws_api_gateway_deployment" "default" {
  rest_api_id = "${aws_api_gateway_rest_api.default.id}"
  stage_name  = "dev"
}

resource "aws_api_gateway_domain_name" "default" {
  depends_on = [
    "aws_api_gateway_integration.default",
    "aws_api_gateway_integration.lambda_root",
  ]
  domain_name = "${var.domain_name}.${var.domain}"
  certificate_arn = "${aws_acm_certificate_validation.cert.certificate_arn}"
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
  value = "${aws_api_gateway_domain_name.default.cloudfront_domain_name}"
  ttl = 1 # 1: auto
}

output "record" {
  value = "${cloudflare_record.cname.hostname}"
}

output "url" {
  value = "${aws_api_gateway_deployment.default.invoke_url}"
}
