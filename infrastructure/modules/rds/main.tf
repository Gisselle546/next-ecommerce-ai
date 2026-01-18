resource "aws_db_subnet_group" "this" {
  name       = "${var.db_name}-subnet-group"
  subnet_ids = var.subnet_ids
}

resource "aws_db_instance" "this" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "15"
  instance_class       = var.instance_class
  name                 = var.db_name
  username             = var.username
  password             = var.password
  db_subnet_group_name = aws_db_subnet_group.this.name
  skip_final_snapshot  = true
}

output "address" { value = aws_db_instance.this.address }
