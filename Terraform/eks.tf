module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "crm-eks-cluster"
  cluster_version = "1.29"

  vpc_id     = aws_vpc.main.id
  subnet_ids = [aws_subnet.private_1a.id, aws_subnet.private_1b.id]

  cluster_endpoint_private_access = true
  enable_irsa = true

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

module "eks_blueprints_addons" {
  source = "aws-ia/eks-blueprints-addons/aws"
  version = "~> 1.0" #ensure to update this to the latest/desired version

  cluster_name      = module.eks.cluster_name
  cluster_endpoint  = module.eks.cluster_endpoint
  cluster_version   = module.eks.cluster_version
  oidc_provider_arn = module.eks.oidc_provider_arn

  eks_addons = {
    aws-ebs-csi-driver = {
      most_recent = true
    }
    coredns = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
  }

  enable_aws_load_balancer_controller    = true
  enable_cluster_proportional_autoscaler = true
  enable_karpenter                       = true
  enable_kube_prometheus_stack           = true
  enable_metrics_server                  = true
  enable_external_dns                    = true
  enable_cert_manager                    = true
  cert_manager_route53_hosted_zone_arns  = [aws_route53_zone.main.arn]

  tags = {
    Environment = "dev"
  }
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)

  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
    command     = "aws"
  }
}
