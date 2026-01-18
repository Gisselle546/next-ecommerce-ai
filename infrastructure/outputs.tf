output "vpc_id" {
  description = "VPC id"
  value       = module.vpc.vpc_id
}

output "ecr_backend_repo" {
  value = module.ecr_backend.repository_url
}

output "ecr_client_repo" {
  value = module.ecr_client.repository_url
}
