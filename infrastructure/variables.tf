variable "project" {
  type    = string
  default = "ecomrest"
}

variable "env" {
  type    = string
  default = "prod"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnets" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets" {
  type    = list(string)
  default = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "db_username" { type = string }

variable "db_secret_name" {
  description = "AWS Secrets Manager secret name or ARN that contains the DB password"
  type        = string
  default     = ""
}
variable "db_name"     { type = string }


variable "github_sub_condition" {
  type    = string
  default = "repo:Gisselle546/next-ecommerce-ai:ref:refs/heads/main"
}
