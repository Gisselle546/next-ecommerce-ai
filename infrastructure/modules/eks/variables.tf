variable "cluster_name" { type = string }
variable "vpc_id" { type = string }
variable "private_subnets" { type = list(string) default = [] }
variable "public_subnets" { type = list(string) default = [] }
variable "node_groups" { type = map(any) default = {
  default = {
    desired_capacity = 2
    max_capacity = 3
    min_capacity = 1
    instance_type = "t3.medium"
  }
} }
