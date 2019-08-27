# Server Deployment

Deploy code with terraform, and update DNS with cloudflare.

## Usage

### Deploy

Zip the source code, terraform apply.

- Go to `server/terraform` directory.

- Initialize terraform: `terraform init`.

- Zip the code folder and show archive filename: `zip -r -qq --exclude=*.git* --exclude=../terraform* $(git rev-parse HEAD|cut -c 1-5).zip .. && echo "$(git rev-parse HEAD|cut -c 1-5).zip"` (*Named by first 5 characters of git head commit id*).

- Deploy by `terraform apply`, follow the instruction.

### Update

To update code, commit the changes, rezip code folder

`zip -r -qq --exclude=*.git* --exclude=../terraform* $(git rev-parse HEAD|cut -c 1-5).zip .. && echo "$(git rev-parse HEAD|cut -c 1-5).zip"`

Then run `terraform apply` to deploy it.

*Archive filename should be defferent with previous one, or terraform would not update lambda.*

### Destroy

In `/terraform/server` directory: `terraform destroy`

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
