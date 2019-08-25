# Server Deployment

Deploy code with terraform, and update DNS with cloudflare.

## Usage

Zip the source code, terraform apply.

- In `/server` directory, zip the code folder: `zip -r -0 --exclude=*.DS_Store* --exclude=*.git* --exclude=terraform* terraform/server.zip .`.

- In `/terraform/server` directory, initialize terraform: `terraform init`.

- In `/terraform/server` folder, deploy by `terraform apply`, follow the instruction.

## IAM Permissions

To deploy, the aws account requires a set of permissions:

- API Gateway
- Lambda
- IAM
- Certificate Manager
- CloudWatch Logs
- DynamoDB

A sample of policy:

```JSON
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "logs:DescribeLogStreams",
                "iam:CreateRole",
                "dynamodb:ListTagsOfResource",
                "iam:AttachRolePolicy",
                "iam:PutRolePolicy",
                "dynamodb:DeleteTable",
                "iam:ListInstanceProfilesForRole",
                "iam:PassRole",
                "iam:DetachRolePolicy",
                "dynamodb:TagResource",
                "dynamodb:DescribeTable",
                "iam:DeleteRolePolicy",
                "logs:GetLogEvents",
                "dynamodb:DescribeContinuousBackups",
                "logs:FilterLogEvents",
                "iam:GetRole",
                "dynamodb:UpdateTimeToLive",
                "dynamodb:UntagResource",
                "logs:DescribeLogGroups",
                "apigateway:*",
                "logs:DeleteLogGroup",
                "iam:DeleteRole",
                "dynamodb:DescribeTimeToLive",
                "logs:CreateLogGroup",
                "dynamodb:CreateTable",
                "lambda:*",
                "logs:PutSubscriptionFilter",
                "iam:GetRolePolicy",
                "acm:*"
            ],
            "Resource": "*"
        }
    ]
}
```
