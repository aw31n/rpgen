# RPGen

## Installation

### Python / Django

Create a new environment (optional)

```
python -m venv <path>/rpgen
<path>/rpgen/Scripts/activate.bat # Windows

- or -

source <path>/rpgen/bin/activate # bash
```

Change directory to <root>/rpgen

```
cd rpgen
```

Install packages

```
pip install -r requirements.txt
```

Run database migrations
```
python .\manage.py makemigrations 
python .\manage.py runmigrations 
```

Create a superuser (optional)
```
python manage.py createsuperuser
# follow the steps on screen
```


### Frontend / React

```
cd rpgen/frontend

# If you're using Yarn
yarn

# Otherwise if you're using npm
npm install

# Start webpack
npm run dev
```

## URLs

```
http://127.0.0.1:8000/          # Website root. Python/Django view that starts the React View
http://127.0.0.1:8000/api/      # root for REST-endpoints

http://127.0.0.1:8000/admin/    # Database Admin View
http://127.0.0.1:8000/images/   # Root for static images located in frontend/static/images (for generated images from openai)
```

## local https (optional)

```
pip install Werkzeug pyOpenSSL
  
choco install mkcert # for windows
mkcert -install
mkcert -cert-file cert.pem -key-file key.pem localhost 127.0.0.1
python manage.py runserver_plus --cert-file cert.pem --key-file key.pem
```







