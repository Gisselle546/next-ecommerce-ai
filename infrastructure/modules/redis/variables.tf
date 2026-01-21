variable "cluster_id" { type = string }
variable "subnet_ids" { type = list(string) }
variable "vpc_id" { type = string }
variable "vpc_cidr" { type = string }
variable "node_type" {
  type    = string
  default = "cache.t4g.micro"
}
variable "num_cache_nodes" {
  type    = number
  default = 1
}
