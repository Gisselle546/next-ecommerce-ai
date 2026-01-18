resource "aws_elasticache_cluster" "this" {
  cluster_id           = "${var.cluster_id}"
  engine               = "redis"
  node_type            = var.node_type
  num_cache_nodes      = var.num_cache_nodes
  subnet_group_name    = aws_elasticache_subnet_group.this.name
}

resource "aws_elasticache_subnet_group" "this" {
  name       = "${var.cluster_id}-subnets"
  subnet_ids = var.subnet_ids
}

output "endpoint" { value = aws_elasticache_cluster.this.cache_nodes[0].address }
