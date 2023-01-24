resource "aws_lightsail_container_service" "my_container_service" {
  name        = "${var.environment}-${var.application}-cs"
  power       = var.power
  scale       = var.scale
  is_disabled = var.container_service_is_disabled
}