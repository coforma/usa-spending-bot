// create a variable for the region
variable "aws_region" {
  description = "The AWS region to deploy to"
  default     = "us-east-1"
  type        = string
}

// create a variable for the application name
variable "application" {
  description = "The name of the application"
  default     = "usa-spending-bot"
  type        = string
}

// create a variable for the environment
variable "environment" {
  description = "The environment to deploy to"
  default     = "dev"
  type        = string
}

// create a variable for the owner
variable "owner" {
  description = "The owner of the application"
  default     = "devsecops"
}

// create a variable for the container service scale
variable "scale" {
  description = "The scale of the container service, How many host nodes to run."
  default     = 1
  type        = number
}

// create a variable for container service power
variable "power" {
  description = "The power of the container service"
  default     = "nano"
  type        = string
  validation {
    condition     = contains(["nano", "micro", "small", "medium", "large", "xlarge"], var.power)
    error_message = "The power must be one of nano, micro, small, medium, large, and xlarge."
  }
}

// create a variable for container service is disabled
variable "container_service_is_disabled" {
  description = "Whether the container service is disabled"
  default     = false
  type        = bool
}