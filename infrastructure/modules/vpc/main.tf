resource "aws_vpc" "this" {
  cidr_block = var.cidr_block
  tags = merge(var.tags, { Name = "${var.tags.Project}-${var.tags.Env}-vpc" })
}

resource "aws_subnet" "public" {
  count = length(var.public_subnets)
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.public_subnets[count.index]
  map_public_ip_on_launch = true
  tags = {
    Name = "public-${count.index}"
  }
}

resource "aws_subnet" "private" {
  count = length(var.private_subnets)
  vpc_id     = aws_vpc.this.id
  cidr_block = var.private_subnets[count.index]
  tags = {
    Name = "private-${count.index}"
  }
}

output "vpc_id" { value = aws_vpc.this.id }
output "public_subnets" { value = aws_subnet.public[*].id }
output "private_subnets" { value = aws_subnet.private[*].id }
