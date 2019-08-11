resource "aws_lambda_function" "rest_shorturl_lambda" {
  function_name = "shorturl"

  s3_bucket = "${var.s3_bucket}"
  s3_key = "v${var.lambda_version}/lambda.zip"

  # "main" is the filename within the zip file (index.js) and "handler"
  # is the name of the property under which the handler function was
  # exported in that file.
  handler = "lambda.handler"
  runtime = "nodejs10.x"
  memory_size = 512

  role = "${aws_iam_role.lambda_iam_role.arn}"
}

resource "aws_lambda_permission" "api_gateway_invoke_rest_lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.rest_shorturl_lambda.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the specified API Gateway.
  source_arn = "${aws_api_gateway_deployment.codingtips-api-gateway-deployment.execution_arn}/*/*"
}

