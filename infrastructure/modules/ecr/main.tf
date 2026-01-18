resource "aws_ecr_repository" "this" {
  name                 = var.name
  image_tag_mutability = "MUTABLE"
  tags = var.tags
}

output "repository_url" { value = aws_ecr_repository.this.repository_url }
