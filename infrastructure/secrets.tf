// Read production DB password from AWS Secrets Manager
data "aws_secretsmanager_secret_version" "db_password" {
  # Accept secret name or ARN via variable
  secret_id = var.db_secret_name
}
