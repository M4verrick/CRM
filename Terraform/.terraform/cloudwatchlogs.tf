variable "log_group_name" {
  description = "The name of the CloudWatch log group"
  type        = string
  default     = "crm-logs"
}

variable "retention_days" {
  description = "The number of days to retain the logs in the CloudWatch log group"
  type        = number
  default     = 7
}


resource "aws_cloudwatch_log_group" "log_group" {
  name              = var.log_group_name
  retention_in_days = var.retention_days
}

resource "aws_cloudwatch_log_stream" "log_stream" {
  name           = "crm-log-stream"
  log_group_name = aws_cloudwatch_log_group.log_group.name
}