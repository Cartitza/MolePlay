output "public_ip" {
  value = aws_instance.app_server.public_ip
}

output "ssh_command" {
  value     = "ssh -i ${path.root}/nb-key-pair.pem ec2-user@${aws_instance.app_server.public_ip}"
  sensitive = true
}
