#!/bin/bash

env_file=$1

while IFS= read -r line; do

  if [ -z "$line" ]; then
    continue 
  fi

  key=$(echo "$line" | cut -d'=' -f1)
  value=$(echo "$line" | cut -d'=' -f2)

  heroku config:set "$key"="$value"

done < "$env_file"