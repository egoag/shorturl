resource "aws_acm_certificate" "cert" {
  provider =  "aws.global"
  domain_name = "${var.domain_name}.${var.domain}"
  validation_method = "DNS"
}

resource "cloudflare_record" "acm_validation"{
  domain = "${var.domain}"
  name = "${aws_acm_certificate.cert.domain_validation_options.0.resource_record_name}"
  type = "${aws_acm_certificate.cert.domain_validation_options.0.resource_record_type}"
  value = "${aws_acm_certificate.cert.domain_validation_options.0.resource_record_value}"
  ttl = 1 # 1: auto
}

resource "aws_acm_certificate_validation" "cert" {
  provider =  "aws.global"
  certificate_arn = "${aws_acm_certificate.cert.arn}"

  validation_record_fqdns = [
    "${cloudflare_record.acm_validation.hostname}",
  ]
}
