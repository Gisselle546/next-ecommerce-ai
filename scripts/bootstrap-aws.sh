#!/usr/bin/env bash
# Bootstrap AWS resources for Terraform state and secrets
# Run this script BEFORE running terraform init/apply

set -euo pipefail

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
S3_BUCKET="ecomrest-terraform-state"
DYNAMODB_TABLE="ecomrest-terraform-locks"
DB_SECRET_NAME="/prod/ecomrest/db_password"

echo "🚀 Bootstrapping AWS resources..."
echo "   Region: ${AWS_REGION}"
echo "   S3 Bucket: ${S3_BUCKET}"
echo "   DynamoDB Table: ${DYNAMODB_TABLE}"
echo "   Secret: ${DB_SECRET_NAME}"
echo ""

# Check AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✓ AWS Account: ${ACCOUNT_ID}"
echo ""

# Create S3 bucket for Terraform state
echo "📦 Creating S3 bucket for Terraform state..."
if aws s3api head-bucket --bucket "${S3_BUCKET}" 2>/dev/null; then
    echo "   Bucket already exists: ${S3_BUCKET}"
else
    if [ "${AWS_REGION}" = "us-east-1" ]; then
        aws s3api create-bucket \
            --bucket "${S3_BUCKET}" \
            --region "${AWS_REGION}"
    else
        aws s3api create-bucket \
            --bucket "${S3_BUCKET}" \
            --region "${AWS_REGION}" \
            --create-bucket-configuration LocationConstraint="${AWS_REGION}"
    fi
    echo "   ✓ Created bucket: ${S3_BUCKET}"
fi

# Enable versioning
echo "   Enabling versioning..."
aws s3api put-bucket-versioning \
    --bucket "${S3_BUCKET}" \
    --versioning-configuration Status=Enabled
echo "   ✓ Versioning enabled"

# Enable encryption
echo "   Enabling encryption..."
aws s3api put-bucket-encryption \
    --bucket "${S3_BUCKET}" \
    --server-side-encryption-configuration '{
        "Rules": [{
            "ApplyServerSideEncryptionByDefault": {
                "SSEAlgorithm": "AES256"
            }
        }]
    }'
echo "   ✓ Encryption enabled"

# Block public access
echo "   Blocking public access..."
aws s3api put-public-access-block \
    --bucket "${S3_BUCKET}" \
    --public-access-block-configuration \
        BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
echo "   ✓ Public access blocked"

echo ""

# Create DynamoDB table for state locking
echo "🔒 Creating DynamoDB table for state locking..."
if aws dynamodb describe-table --table-name "${DYNAMODB_TABLE}" --region "${AWS_REGION}" &> /dev/null; then
    echo "   Table already exists: ${DYNAMODB_TABLE}"
else
    aws dynamodb create-table \
        --table-name "${DYNAMODB_TABLE}" \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST \
        --region "${AWS_REGION}"
    
    echo "   Waiting for table to be active..."
    aws dynamodb wait table-exists --table-name "${DYNAMODB_TABLE}" --region "${AWS_REGION}"
    echo "   ✓ Created table: ${DYNAMODB_TABLE}"
fi

echo ""

# Create Secrets Manager secret for DB password
echo "🔐 Creating Secrets Manager secret for DB password..."
if aws secretsmanager describe-secret --secret-id "${DB_SECRET_NAME}" --region "${AWS_REGION}" &> /dev/null; then
    echo "   Secret already exists: ${DB_SECRET_NAME}"
    echo "   ⚠️  To update the secret value, run:"
    echo "      aws secretsmanager put-secret-value --secret-id ${DB_SECRET_NAME} --secret-string 'YOUR_NEW_PASSWORD'"
else
    # Generate a random password
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    
    SECRET_ARN=$(aws secretsmanager create-secret \
        --name "${DB_SECRET_NAME}" \
        --description "Production database password for ecomrest" \
        --secret-string "${DB_PASSWORD}" \
        --region "${AWS_REGION}" \
        --query ARN \
        --output text)
    
    echo "   ✓ Created secret: ${DB_SECRET_NAME}"
    echo "   ✓ Secret ARN: ${SECRET_ARN}"
    echo ""
    echo "   ⚠️  IMPORTANT: Save the generated password securely!"
    echo "   Password: ${DB_PASSWORD}"
    echo ""
fi

# Get the secret ARN for use in Terraform
SECRET_ARN=$(aws secretsmanager describe-secret --secret-id "${DB_SECRET_NAME}" --region "${AWS_REGION}" --query ARN --output text)

echo ""
echo "✅ Bootstrap complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Update infrastructure/envs/prod.tfvars with the secret ARN:"
echo "   db_secret_name = \"${SECRET_ARN}\""
echo ""
echo "2. Initialize Terraform:"
echo "   cd infrastructure"
echo "   terraform init"
echo ""
echo "3. Review and apply Terraform plan:"
echo "   terraform plan -var-file=envs/prod.tfvars"
echo "   terraform apply -var-file=envs/prod.tfvars"
echo ""
echo "4. After Terraform apply, note the IAM role ARN output and add it to GitHub Secrets:"
echo "   AWS_OIDC_ROLE_ARN=<role_arn_from_terraform_output>"
echo ""
