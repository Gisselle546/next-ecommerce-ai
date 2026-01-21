resource "aws_security_group" "redis" {
  name        = "${var.cluster_id}-redis-sg"
  description = "Security group for Redis ElastiCache cluster"
  vpc_id      = var.vpc_id

  ingress {
    description = "Redis from VPC"
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.cluster_id}-redis-sg"
  }
}

resource "aws_elasticache_parameter_group" "this" {
  name   = "${var.cluster_id}-params"
  family = "redis7"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }
}

resource "aws_elasticache_subnet_group" "this" {
  name       = "${var.cluster_id}-subnets"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "${var.cluster_id}-subnets"
  }
}

resource "aws_elasticache_cluster" "this" {
  cluster_id           = var.cluster_id
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = var.node_type
  num_cache_nodes      = var.num_cache_nodes
  parameter_group_name = aws_elasticache_parameter_group.this.name
  subnet_group_name    = aws_elasticache_subnet_group.this.name
  security_group_ids   = [aws_security_group.redis.id]
  port                 = 6379
  
  tags = {
    Name = var.cluster_id
  }
}

output "endpoint" { value = aws_elasticache_cluster.this.cache_nodes[0].address }
output "port" { value = aws_elasticache_cluster.this.port }
output "security_group_id" { value = aws_security_group.redis.id }
