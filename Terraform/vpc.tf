
# Create VPC with a /16 CIDR block
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "main-vpc"
  }
}

# Create Public Subnets - Divided from the VPC's /16 range
resource "aws_subnet" "public_1a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"   # Public Subnet 1
  availability_zone       = "ap-southeast-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "public-subnet-1a"
  }
}

resource "aws_subnet" "public_1b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"   # Public Subnet 2
  availability_zone       = "ap-southeast-1b"
  map_public_ip_on_launch = true
  tags = {
    Name = "public-subnet-1b"
  }
}

# Create Private Subnets - Divided from the VPC's /16 range
resource "aws_subnet" "private_1a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"   # Private Subnet 1
  availability_zone = "ap-southeast-1a"
  tags = {
    Name = "private-subnet-1a"
  }
}

resource "aws_subnet" "private_1b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.4.0/24"   # Private Subnet 2
  availability_zone = "ap-southeast-1b"
  tags = {
    Name = "private-subnet-1b"
  }
}

# Create Internet Gateway for public subnets
resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "main-igw"
  }
}

# Create NAT Gateways in both AZs (one in each public subnet)
resource "aws_eip" "nat_eip_1a" {
  domain = "vpc"
}

resource "aws_nat_gateway" "nat_gw_1a" {
  allocation_id = aws_eip.nat_eip_1a.id
  subnet_id     = aws_subnet.public_1a.id
  tags = {
    Name = "nat-gateway-1a"
  }
}

resource "aws_eip" "nat_eip_1b" {
  domain = "vpc" 
}

resource "aws_nat_gateway" "nat_gw_1b" {
  allocation_id = aws_eip.nat_eip_1b.id
  subnet_id     = aws_subnet.public_1b.id
  tags = {
    Name = "nat-gateway-1b"
  }
}

# Public Route Table for Public Subnets (Uses Internet Gateway)
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  # Route all traffic to the Internet Gateway
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main_igw.id
  }

  tags = {
    Name = "public-route-table"
  }
}

# Associate Public Route Table with both public subnets
resource "aws_route_table_association" "public_1a" {
  subnet_id      = aws_subnet.public_1a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_1b" {
  subnet_id      = aws_subnet.public_1b.id
  route_table_id = aws_route_table.public.id
}

# Private Route Table for Private Subnet in AZ 1a (Uses NAT Gateway 1a)
resource "aws_route_table" "private_1a" {
  vpc_id = aws_vpc.main.id

  # Route all traffic through the NAT Gateway in AZ 1a
  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw_1a.id
  }

  tags = {
    Name = "private-route-table-1a"
  }
}

# Associate Private Route Table with Private Subnet 1a
resource "aws_route_table_association" "private_1a_association" {
  subnet_id      = aws_subnet.private_1a.id
  route_table_id = aws_route_table.private_1a.id
}

# Private Route Table for Private Subnet in AZ 1b (Uses NAT Gateway 1b)
resource "aws_route_table" "private_1b" {
  vpc_id = aws_vpc.main.id

  # Route all traffic through the NAT Gateway in AZ 1b
  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw_1b.id
  }

  tags = {
    Name = "private-route-table-1b"
  }
}

# Associate Private Route Table with Private Subnet 1b
resource "aws_route_table_association" "private_1b_association" {
  subnet_id      = aws_subnet.private_1b.id
  route_table_id = aws_route_table.private_1b.id
}