module "lb_role" {
  source = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"

  # Hardcoded name for the IAM role
  role_name = "eks_lb_controller_role"  

  # Attach load balancer controller policy
  attach_load_balancer_controller_policy = true

  # Specify the OIDC provider and service account configuration - need to setup
  oidc_providers = {
    main = {
      provider_arn               = "arn:aws:iam::<your-account-id>:oidc-provider/oidc.eks.<region>.amazonaws.com/id/<eks-cluster-id>"
      namespace_service_accounts = ["kube-system:aws-load-balancer-controller"]
    }
  }
}
