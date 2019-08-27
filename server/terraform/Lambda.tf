resource "aws_lambda_function" "default" {
  function_name = "shorturl_server"

  filename = "${var.archive}"

  handler = "lambda.handler"

  runtime = "nodejs10.x"

  memory_size = "${var.lambda_memory}"

  role = "${aws_iam_role.lambda_iam_role.arn}"
}

resource "aws_lambda_permission" "api_gateway_invoke_rest_lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.default.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the specified API Gateway.
  source_arn = "${aws_api_gateway_deployment.default.execution_arn}/*/*"
}
