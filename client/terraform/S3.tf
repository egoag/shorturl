resource "aws_s3_bucket" "site" {
  bucket        = "${var.s3_bucket}"
  acl           = "private"
  force_destroy = true
  policy = <<EOF
{
  "Id": "bucket_policy_site",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "bucket_policy_site_root",
      "Action": ["s3:ListBucket"],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${var.s3_bucket}",
      "Principal": {"AWS":"${aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn}"}
    },
    {
      "Sid": "bucket_policy_site_all",
      "Action": ["s3:GetObject"],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${var.s3_bucket}${var.s3_path}/*",
      "Principal": {"AWS":"${aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn}"}
    }
  ]
}
EOF
  website {
    index_document = "index.html"
    error_document = "404.html"
  }

#   tags = "${local.common_tags}"
}

resource "null_resource" "upload" {
  provisioner "local-exec" {
    command = "aws s3 sync ../build s3://${var.s3_bucket}${var.s3_path}"
  }
}

output "s3_endpoint" {
  value = "${aws_s3_bucket.site.website_endpoint}"
}

