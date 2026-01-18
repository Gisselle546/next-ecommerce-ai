data "aws_caller_identity" "current" {}

# Create OIDC provider for GitHub Actions
resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

# IAM role that GitHub Actions can assume via OIDC
resource "aws_iam_role" "github_actions_role" {
  name = var.role_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        },
        Action = "sts:AssumeRoleWithWebIdentity",
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" = var.github_sub_condition
          }
        }
      }
    ]
  })
}

# Inline policy granting SecretsManager read and ECR push/pull
data "aws_iam_policy_document" "ci_policy" {
  statement {
    sid = "SecretsManagerRead"
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret"
    ]
    resources = [var.db_secret_arn == "" ? "*" : var.db_secret_arn]
  }

  statement {
    sid = "ECRPushPull"
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "ci_policy_attach" {
  name   = "${var.role_name}-inline-policy"
  role   = aws_iam_role.github_actions_role.id
  policy = data.aws_iam_policy_document.ci_policy.json
}

output "role_arn" {
  value = aws_iam_role.github_actions_role.arn
}

output "oidc_provider_arn" {
  value = aws_iam_openid_connect_provider.github.arn
}
