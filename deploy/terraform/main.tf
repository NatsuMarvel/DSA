# Minimal infra: ECR repo, ECS cluster, S3 bucket for frontend

resource "aws_ecr_repository" "backend" {
  name = "${var.project}-backend"
}

resource "aws_ecs_cluster" "main" {
  name = "${var.project}-cluster"
}

resource "aws_s3_bucket" "frontend" {
  bucket = var.s3_bucket_name != "" ? var.s3_bucket_name : "${var.project}-frontend-${random_id.suffix.hex}"
  acl    = "public-read"
  force_destroy = true
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "random_id" "suffix" {
  byte_length = 4
}
