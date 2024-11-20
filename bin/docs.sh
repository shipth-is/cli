#!/bin/bash

set -e

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Configuration for buckets
DEV_BUCKET="shipthis-develop-docs"
PROD_BUCKET="shipthis-prod-docs"
BUCKET_FOLDER="docs"
SOURCE_DIR="$scriptDir/../docs"
ENDPOINT_URL="https://ams3.digitaloceanspaces.com" # DigitalOcean Spaces endpoint for the ams3 region

# Check if environment parameter is provided
if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <environment>"
  echo "Environment must be 'develop' or 'prod'."
  exit 1
fi

ENVIRONMENT="$1"

# Determine the bucket based on environment
if [[ "$ENVIRONMENT" == "develop" ]]; then
  BUCKET_NAME="$DEV_BUCKET"
elif [[ "$ENVIRONMENT" == "prod" ]]; then
  BUCKET_NAME="$PROD_BUCKET"
else
  echo "Error: Invalid environment '$ENVIRONMENT'. Please specify 'develop' or 'prod'."
  exit 1
fi

# Ensure required variables are set
if [[ -z "$BUCKET_NAME" || -z "$BUCKET_FOLDER" || -z "$SOURCE_DIR" ]]; then
  echo "Error: One or more required variables are not set."
  exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &>/dev/null; then
  echo "Error: AWS CLI is not installed."
  exit 1
fi

# Check if AWS credentials are set
if [[ -z "$AWS_ACCESS_KEY_ID" || -z "$AWS_SECRET_ACCESS_KEY" ]]; then
  echo "Error: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are not set."
  echo "Please export these variables for DigitalOcean Spaces."
  exit 1
fi

# Confirm action
read -p "Are you sure you want to empty s3://${BUCKET_NAME}/${BUCKET_FOLDER} and upload markdown files from ${SOURCE_DIR} with public-read ACL? (yes/no): " CONFIRM
if [[ "$CONFIRM" != "yes" ]]; then
  echo "Operation canceled."
  exit 0
fi

# Check if the folder is empty or non-existent
echo "Checking if s3://${BUCKET_NAME}/${BUCKET_FOLDER} exists and has content..."
if aws s3 ls "s3://${BUCKET_NAME}/${BUCKET_FOLDER}" --endpoint-url "$ENDPOINT_URL" | grep -q "."; then
  # Folder has content, proceed to delete
  echo "Emptying s3://${BUCKET_NAME}/${BUCKET_FOLDER}..."
  aws s3 rm "s3://${BUCKET_NAME}/${BUCKET_FOLDER}" --recursive --endpoint-url "$ENDPOINT_URL"
  if [[ $? -ne 0 ]]; then
    echo "Error: Failed to empty the folder in the Space."
    exit 1
  fi
else
  echo "s3://${BUCKET_NAME}/${BUCKET_FOLDER} is empty or does not exist. Skipping deletion."
fi

# Upload markdown files with public-read ACL
echo "Uploading markdown files from ${SOURCE_DIR} to s3://${BUCKET_NAME}/${BUCKET_FOLDER} with public-read ACL..."
aws s3 cp "$SOURCE_DIR" "s3://${BUCKET_NAME}/${BUCKET_FOLDER}" --recursive --exclude "*" --include "*.md" --acl public-read --endpoint-url "$ENDPOINT_URL"
if [[ $? -eq 0 ]]; then
  echo "Upload completed successfully with public-read ACL."
else
  echo "Error: Failed to upload markdown files."
  exit 1
fi
