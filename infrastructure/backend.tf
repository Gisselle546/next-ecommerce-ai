terraform {
  # Remote state for production (update bucket/table names before first use)
  backend "s3" {
    bucket         = "ecomrest-terraform-state" # change to your bucket
    key            = "prod/terraform.tfstate"
    region         = var.aws_region
    dynamodb_table = "ecomrest-terraform-locks" # change or create
    encrypt        = true
  }
}
