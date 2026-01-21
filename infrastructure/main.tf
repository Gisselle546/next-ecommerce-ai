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
  tags = {
    Project = var.project
    Env     = var.env
  }
}

module "ecr_client" {
  source = "./modules/ecr"
  name   = "${var.project}-client"
  tags = {
    Project = var.project
    Env     = var.env
  }
}

module "eks" {
  source = "./modules/eks"
  cluster_name = "${var.project}-${var.env}-eks"
  vpc_id       = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
  tags = {
    Project = var.project
    Env     = var.env
  }
}

module "rds" {
  source = "./modules/rds"
  db_name     = var.db_name
  username    = var.db_username
  # password is read from AWS Secrets Manager (see data.aws_secretsmanager_secret_version.db_password)
  password    = data.aws_secretsmanager_secret_version.db_password.secret_string
  subnet_ids  = module.vpc.private_subnets
  vpc_id      = module.vpc.vpc_id
  vpc_cidr    = var.vpc_cidr
}

module "redis" {
  source     = "./modules/redis"
  cluster_id = "${var.project}-${var.env}-redis"
  subnet_ids = module.vpc.private_subnets
  vpc_id     = module.vpc.vpc_id
  vpc_cidr   = var.vpc_cidr
}

# IAM role for GitHub Actions (OIDC)
module "iam_ci" {
  source = "./modules/iam"
  project = var.project
  env = var.env
  # Default allows any repo on main branch; replace for tighter security
  github_sub_condition = var.github_sub_condition
  db_secret_arn = var.db_secret_name # optional: set if you want the policy scoped to a specific secret
}
