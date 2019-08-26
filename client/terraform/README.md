# Client Deployment

Deploy code with terraform, and update DNS with cloudflare.

## Usage

Build, upload and serve.

- Build react code: `yarn run build`.

- Serve with Cloudfront: `terraform apply`.

## IAM Permissions

To deploy, the aws account requires a set of permissions:

- Cloudfront
- Certificate Manager
- CloudWatch Logs
- S3

A sample of policy:

```JSON
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "cloudfront:*",
                "logs:*",
                "s3:*",
                "acm:*"
            ],
            "Resource": "*"
        }
    ]
}
```
