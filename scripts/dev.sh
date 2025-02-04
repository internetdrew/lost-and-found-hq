#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
echo "Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Docker is not running. Please start Docker first.${NC}"
    exit 1
fi
echo -e "${GREEN}Docker is running${NC}"

# Check/Start Supabase
echo "Checking Supabase..."
cd server && \
if ! supabase status > /dev/null 2>&1; then
    echo "Starting Supabase..."
    supabase start
fi
cd .. 
echo -e "${GREEN}Supabase is running${NC}"

# Start the dev environment
npm run dev