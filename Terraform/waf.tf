
# WAF Web ACL for CloudFront
resource "aws_wafv2_web_acl" "my_waf_acl" {
  name  = "MyCloudFrontWAF"
  scope = "CLOUDFRONT"  # Scope for global protection with CloudFront

  default_action {
    allow {}
  }

  # Add the Common Rule Set
  rule {
    name     = "AWS-AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      sampled_requests_enabled    = true
      cloudwatch_metrics_enabled  = true
      metric_name                 = "awsCommonRuleSet"
    }
  }

  # Add the SQLi Rule Set (SQL Injection protection)
  rule {
    name     = "AWS-AWSManagedRulesSQLiRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      sampled_requests_enabled    = true
      cloudwatch_metrics_enabled  = true
      metric_name                 = "awsSQLiRuleSet"
    }
  }

  # Add the XSS Rule Set (Cross-Site Scripting protection)
  rule {
    name     = "AWS-AWSManagedRulesXSSRuleSet"
    priority = 3

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesXSSRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      sampled_requests_enabled    = true
      cloudwatch_metrics_enabled  = true
      metric_name                 = "awsXSSRuleSet"
    }
  }



  rule {
  name     = "AWS-AWSManagedRulesATPRuleSet"
  priority = 4
  statement {
    managed_rule_group_statement {
      name        = "AWSManagedRulesATPRuleSet"
      vendor_name = "AWS"
    }
  }
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "ATPProtection"
    sampled_requests_enabled   = true
  }
}

rule {
  name     = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
  priority = 5
  statement {
    managed_rule_group_statement {
      name        = "AWSManagedRulesKnownBadInputsRuleSet"
      vendor_name = "AWS"
    }
  }
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "BadInputsProtection"
    sampled_requests_enabled   = true
  }
}

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "cloudfront-waf"
    sampled_requests_enabled   = true
  }

}


