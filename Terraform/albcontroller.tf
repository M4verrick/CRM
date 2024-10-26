# resource "helm_release" "alb_controller" {
#   name       = "aws-load-balancer-controller"
#   repository = "https://aws.github.io/eks-charts"
#   chart      = "aws-load-balancer-controller"
#   namespace  = "kube-system"
#   depends_on = [kubernetes_service_account.lb_controller_sa]
#
#   set {
#     name  = "region"
#     value = "ap-southeast-1"
#   }
#
#   set {
#     name  = "vpcId"
#     value = aws_vpc.main.id
#   }
#
#   set {
#     name  = "clusterName"
#     value = "my-eks-cluster"
#   }
#
#   set {
#     name  = "serviceAccount.create"
#     value = "false"
#   }
#
#   set {
#     name  = "serviceAccount.name"
#     value = "aws-load-balancer-controller"
#   }
# }
