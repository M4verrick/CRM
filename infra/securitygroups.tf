# Security Group for RDS (Allows access from app servers only)
resource "aws_security_group" "rds_sg" {
  name        = "rds-security-group"
  description = "Allow access to RDS from app servers"
  vpc_id      = module.vpc.vpc_id

  # Ingress Rules: Define inbound traffic to RDS
  ingress {
    description      = "PostgreSQL access from app servers"
    from_port        = 5432  # PostgreSQL default port
    to_port          = 5432
    protocol         = "tcp"
    cidr_blocks      = ["10.0.0.0/16"] # Allow traffic from within the VPC (internal IP range)
    security_groups = [module.eks.cluster_primary_security_group_id, module.eks.cluster_security_group_id, module.eks.node_security_group_id]
  }

  # Egress Rules: Define outbound traffic from RDS
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"  # Allow all outbound traffic
    cidr_blocks = ["0.0.0.0/0"]  # Open outbound traffic to any destination (safe for databases)
  }

  tags = {
    Name = "rds-security-group"
  }
}
#
# # Security Group for Web Servers in Public Subnet 1a
# resource "aws_security_group" "web_sg_1a" {
#   name        = "web-security-group-1a"
#   description = "Allow HTTP and HTTPS traffic to web servers in public subnet 1a"
#   vpc_id      = aws_vpc.main.id
#
#   # Ingress Rules: Allow inbound HTTP/HTTPS traffic
#   ingress {
#     description      = "Allow HTTP traffic"
#     from_port        = 80  # HTTP port
#     to_port          = 80
#     protocol         = "tcp"
#     cidr_blocks      = ["0.0.0.0/0"]  # Allow traffic from the internet
#   }
#
#   ingress {
#     description      = "Allow HTTPS traffic"
#     from_port        = 443  # HTTPS port
#     to_port          = 443
#     protocol         = "tcp"
#     cidr_blocks      = ["0.0.0.0/0"]  # Allow traffic from the internet
#   }
#
#   # Egress Rules: Allow all outbound traffic
#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]  # Allow outbound traffic to any destination
#   }
#
#   tags = {
#     Name = "web-security-group-1a"
#   }
# }
#
# # Security Group for Web Servers in Public Subnet 1b
# resource "aws_security_group" "web_sg_1b" {
#   name        = "web-security-group-1b"
#   description = "Allow HTTP and HTTPS traffic to web servers in public subnet 1b"
#   vpc_id      = aws_vpc.main.id
#
#   # Ingress Rules: Allow inbound HTTP/HTTPS traffic
#   ingress {
#     description      = "Allow HTTP traffic"
#     from_port        = 80  # HTTP port
#     to_port          = 80
#     protocol         = "tcp"
#     cidr_blocks      = ["0.0.0.0/0"]  # Allow traffic from the internet
#   }
#
#   ingress {
#     description      = "Allow HTTPS traffic"
#     from_port        = 443  # HTTPS port
#     to_port          = 443
#     protocol         = "tcp"
#     cidr_blocks      = ["0.0.0.0/0"]  # Allow traffic from the internet
#   }
#
#   # Egress Rules: Allow all outbound traffic
#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]  # Allow outbound traffic to any destination
#   }
#
#   tags = {
#     Name = "web-security-group-1b"
#   }
# }
#
# # Security Group for App Servers in Private Subnet
# resource "aws_security_group" "app_sg" {
#   name        = "app-security-group"
#   description = "Allow traffic to app servers in the private subnet"
#   vpc_id      = aws_vpc.main.id
#
#   # Ingress Rules: Define what traffic can come into the app servers
#   ingress {
#     description      = "Allow HTTP traffic from web servers or load balancer"
#     from_port        = 80  # HTTP port
#     to_port          = 80
#     protocol         = "tcp"
#     cidr_blocks      = ["10.0.0.0/16"]  # Allow traffic from the VPC (private communication with web server or ALB)
#   }
#
#   ingress {
#     description      = "Allow HTTPS traffic from web servers or load balancer"
#     from_port        = 443  # HTTPS port
#     to_port          = 443
#     protocol         = "tcp"
#     cidr_blocks      = ["10.0.0.0/16"]  # Allow traffic from the VPC (private communication with web server or ALB)
#   }
#
#   # Egress Rules: Allow outbound traffic from app servers
#   egress {
#     from_port   = 5432  # PostgreSQL port (was previously 3306 for MySQL)
#     to_port     = 5432
#     protocol    = "tcp"
#     cidr_blocks = ["10.0.0.0/16"]  # Allow traffic to the RDS instances
#   }
#
#   tags = {
#     Name = "app-security-group"
#   }
# }
#
