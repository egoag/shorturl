resource "aws_api_gateway_rest_api" "shorturl_api_gateway" {
  name        = "ShortUrlAPI"
  description = "API to access application"
  body        = "${data.template_file.codingtips_api_swagger.rendered}"
}

data "template_file" codingtips_api_swagger{
  template = "${file("swagger.yaml")}"

  vars {
    lambda_arn = "${aws_lambda_function.rest_shorturl_lambda.invoke_arn}"
  }
}

resource "aws_api_gateway_deployment" "shorturl_api_gateway_deployment" {
  rest_api_id = "${aws_api_gateway_rest_api.shorturl_api_gateway.id}"
  stage_name  = "default"
}

output "url" {
  value = "${aws_api_gateway_deployment.shorturl_api_gateway_deployment.invoke_url}/api"
}
