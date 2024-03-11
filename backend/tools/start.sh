#!/bin/bash

python3 /var/run/webapp/manage.py runserver
python3 /var/run/webapp/manage.py makemigrations
python3 /var/run/webapp/manage.py migrate --run-syncdb