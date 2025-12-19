# Optional: Minimal EB resources (application + environment) using a single EC2 instance tier

resource "aws_elastic_beanstalk_application" "app" {
  name        = "${var.project}-app"
  description = "Elastic Beanstalk application for ${var.project}"
}

resource "aws_elastic_beanstalk_environment" "env" {
  name                = "${var.project}-env"
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = "64bit Amazon Linux 2 v3.7.6 running Docker"

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "NODE_ENV"
    value     = "production"
  }

  tier = "WebServer"
}
