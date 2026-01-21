// This module is a thin wrapper that delegates to the registry module
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.28"
  
  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnets
  
  # Enable IRSA (IAM Roles for Service Accounts)
  enable_irsa = true
  
  # Cluster endpoint access
  cluster_endpoint_public_access = true
  
  # Managed node groups (recommended over self-managed node_groups)
  eks_managed_node_groups = {
    main = {
      min_size     = 1
      max_size     = 3
      desired_size = 2
      
      instance_types = [\"t3.medium\"]
      capacity_type  = \"ON_DEMAND\"
      
      tags = {\n        Name = \"${var.cluster_name}-node\"\n      }
    }
  }
  
  # Allow cluster access from anywhere (tighten in production)
  cluster_security_group_additional_rules = {
    ingress_nodes_ephemeral_ports_tcp = {
      description                = \"Nodes on ephemeral ports\"\n      protocol                   = \"tcp\"\n      from_port                  = 1025\n      to_port                    = 65535\n      type                       = \"ingress\"\n      source_node_security_group = true\n    }
  }
  
  tags = var.tags
}

output \"cluster_id\" { value = module.eks.cluster_id }
output \"cluster_endpoint\" { value = module.eks.cluster_endpoint }
output \"cluster_certificate_authority_data\" { value = module.eks.cluster_certificate_authority_data }
output \"cluster_oidc_issuer_url\" { value = module.eks.cluster_oidc_issuer_url }

