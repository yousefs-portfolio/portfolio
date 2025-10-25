#!/usr/bin/env fish
# Usage: ./deploy.fish dev|uat|prod

if test (count $argv) -ne 1
  echo "Usage: ./deploy.fish dev|uat|prod"
  exit 1
end

set env $argv[1]
switch $env
  case dev uat prod
  case '*
