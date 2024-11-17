# Project Group 3 Team 1 

## Testing 

Login credentials you can use to test the application:

- Email: tesipo@gmail.com
- Password: Thisisnewtesipo!23

Create Client Profile Test Data

Get Client Profile

Delete Client Profile

Get Client Account

Delete Client Account

## New Setup
Prequisites:
- Terraform
- AWS CLI
- Kubectl
- Set up AWS CLI with your credentials - https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html

1. Go to /infra directory
2. Go to variables.tf and update the following variables:
    - aws_region - to your desired region
2. Run `terraform init`
3. Run `terraform apply --auto-approve`

## Configure Kubectl
Retrieve `kubectl` config, then execute the output command:
```shell
terraform output -raw configure_kubectl
```

## Access ArgoCD
Access ArgoCD's UI, run the command from the output:
```shell
terraform output -raw access_argocd
```

## Destroy the EKS Cluster
To tear down all the resources and the EKS cluster, run the following command:
```shell
./destroy.sh
```

## Frontend:  

Clone down this repository.  

`cd dashboard`

Set up your env. file with your own AWS Credentials and resource IDs.

You may use the env.example file as a template.

To Start Server on Docker:

`docker compose build`
`docker compose up`

To Visit App:

`localhost:3000/home` 

To tear down the docker image:
 `docker compose down`
