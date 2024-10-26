# Route 53 Hosted Zone for your domain
resource "aws_route53_zone" "main" {
  name = "itsag3t1.com"
}

# Route 53 Alias Record pointing to CloudFront
# resource "aws_route53_record" "alias" {
#   zone_id = aws_route53_zone.main.zone_id  # Hosted Zone ID for itsag3t1.com
#   name    = "itsag3t1.com"  # Root domain
#
#   type    = "A"
#   alias {
#     name                   = aws_cloudfront_distribution.my_distribution.domain_name  # CloudFront domain name
#     zone_id                = aws_cloudfront_distribution.my_distribution.hosted_zone_id
#     evaluate_target_health = false
#   }
# }