
# Subnet Group for RDS (using private subnets)
resource "aws_db_subnet_group" "main" {
  name       = "rds-subnet-group"
  subnet_ids = [aws_subnet.private_1a.id, aws_subnet.private_1b.id]  # Private subnets for the RDS instances

  tags = {
    Name = "rds-subnet-group"
  }
}

# Primary RDS Instance (with Multi-AZ for automatic failover)
resource "aws_db_instance" "primary_rds" {
  identifier         = "my-primary-db"
  allocated_storage  = 50
  storage_type       = "gp2"
  engine             = "postgres"
  engine_version     = "13"
  instance_class     = "db.t3.micro"
  username           = "admin"
  password           = "yourpassword"  # Use secrets management in production
  db_subnet_group_name = aws_db_subnet_group.main.name
  multi_az           = true  # Enable Multi-AZ for high availability
  publicly_accessible = false
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  availability_zone  = "ap-southeast-1a"

  tags = {
    Name = "Primary-RDS"
  }
}

# Read Replica for read scaling (asynchronously replicates data from primary)
resource "aws_db_instance" "read_replica_rds" {
  identifier          = "my-read-replica"
  allocated_storage   = 50
  storage_type        = "gp2"
  engine              = "postgres"
  instance_class      = "db.t3.micro"
  username            = "admin"
  password            = "yourpassword"
  db_subnet_group_name = aws_db_subnet_group.main.name
  publicly_accessible = false
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  availability_zone   = "ap-southeast-1b"  # Different AZ for high availability
  replicate_source_db = aws_db_instance.primary_rds.id  # Replicate from primary

  tags = {
    Name = "Read-Replica-RDS"
  }
}
