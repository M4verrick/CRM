provider "aws" {
  region = local.region
}
data "aws_caller_identity" "current" {}
data "aws_availability_zones" "available" {}
data "aws_eks_cluster_auth" "example" {
  name = module.eks.cluster_name
}


provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    token                  = data.aws_eks_cluster_auth.example.token

    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      # This requires the awscli to be installed locally where Terraform is executed
      args = ["eks", "get-token", "--cluster-name", module.eks.cluster_name, "--region", local.region]
    }
  }
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)

  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    # This requires the awscli to be installed locally where Terraform is executed
    args = ["eks", "get-token", "--cluster-name", module.eks.cluster_name, "--region", local.region]
  }
}

locals {
  name   = "itsag3t1-crm"
  region = var.region

  cluster_version = var.kubernetes_version

  vpc_cidr = var.vpc_cidr
  azs      = slice(data.aws_availability_zones.available.names, 0, 3)

  enable_ingress          = true
  is_route53_private_zone = false
  # change to a valid domain name you created a route53 zone
  # aws route53 create-hosted-zone --name example.com --caller-reference "$(date)"
  domain_name      = var.domain_name
  route53_zone_arn = try(data.aws_route53_zone.this[0].arn, "")

  git_private_ssh_key = var.ssh_key_path # Update with the git ssh key to be used by ArgoCD

  gitops_addons_org      = var.gitops_addons_org
  gitops_addons_url      = "${var.gitops_addons_org}/${var.gitops_addons_repo}"
  gitops_addons_basepath = var.gitops_addons_basepath
  gitops_addons_path     = var.gitops_addons_path
  gitops_addons_revision = var.gitops_addons_revision

  gitops_workload_org      = var.gitops_workload_org
  gitops_workload_repo     = var.gitops_workload_repo
  gitops_workload_basepath = var.gitops_workload_basepath
  gitops_workload_path     = var.gitops_workload_path
  gitops_workload_revision = var.gitops_workload_revision
  gitops_workload_url      = "${local.gitops_workload_org}/${local.gitops_workload_repo}"

  aws_addons = {
    enable_cert_manager                          = try(var.addons.enable_cert_manager, false)
    enable_aws_efs_csi_driver                    = try(var.addons.enable_aws_efs_csi_driver, false)
    enable_aws_fsx_csi_driver                    = try(var.addons.enable_aws_fsx_csi_driver, false)
    enable_aws_cloudwatch_metrics                = try(var.addons.enable_aws_cloudwatch_metrics, false)
    enable_aws_privateca_issuer                  = try(var.addons.enable_aws_privateca_issuer, false)
    enable_cluster_autoscaler                    = try(var.addons.enable_cluster_autoscaler, false)
    enable_external_dns                          = try(var.addons.enable_external_dns, false)
    enable_external_secrets                      = try(var.addons.enable_external_secrets, false)
    enable_aws_load_balancer_controller          = try(var.addons.enable_aws_load_balancer_controller, false)
    enable_fargate_fluentbit                     = try(var.addons.enable_fargate_fluentbit, false)
    enable_aws_for_fluentbit                     = try(var.addons.enable_aws_for_fluentbit, false)
    enable_aws_node_termination_handler          = try(var.addons.enable_aws_node_termination_handler, false)
    enable_karpenter                             = try(var.addons.enable_karpenter, false)
    enable_velero                                = try(var.addons.enable_velero, false)
    enable_aws_gateway_api_controller            = try(var.addons.enable_aws_gateway_api_controller, false)
    enable_aws_ebs_csi_resources                 = try(var.addons.enable_aws_ebs_csi_resources, false)
    enable_aws_secrets_store_csi_driver_provider = try(var.addons.enable_aws_secrets_store_csi_driver_provider, false)
    enable_ack_apigatewayv2                      = try(var.addons.enable_ack_apigatewayv2, false)
    enable_ack_dynamodb                          = try(var.addons.enable_ack_dynamodb, false)
    enable_ack_s3                                = try(var.addons.enable_ack_s3, false)
    enable_ack_rds                               = try(var.addons.enable_ack_rds, false)
    enable_ack_prometheusservice                 = try(var.addons.enable_ack_prometheusservice, false)
    enable_ack_emrcontainers                     = try(var.addons.enable_ack_emrcontainers, false)
    enable_ack_sfn                               = try(var.addons.enable_ack_sfn, false)
    enable_ack_eventbridge                       = try(var.addons.enable_ack_eventbridge, false)
  }
  oss_addons = {
    enable_argocd                          = try(var.addons.enable_argocd, true)
    enable_argo_rollouts                   = try(var.addons.enable_argo_rollouts, false)
    enable_argo_events                     = try(var.addons.enable_argo_events, false)
    enable_argo_workflows                  = try(var.addons.enable_argo_workflows, false)
    enable_cluster_proportional_autoscaler = try(var.addons.enable_cluster_proportional_autoscaler, false)
    enable_gatekeeper                      = try(var.addons.enable_gatekeeper, false)
    enable_gpu_operator                    = try(var.addons.enable_gpu_operator, false)
    enable_ingress_nginx                   = try(var.addons.enable_ingress_nginx, false)
    enable_keda                            = try(var.addons.enable_keda, false)
    enable_kyverno                         = try(var.addons.enable_kyverno, false)
    enable_kube_prometheus_stack           = try(var.addons.enable_kube_prometheus_stack, false)
    enable_metrics_server                  = try(var.addons.enable_metrics_server, false)
    enable_prometheus_adapter              = try(var.addons.enable_prometheus_adapter, false)
    enable_secrets_store_csi_driver        = try(var.addons.enable_secrets_store_csi_driver, false)
    enable_vpa                             = try(var.addons.enable_vpa, false)
  }
  addons = merge(
    local.aws_addons,
    local.oss_addons,
    { kubernetes_version = local.cluster_version },
    { aws_cluster_name = module.eks.cluster_name }
  )

  addons_metadata = merge(
    module.eks_blueprints_addons.gitops_metadata,
    {
      aws_cluster_name = module.eks.cluster_name
      aws_region       = local.region
      aws_account_id   = data.aws_caller_identity.current.account_id
      aws_vpc_id       = module.vpc.vpc_id
    },
    {
      external_dns_domain_filters = "[${local.domain_name}]"
    },
    {
      addons_repo_url      = local.gitops_addons_url
      addons_repo_basepath = local.gitops_addons_basepath
      addons_repo_path     = local.gitops_addons_path
      addons_repo_revision = local.gitops_addons_revision
    },
    {
      workload_repo_url      = local.gitops_workload_url
      workload_repo_basepath = local.gitops_workload_basepath
      workload_repo_path     = local.gitops_workload_path
      workload_repo_revision = local.gitops_workload_revision
    }
  )

  argocd_apps = {
    addons    = file("${path.module}/bootstrap/addons.yaml")
    workloads = file("${path.module}/bootstrap/workloads.yaml")
  }

  tags = {
    Blueprint  = local.name
    GithubRepo = "github.com/gitops-bridge-dev/gitops-bridge"
  }

  network_acls = {
    public_inbound = [
      {
        rule_number = 110
        rule_action = "allow"
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        cidr_block  = "0.0.0.0/0"
      },
      {
        rule_number = 120
        rule_action = "allow"
        from_port   = 22,
        to_port     = 22,
        protocol    = "tcp"
        cidr_block  = "0.0.0.0/0"
      },
      {
        rule_number = 900
        rule_action = "allow"
        from_port   = 1024
        to_port     = 65535
        protocol    = "tcp"
        cidr_block  = "0.0.0.0/0"
      }
    ]
    public_outbound = [
      {
        rule_number = 100
        rule_action = "allow"
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_block  = "0.0.0.0/0"
      },
      {
        rule_number = 110
        rule_action = "allow"
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        cidr_block  = "0.0.0.0/0"
      },
      {
        rule_number = 120
        rule_action = "allow"
        from_port   = 22,
        to_port     = 22,
        protocol    = "tcp"
        cidr_block  = "0.0.0.0/0"
      },
      {
        rule_number = 900
        rule_action = "allow"
        from_port   = 1024
        to_port     = 65535
        protocol    = "tcp"
        cidr_block  = "0.0.0.0/0"
      }
    ]
    private_inbound = [
      {
        rule_number = 100
        rule_action = "allow"
        from_port   = 0
        to_port     = 65535
        protocol    = "tcp"
        cidr_block  = "10.0.0.0/16"
      },
      {
        rule_number = 110
        rule_action = "allow"
        from_port   = 0
        to_port     = 65535
        protocol    = "udp"
        cidr_block  = "10.0.0.0/16"
      },
      {
        rule_number = 200
        rule_action = "allow"
        from_port   = 1024,
        to_port     = 65535,
        protocol    = "tcp"
        cidr_block  = "0.0.0.0/0"
      },
    ]
    private_outbound = [
      {
        rule_number = 100
        rule_action = "allow"
        from_port   = 0
        to_port     = 65535
        protocol    = "tcp"
        cidr_block  = "10.0.0.0/16"
      },
      {
        rule_number = 110
        rule_action = "allow"
        from_port   = 0
        to_port     = 65535
        protocol    = "udp"
        cidr_block  = "10.0.0.0/16"
      },
      {
        rule_number = 120
        rule_action = "allow"
        from_port   = 22,
        to_port     = 22,
        protocol    = "tcp"
        cidr_block  = "0.0.0.0/0"
      },
      {
        rule_number = 200
        rule_action = "allow"
        from_port   = 1024
        to_port     = 65535
        protocol    = "tcp"
        cidr_block  = "0.0.0.0/0"
      },
      {
        rule_number = 300
        rule_action = "allow"
        from_port   = 80,
        to_port     = 80,
        protocol    = "tcp"
        cidr_block  = "0.0.0.0/0"
      },
      {
        rule_number = 400
        rule_action = "allow"
        from_port   = 443,
        to_port     = 443,
        protocol    = "tcp"
        cidr_block  = "0.0.0.0/0"
      }
    ]
    database_inbound = [
      {
        rule_number = 100
        rule_action = "allow"
        from_port   = 5432
        to_port     = 5432
        protocol    = "tcp"
        cidr_block  = "10.0.0.0/16"
      }
    ]
    database_outbound = [
      {
        rule_number = 100
        rule_action = "allow"
        from_port   = 1024
        to_port     = 65535
        protocol    = "tcp"
        cidr_block  = "10.0.0.0/16"
      }
    ]
  }
}

################################################################################
# GitOps Bridge: Private ssh keys for git
################################################################################
resource "kubernetes_namespace" "argocd" {
  depends_on = [module.eks_blueprints_addons, module.aws-auth]
  metadata {
    name = "argocd"
  }
}
resource "kubernetes_secret" "git_secrets" {
  depends_on = [kubernetes_namespace.argocd]
  for_each = {
    git-addons = {
      type          = "git"
      url           = local.gitops_addons_org
      sshPrivateKey = file(pathexpand(local.git_private_ssh_key))
    }
    git-workloads = {
      type          = "git"
      url           = local.gitops_workload_org
      sshPrivateKey = file(pathexpand(local.git_private_ssh_key))
    }
  }
  metadata {
    name      = each.key
    namespace = kubernetes_namespace.argocd.metadata[0].name
    labels = {
      "argocd.argoproj.io/secret-type" = "repo-creds"
    }
  }
  data = each.value
}

################################################################################
# GitOps Bridge: Bootstrap
################################################################################
module "gitops_bridge_bootstrap" {
  source = "gitops-bridge-dev/gitops-bridge/helm"

  cluster = {
    cluster_name = module.eks.cluster_name
    metadata     = local.addons_metadata
    addons       = local.addons
  }
  apps       = local.argocd_apps
  argocd     = { create_namespace = false }
  depends_on = [kubernetes_namespace.argocd, kubernetes_secret.git_secrets]
}


################################################################################
# EKS Blueprints Addons
################################################################################
module "eks_blueprints_addons" {
  source  = "aws-ia/eks-blueprints-addons/aws"
  version = "~> 1.8"

  cluster_name      = module.eks.cluster_name
  cluster_endpoint  = module.eks.cluster_endpoint
  cluster_version   = module.eks.cluster_version
  oidc_provider_arn = module.eks.oidc_provider_arn

  # Using GitOps Bridge
  create_kubernetes_resources = false

  # EKS Blueprints Addons
  enable_cert_manager                 = local.aws_addons.enable_cert_manager
  enable_aws_efs_csi_driver           = local.aws_addons.enable_aws_efs_csi_driver
  enable_aws_fsx_csi_driver           = local.aws_addons.enable_aws_fsx_csi_driver
  enable_aws_cloudwatch_metrics       = local.aws_addons.enable_aws_cloudwatch_metrics
  enable_aws_privateca_issuer         = local.aws_addons.enable_aws_privateca_issuer
  enable_cluster_autoscaler           = local.aws_addons.enable_cluster_autoscaler
  enable_external_dns                 = local.aws_addons.enable_external_dns
  enable_external_secrets             = local.aws_addons.enable_external_secrets
  enable_aws_load_balancer_controller = local.aws_addons.enable_aws_load_balancer_controller
  enable_fargate_fluentbit            = local.aws_addons.enable_fargate_fluentbit
  enable_aws_for_fluentbit            = local.aws_addons.enable_aws_for_fluentbit
  enable_aws_node_termination_handler = local.aws_addons.enable_aws_node_termination_handler
  enable_karpenter                    = local.aws_addons.enable_karpenter
  enable_velero                       = local.aws_addons.enable_velero
  enable_aws_gateway_api_controller   = local.aws_addons.enable_aws_gateway_api_controller
  enable_ingress_nginx                = local.oss_addons.enable_ingress_nginx

  ingress_nginx = {
    values        = [templatefile("${path.module}/values.yaml", {})]
  }

  external_dns_route53_zone_arns = [local.route53_zone_arn] # ArgoCD Server and UI domain name is registered in Route 53

  karpenter_node = {
    iam_role_use_name_prefix = false
  }

  tags = local.tags
}

module "iam_assumable_role_keda" {
  source      = "terraform-aws-modules/iam/aws//modules/iam-assumable-role-with-oidc"
  create_role = true
  role_name   = "keda-role-${local.name}"
  tags = {
    Role = "keda-role-${local.name}"
  }
  provider_url  = replace(module.eks.oidc_provider, "https://", "")
  # provider_url = data.aws_eks_cluster.this.identity[0].oidc[0].issuer
  role_policy_arns = [
    "arn:aws:iam::aws:policy/CloudWatchReadOnlyAccess",
  ]
  oidc_fully_qualified_subjects = [
    "system:serviceaccount:keda:keda-operator",
  ]
}


################################################################################
# EKS Cluster
################################################################################
#tfsec:ignore:aws-eks-enable-control-plane-logging
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.29"

  cluster_name                   = local.name
  cluster_version                = local.cluster_version
  cluster_endpoint_public_access = true


  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  authentication_mode                      = "API_AND_CONFIG_MAP"
  enable_cluster_creator_admin_permissions = true


  eks_managed_node_groups = {
    new = {
      instance_types = ["t3.small"]

      min_size     = 2
      max_size     = 3
      desired_size = 2
    }
  }

  # EKS Addons
  cluster_addons = {
    vpc-cni = {
      # Specify the VPC CNI addon should be deployed before compute to ensure
      # the addon is configured before data plane compute resources are created
      # See README for further details
      before_compute = true
      most_recent    = true # To ensure access to the latest settings provided
      configuration_values = jsonencode({
        env = {
          # Reference docs https://docs.aws.amazon.com/eks/latest/userguide/cni-increase-ip-addresses.html
          ENABLE_PREFIX_DELEGATION = "true"
          WARM_PREFIX_TARGET       = "1"
        }
      })
    }
    eks-pod-identity-agent = {}
    kube-proxy = { most_recent = true }
    # coredns = { most_recent = true }
  }

  tags = merge(local.tags, {
    # NOTE - if creating multiple security groups with this module, only tag the
    # security group that Karpenter should utilize with the following tag
    # (i.e. - at most, only one security group should have this tag in your account)
    "karpenter.sh/discovery" = local.name
  })

}

module "aws-auth" {
  source  = "terraform-aws-modules/eks/aws//modules/aws-auth"
  version = "~> 20.0"

  manage_aws_auth_configmap = true

  aws_auth_roles = [
    {
      rolearn  = module.eks_blueprints_addons.karpenter.node_iam_role_arn
      username = "system:node:{{EC2PrivateDNSName}}"
      groups   = ["system:bootstrappers", "system:nodes"]
    },
  ]

  depends_on = [module.eks, module.eks_blueprints_addons]
}

################################################################################
# Supporting Resources
################################################################################
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = local.name
  cidr = local.vpc_cidr

  azs             = local.azs
  private_subnets = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 8, k)]
  public_subnets  = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 8, k + 4)]
  database_subnets = [for k, v in local.azs : cidrsubnet(local.vpc_cidr,8, k + 8)]

  public_dedicated_network_acl   = true
  public_inbound_acl_rules       = local.network_acls["public_inbound"]
  public_outbound_acl_rules      = local.network_acls["public_outbound"]
  database_inbound_acl_rules     = local.network_acls["database_inbound"]
  database_outbound_acl_rules    = local.network_acls["database_outbound"]
  private_inbound_acl_rules      = local.network_acls["private_inbound"]
  private_outbound_acl_rules     = local.network_acls["private_outbound"]

  private_dedicated_network_acl     = true
  database_dedicated_network_acl = true

  manage_default_network_acl = true

  enable_nat_gateway = true
  single_nat_gateway = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
    # Tags subnets for Karpenter auto-discovery
    "karpenter.sh/discovery" = local.name
  }

  # VPC Flow Logs (Cloudwatch log group and IAM role will be created)
  vpc_flow_log_iam_role_name            = "vpc-complete-example-role"
  vpc_flow_log_iam_role_use_name_prefix = false
  enable_flow_log                       = true
  create_flow_log_cloudwatch_log_group  = true
  create_flow_log_cloudwatch_iam_role   = true
  flow_log_max_aggregation_interval     = 60

  tags = local.tags
}

module "vpc_endpoints" {
  source  = "terraform-aws-modules/vpc/aws//modules/vpc-endpoints"
  version = "~> 5.1"

  vpc_id = module.vpc.vpc_id

  # Security group
  create_security_group      = true
  security_group_name_prefix = "${local.name}-vpc-endpoints-"
  security_group_description = "VPC endpoint security group"
  security_group_rules = {
    ingress_https = {
      description = "HTTPS from VPC"
      cidr_blocks = [module.vpc.vpc_cidr_block]
    }
  }

  endpoints = merge({
    s3 = {
      service         = "s3"
      service_type    = "Gateway"
      route_table_ids = module.vpc.private_route_table_ids
      tags = {
        Name = "${local.name}-s3"
      }
    }
  },
    { for service in toset(["autoscaling", "ecr.api", "ecr.dkr", "ec2", "ec2messages", "elasticloadbalancing", "sts", "kms", "logs", "ssm", "ssmmessages"]) :
      replace(service, ".", "_") =>
      {
        service             = service
        subnet_ids          = module.vpc.private_subnets
        private_dns_enabled = true
        tags                = { Name = "${local.name}-${service}" }
      }
    })

  tags = local.tags
}

################################################################################
# Route 53
################################################################################
# To get the hosted zone to be use in argocd domain
data "aws_route53_zone" "this" {
  count        = local.enable_ingress ? 1 : 0
  name         = local.domain_name
  private_zone = local.is_route53_private_zone
}


################################################################################
# ACM Certificate
################################################################################

resource "aws_acm_certificate" "cert" {
  count             = local.enable_ingress ? 1 : 0
  domain_name       = "*.${local.domain_name}"
  validation_method = "DNS"
}

resource "aws_route53_record" "validation" {
  count           = local.enable_ingress ? 1 : 0
  zone_id         = data.aws_route53_zone.this[0].zone_id
  name            = tolist(aws_acm_certificate.cert[0].domain_validation_options)[0].resource_record_name
  type            = tolist(aws_acm_certificate.cert[0].domain_validation_options)[0].resource_record_type
  records         = [tolist(aws_acm_certificate.cert[0].domain_validation_options)[0].resource_record_value]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "this" {
  count                   = local.enable_ingress ? 1 : 0
  certificate_arn         = aws_acm_certificate.cert[0].arn
  validation_record_fqdns = [for record in aws_route53_record.validation : record.fqdn]
}

