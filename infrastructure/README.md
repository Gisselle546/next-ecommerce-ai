# infrastructure

> Terraform starter for AWS resources used by the ecomrest project.

This folder contains a minimal Terraform layout and starter modules for:
- VPC
- ECR
- EKS (wrapper using terraform-aws-modules/eks/aws)
- RDS (Postgres)
- ElastiCache (Redis)

Quick start (production only)

This Terraform layout is intended for production infrastructure. For local development use the project's Docker Compose (`docker-compose.yml`) and the `backend/` + `client/` services — do not run Terraform for dev.

1. Create an S3 bucket and DynamoDB table for remote state (or update `backend.tf`).
2. Set AWS credentials in your environment (`AWS_PROFILE` or `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`).
3. Initialize and plan for production:

3. Initialize and plan for production:

```bash
cd infrastructure
terraform init
terraform plan -var-file=envs/prod.tfvars
```

Secrets

- Do NOT store secrets in `envs/prod.tfvars`. This scaffold reads the database password from AWS Secrets Manager. Set `db_secret_name` in `envs/prod.tfvars` to the secret's name or ARN.
- Ensure the credentials used by GitHub Actions have `secretsmanager:GetSecretValue` permission for the secret.

GitHub Actions OIDC

- This scaffold can create an IAM role and OIDC provider that allows GitHub Actions to assume a role via OIDC. The role grants read access to Secrets Manager and ECR push/pull permissions for CI.
- By default the OIDC subject condition allows any repo on the `main` branch. Replace `github_sub_condition` in `infrastructure/envs/prod.tfvars` or when calling the module to restrict to a specific repository (recommended).


Notes
- The `modules/eks` uses the official registry module and will need IAM roles and more config for production. This folder is a starter scaffold — review and harden before applying to prod.
- Keep secrets and real passwords out of `envs/prod.tfvars`. Use CI secrets, SSM, or Vault to inject sensitive values during CI/CD.