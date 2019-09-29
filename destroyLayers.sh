#!/usr/bin/env bash

cd ../application
pulumi destroy --non-interactive --yes && pulumi stack rm dev --force --non-interactive

cd ../database
pulumi destroy --non-interactive --yes && pulumi stack rm dev --force --non-interactive

cd ../networking
pulumi destroy --non-interactive --yes && pulumi stack rm dev --force --non-interactive
