# base image  
FROM python:3.8

# RUN sleep 10s

# setup environment variable  
ENV DockerHOME=/home/app/webapp  

# set work directory  
RUN mkdir -p $DockerHOME  

RUN apt-get update -y
RUN apt-get install libsystemd0 -y
RUN apt-get install vim -y

# where your code lives  
WORKDIR $DockerHOME  

# set environment variables  
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1  

# install dependencies  
RUN pip3 install --upgrade pip

# copy whole project to your docker home directory. 
COPY . $DockerHOME  
# run this command to install all dependencies  
COPY requirements.txt /opt/app/requirements.txt
WORKDIR /opt/app
RUN pip install -r requirements.txt
COPY . /opt/app
RUN pip3 install --upgrade attrs  
# port where the Django app runs  
EXPOSE 8000

# start server 
CMD ["sh", "-c", "python3 manage.py makemigrations && python3 manage.py migrate --run-syncdb && python3 manage.py runserver 0.0.0.0:8000"]