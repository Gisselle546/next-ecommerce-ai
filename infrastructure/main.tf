module "vpc" {
  source       = "./modules/vpc"
  cidr_block   = var.vpc_cidr
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
  tags = {
    Project = var.project
    Env     = var.env
  }
}

module "ecr_backend" {
  source = "./modules/ecr"
  name   = "${var.project}-backend"
}

module "ecr_client" {
  source = "./modules/ecr"
  name   = "${var.project}-client"
}

module "eks" {
  source = "./modules/eks"
  cluster_name = "${var.project}-${var.env}-eks"
  vpc_id       = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
  public_subnets  = module.vpc.public_subnets
}

module "rds" {
  source = "./modules/rds"
  db_name     = var.db_name
  username    = var.db_username
  # password is read from AWS Secrets Manager (see data.aws_secretsmanager_secret_version.db_password)
  password    = data.aws_secretsmanager_secret_version.db_password.secret_string
  subnet_ids  = module.vpc.private_subnets
}

module "redis" {
  source = "./modules/redis"
  subnet_ids = module.vpc.private_subnets
}

# IAM role for GitHub Actions (OIDC)
module "iam_ci" {
  source = "./modules/iam"
  # Default allows any repo on main branch; replace for tighter security
  github_sub_condition = var.github_sub_condition
  db_secret_arn = "" # optional: set if you want the policy scoped to a specific secret
}
