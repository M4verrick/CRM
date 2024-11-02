
# Subnet Group for RDS (using private subnets)
resource "aws_db_subnet_group" "main" {
  name       = "rds-subnet-group"
  subnet_ids = tolist(module.vpc.database_subnets) # Private subnets for the RDS instances

  tags = {
    Name = "rds-subnet-group"
  }
}

data "aws_secretsmanager_secret" "password" {
  name = "crm_db_password"
  depends_on = [aws_secretsmanager_secret.password]
}

data "aws_secretsmanager_secret_version" "password" {
  secret_id = data.aws_secretsmanager_secret.password.id
    depends_on = [aws_secretsmanager_secret_version.password]
}

# Primary RDS Instance (with Multi-AZ for automatic failover)
resource "aws_db_instance" "primary_rds" {
  identifier         = "my-primary-db"
  allocated_storage  = 50
  storage_type       = "gp2"
  engine             = "postgres"
  engine_version     = "16"
  instance_class     = "db.t3.micro"
  storage_encrypted  = true
  username           = "crmdbadmin"
  password           = data.aws_secretsmanager_secret_version.password.secret_string # Use secrets management in production
  db_name = "crmdb"
  db_subnet_group_name = aws_db_subnet_group.main.name
  multi_az           = true  # Enable Multi-AZ for high availability
  publicly_accessible = false
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  backup_retention_period = 7  # Enable automated backups with a retention period of 7 days
  final_snapshot_identifier = "my-primary-db-final-snapshot"
  tags = {
    Name = "Primary-RDS"
  }
}

# Read Replica for read scaling (asynchronously replicates data from primary)
resource "aws_db_instance" "read_replica_rds" {
  identifier          = "my-read-replica"
  storage_type        = "gp2"
  instance_class      = "db.t3.micro"
  storage_encrypted  = true
  publicly_accessible = false
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  backup_retention_period     = 7
  skip_final_snapshot         = true
  replicate_source_db = aws_db_instance.primary_rds.identifier # Replicate from primary
  depends_on = [aws_db_instance.primary_rds]  # Ensure primary instance is created first

  tags = {
    Name = "Read-Replica-RDS"
  }
}
