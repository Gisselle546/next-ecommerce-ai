variable "db_name" { type = string }
variable "username" { type = string }
variable "password" {
  type      = string
  sensitive = true
}
variable "subnet_ids" { type = list(string) }
variable "vpc_id" { type = string }
variable "vpc_cidr" { type = string }
variable "instance_class" {
  type    = string
  default = "db.t4g.micro"
}
variable "skip_final_snapshot" {
  type    = bool
  default = true
}
variable "multi_az" {
  type    = bool
  default = false
}
