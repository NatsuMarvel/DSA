This folder contains minimal Terraform templates to provision resources needed to deploy the app to AWS:

- ECR repository for backend container images
- ECS cluster (Fargate)
- S3 bucket for frontend static files

These are intentionally minimal. Recommended workflow:

1. Install Terraform and AWS CLI
2. Configure AWS credentials, or set up a GitHub OIDC role and follow the instructions in the project README
3. cd deploy/terraform && terraform init && terraform apply -var "s3_bucket_name=your-unique-bucket-name" -var "project=dsa-sheet" -var "aws_region=us-east-1"
4. Use the outputs to configure GitHub Actions secrets and to register ECS resources (task definition, service) as needed.

Note: Adding ALB, CloudFront, Route53 and IAM roles is left as an exercise and can be extended to match your security and scaling needs.