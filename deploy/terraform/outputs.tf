output "ecr_repository" {
  value = aws_ecr_repository.backend.repository_url
}

output "ecs_cluster" {
  value = aws_ecs_cluster.main.name
}

output "s3_bucket" {
  value = aws_s3_bucket.frontend.bucket
}