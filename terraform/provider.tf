terraform {
  required_version = ">= 1.3"
  backend "s3" {
    bucket = "usa-spending-bot-tfstate"
    encrypt = true
    key    = "terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "usa-spending-bot-dynamo-lock"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.51.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  profile = "infra"
  default_tags {
    tags = {
      Environment = var.environment
      Application = var.application
      Owner       = var.owner     
    }
  }
}
