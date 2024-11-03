#!/bin/bash

PROJECT_ID=$(grep SUPABASE_PROJECT_ID .env | cut -d '=' -f2)

if [ -z "$PROJECT_ID" ]; then
    echo "Error: SUPABASE_PROJECT_ID not found in .env file"
    exit 1
fi


supabase gen types typescript --project-id $PROJECT_ID > database.types.ts