variable "cluster_id" { type = string }
variable "subnet_ids" { type = list(string) }
variable "node_type" { type = string default = "cache.t4.micro" }
variable "num_cache_nodes" { type = number default = 1 }
