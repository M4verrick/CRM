# # CloudFront Distribution
# resource "aws_cloudfront_distribution" "my_distribution" {
#   origin {
#     domain_name = aws_lb.my_load_balancer.dns_name  # ALB DNS name
#     origin_id   = "my-origin-id"
#
#     custom_origin_config {
#       http_port              = 80
#       https_port             = 443
#       origin_protocol_policy = "https-only"  # Enforce HTTPS between CloudFront and ALB
#     }
#   }
#
#   # Default cache behavior settings
#   default_cache_behavior {
#     target_origin_id       = "my-origin-id"
#     viewer_protocol_policy = "redirect-to-https"  # Redirect HTTP to HTTPS for security
#
#     allowed_methods = ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"]
#     cached_methods  = ["GET", "HEAD", "OPTIONS"]  # Only cache safe methods
#
#
#     query_string    = true  # Forward query strings (useful for API queries)
#
#
#     forwarded_values = {
#       query_string = true
#       headers      = ["Authorization", "Content-Type"]  # Forward required headers
#       cookies = {
#         forward = "all"  # Forward cookies if needed for authentication
#       }
#     }
#
#     compress = true  # Enable compression for better performance
#
#     # Time-to-live (TTL) values for caching
#     default_ttl = 3600    # Cache content for 1 hour by default
#     max_ttl     = 86400   # Maximum cache time is 1 day
#     min_ttl     = 0       # Minimum cache time (no caching if not specified)
#   }
#
#   # WAF Web ACL integration for security
#   web_acl_id = aws_wafv2_web_acl.my_waf_acl.id  # Associate the WAF Web ACL with CloudFront
#
#   # Enable IPv6 for future-proofing
#   is_ipv6_enabled = true
#
#   # Viewer certificate settings for HTTPS
#   viewer_certificate {
#     cloudfront_default_certificate = true  # Use default CloudFront certificate for HTTPS
#
#   }
#
#   # Enable HTTP/2 for performance optimization
#   http_version = "http2"
#
#   # Tags for identifying the distribution
#   tags = {
#     Name = "my-cloudfront-distribution"
#   }
# }
