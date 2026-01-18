variable "db_name" { type = string }
variable "username" { type = string }
variable "password" { type = string }
variable "subnet_ids" { type = list(string) }
variable "instance_class" { type = string default = "db.t4g.micro" }
