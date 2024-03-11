#!/bin/bash
service postgresql start

adduser --disabled-password --gecos "" test
echo    test:Admlocal1 | /usr/sbin/chpasswd

echo    "CREATE DATABASE transcendence;" >> postgres.sql
echo    "CREATE USER test WITH ENCRYPTED PASSWORD 'Admlocal1';" >> postgres.sql
echo    "GRANT ALL PRIVILEGES ON DATABASE transcendence TO test;" >> postgres.sql

# cat postgres.sql
sudo    -u postgres psql < postgres.sql

# service postgresql start