module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "my-eks-cluster"
  cluster_version = "1.27"

  vpc_id     = aws_vpc.main.id
  subnet_ids = [aws_subnet.private_1a.id, aws_subnet.private_1b.id]

  eks_managed_node_groups = {
    default = {
      desired_capacity = 2
      min_capacity     = 2
      max_capacity     = 6
      capacity_type  = "ON_DEMAND"
      instance_type    = "t3.micro"
    }
  }
   # Cluster Add-ons for CoreDNS, kube-proxy, and VPC-CNI
  cluster_addons = {
    coredns = { most_recent = true }
    kube-proxy = { most_recent = true }
    vpc-cni = { most_recent = true }
  }

  tags = {
    Name = "my-eks-cluster"
    Environment = "dev"
  }
}
