// This module is a thin wrapper that delegates to the registry module
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name = var.cluster_name
  vpc_id       = var.vpc_id
  subnet_ids   = concat(var.private_subnets, var.public_subnets)

  node_groups = var.node_groups
}

output "cluster_id" { value = module.eks.cluster_id }
output "cluster_endpoint" { value = module.eks.cluster_endpoint }
