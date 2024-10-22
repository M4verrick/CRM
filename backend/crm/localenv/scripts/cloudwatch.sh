#!/bin/bash

# Set AWS CLI endpoint for LocalStack
ENDPOINT_URL="http://localhost:4566"
REGION="ap-southeast-1"  # Specify your desired region

# Log group and stream names
LOG_GROUP_NAME="crm-logs"
LOG_STREAM_NAME="crm-log-stream"

# Create log group
aws --endpoint-url=$ENDPOINT_URL --region $REGION logs create-log-group --log-group-name $LOG_GROUP_NAME

# Create log stream
aws --endpoint-url=$ENDPOINT_URL --region $REGION logs create-log-stream --log-group-name $LOG_GROUP_NAME --log-stream-name $LOG_STREAM_NAME

echo "Log group and log stream created successfully."