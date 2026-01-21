terraform {
  backend "s3" {
    bucket         = "ecomrest-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"                # literal value required
    dynamodb_table = "ecomrest-terraform-locks"
    encrypt        = true
  }
}