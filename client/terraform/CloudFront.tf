resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "Origin Access Identity for S3"
}

resource "aws_cloudfront_distribution" "site" {
  enabled = true
  default_root_object = "index.html"

  origin {
    origin_id   = "S3-${var.s3_bucket}"
    origin_path = "${var.s3_path}"
    domain_name = "${aws_s3_bucket.site.bucket_domain_name}"

    s3_origin_config {
      origin_access_identity = "${aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path}"
    }
  }

  # Route53 requires Alias/CNAME to be setup
  aliases = ["${var.domain_name}.${var.domain}"]

  viewer_certificate {
    # cloudfront_default_certificate = true
    ssl_support_method = "sni-only"
    acm_certificate_arn = "${aws_acm_certificate_validation.cert.certificate_arn}"
    minimum_protocol_version = "TLSv1.1_2016"
  }

  custom_error_response {
    error_code    = 403
    response_code = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code    = 404
    response_code = 200
    response_page_path = "/index.html"
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.s3_bucket}"

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = "${var.cache_default_ttl}"
    max_ttl                = "${var.cache_max_ttl}"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "cloudflare_record" "cname" {
  domain = "${var.domain}"
  name = "${var.domain_name}"
  type = "CNAME"
  value = "${aws_cloudfront_distribution.site.domain_name}"
  ttl = 1 # 1: auto
}

output "cloudfront"{
  value = "${aws_cloudfront_distribution.site.domain_name}"
}