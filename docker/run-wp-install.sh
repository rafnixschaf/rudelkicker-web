#!/bin/bash

cp /bin/wp-cli.phar /var/www/html
cd /var/www/html

if [ ! -d /var/www/html/wp ]; then
  php wp-cli.phar core download --allow-root
fi

until dbOnline=$(mysql -h "db" -u application -papplication) ; do

    if ! dbOnline; then
       echo "Keine Sorge das muss so sein"
    else
      php wp-cli.phar config create --allow-root
    fi

  sleep 1
done

cd /var/www/html
composer install
/bin/bash