variable "aws_region" {
  description = "AWS region to deploy into"
  type = string
  default = "us-east-1"
}

variable "project" {
  type = string
  default = "dsa-sheet"
}

variable "domain" {
  type = string
  default = ""
}

variable "s3_bucket_name" {
  type = string
  default = "" # set to unique name
}
