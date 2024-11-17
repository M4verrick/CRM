# Project Group 3 Team 1 

## Testing current setup

1. Go to https://www.itsag3t1.com/home
2. Login using these credentials:
- Email: tesipo@gmail.com
- Password: Thisisnewtesipo!23
3. Use the navigation tabs on the left
- Add User (to add agents)
- Add Client Profile (to add client profiles)
- Add Account (to add client accounts)
- Manage Profiles (Feature 2, view/delete profiles/accounts)
- Manage System Users (Feature 1)
- Manage Transactions (Feature 3)
- Manage User Transactions (Feature 3)

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
- SSH Key and updated in Github

1. Go to /infra directory
2. Go to variables.tf and update the following variables:
    - region - to your desired region
    - ssh_key_path - to your ssh key path to access Github
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

`cd dashboard`

Set up your env. file with your own AWS Credentials and resource IDs. Ensure that you have the correct AWS credentials for AWS cognito and AWS CloudWatch Logs.
You may use the .env.example file as a template.


To Start Server on Docker:

`docker compose build`
`docker compose up`

To Visit App:

`localhost:3000/home` 
