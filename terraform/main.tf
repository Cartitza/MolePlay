provider "aws" {
  region = "eu-north-1"
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  owners = ["099720109477"] # Canonical
}

resource "tls_private_key" "nb-keypair" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

# Save the private key to a local file
resource "local_file" "private_key" {
  content  = tls_private_key.nb-keypair.private_key_pem
  filename = "${path.root}/nb-key-pair.pem"
}

# Create an AWS Key Pair using the generated public key
resource "aws_key_pair" "nb-keypair" {
  key_name   = "nb-key-pair"
  public_key = tls_private_key.nb-keypair.public_key_openssh
}

resource "aws_instance" "app_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name      = aws_key_pair.nb-keypair.key_name
  vpc_security_group_ids = [aws_security_group.ssh.id]

  tags = {
    Name = "learn-terraform"
  }
}
