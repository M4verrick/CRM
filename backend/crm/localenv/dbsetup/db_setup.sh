#!/bin/bash

# Database credentials
DB_USER="crmappuser"
DB_PASSWORD="crmapppassword"
DB_NAME="crmdatabase"
DB_HOST="localhost:5432"

# Execute the SQL scripts
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d $DB_NAME -f setup_client_profiles.sql
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d $DB_NAME -f setup_client_accounts.sql

echo "Database setup and seeding completed successfully."