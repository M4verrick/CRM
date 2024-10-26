#!/bin/bash

# Set AWS CLI endpoint for LocalStack
REGION="ap-southeast-1"  # Specify your desired region

# Log group and stream names
LOG_GROUP_NAME="crm-logs"
LOG_STREAM_NAME="crm-log-stream"

# Create log group
awslocal --region $REGION logs create-log-group --log-group-name $LOG_GROUP_NAME

# Create log stream
awslocal --region $REGION logs create-log-stream --log-group-name $LOG_GROUP_NAME --log-stream-name $LOG_STREAM_NAME

# Describe log group
awslocal --region $REGION logs describe-log-groups --log-group-name-prefix $LOG_GROUP_NAME

# Describe log stream
awslocal --region $REGION logs describe-log-streams --log-group-name $LOG_GROUP_NAME --log-stream-name-prefix $LOG_STREAM_NAME

awslocal --region $REGION logs get-log-events --log-group-name $LOG_GROUP_NAME --log-stream-name $LOG_STREAM_NAME

echo "Log group and log stream created successfully."