resource "aws_security_group" "ssh" {
  name        = "allow-ssh"
  description = "Allow inbound SSH"

  ingress {
    description = "SSH from me"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["92.82.187.185/32"]   # narrow this to your IP, not 0.0.0.0/0
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
