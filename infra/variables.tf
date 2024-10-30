variable "domain_name" {
  description = "Route 53 domain name"
  type        = string
  default = "itsag3t1.com"
}

variable "ssh_key_path" {
  description = "SSH key path for git access"
  type        = string
  default     = "~/.ssh/id_rsa"
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
  default     = "10.0.0.0/16"
}
variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}
variable "kubernetes_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.29"
}
variable "addons" {
  description = "Kubernetes addons"
  type        = any
  default = {
    enable_aws_load_balancer_controller = true
    enable_aws_ebs_csi_resources        = true # generate gp2 and gp3 storage classes for ebs-csi
    enable_karpenter                    = true
    enable_keda                         = true
    enable_cert_manager                 = true
    enable_aws_cloudwatch_metrics       = true
    enable_fargate_fluentbit            = true
    enable_aws_for_fluentbit            = true
    enable_aws_gateway_api_controller   = true
    enable_external_dns                 = true
    enable_external_secrets             = true
  }
}

# Addons Git
variable "gitops_addons_org" {
  description = "Git repository org/user contains for addons"
  type        = string
  default     = "git@github.com:cs301-itsa"
}
variable "gitops_addons_repo" {
  description = "Git repository contains for addons"
  type        = string
  default     = "gitops-bridge-argocd-control-plane-template"
}
variable "gitops_addons_revision" {
  description = "Git repository revision/branch/ref for addons"
  type        = string
  default     = "main"
}
variable "gitops_addons_basepath" {
  description = "Git repository base path for addons"
  type        = string
  default     = ""
}
variable "gitops_addons_path" {
  description = "Git repository path for addons"
  type        = string
  default     = "bootstrap/control-plane/addons"
}

# Workloads Git
variable "gitops_workload_org" {
  description = "Git repository org/user contains for workload"
  type        = string
  default     = "git@github.com:cs301-itsa"
}
variable "gitops_workload_repo" {
  description = "Git repository contains for workload"
  type        = string
  default     = "project-2024-25t1-g3-t1"
}
variable "gitops_workload_revision" {
  description = "Git repository revision/branch/ref for workload"
  type        = string
  default     = "main"
}
variable "gitops_workload_basepath" {
  description = "Git repository base path for workload"
  type        = string
  default     = "infra/"
}
variable "gitops_workload_path" {
  description = "Git repository path for workload"
  type        = string
  default     = "karpenter/k8s"
}

# CRM Frontend Git
variable "gitops_crm_frontend_org" {
  description = "Git repository org/user contains for CRM Frontend"
  type        = string
  default     = "git@github.com:cs301-itsa"
}

variable "gitops_crm_frontend_repo" {
  description = "Git repository contains for CRM Frontend"
  type        = string
  default     = "project-2024-25t1-g3-t1"
}

variable "gitops_crm_frontend_revision" {
  description = "Git repository revision/branch/ref for CRM Frontend"
  type        = string
  default     = "main"
}

variable "gitops_crm_frontend_basepath" {
  description = "Git repository base path for CRM Frontend"
  type        = string
  default     = "deployment/"
}

variable "gitops_crm_frontend_path" {
  description = "Git repository path for CRM Frontend"
  type        = string
  default     = "crm-frontend/k8s"
}

# CRM Backend Git
variable "gitops_crm_backend_org" {
  description = "Git repository org/user contains for CRM Backend"
  type        = string
  default     = "git@github.com:cs301-itsa"
}

variable "gitops_crm_backend_repo" {
  description = "Git repository contains for CRM Backend"
  type        = string
  default     = "project-2024-25t1-g3-t1"
}

variable "gitops_crm_backend_revision" {
  description = "Git repository revision/branch/ref for CRM Backend"
  type        = string
  default     = "main"
}

variable "gitops_crm_backend_basepath" {
  description = "Git repository base path for CRM Backend"
  type        = string
  default     = "deployment/"
}

variable "gitops_crm_backend_path" {
  description = "Git repository path for CRM Backend"
  type        = string
  default     = "crm-backend/k8s"
}
