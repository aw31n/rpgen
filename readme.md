# RPGen

## Installation

### Conda / ML

Conda is needed for the machine learning part. You need to create a new conda environment and install some packages for PyTorch.

```
conda create --name ml Python=3.10.11
conda activate ml

# Either with CUDA:
conda install pytorch==1.12.1 torchvision==0.13.1 torchaudio==0.12.1 cudatoolkit=11.3 -c pytorch

# or without:
conda install pytorch torchvision torchaudio -c pytorch
```

Then activate the environment:

```
conda activate ml
```

I added [my ML-Repo](https://github.com/aw31n/ml-fashion-example`) as a submodule in /api/ml.
Change into the subfolder and run the script to download the dataset and train the model.

```
cd <root>/api/ml
python ml.py
```

It will take quite some time without CUDA.

### Python / Django

Create a new environment (optional)

```
python -m venv <root>/rpgen
<root>/rpgen/Scripts/activate.bat # Windows

- or -

source <root>/rpgen/bin/activate # bash
```

Install packages

```
cd <root>
pip install -r requirements.txt
```

Run database migrations
```
python .\manage.py makemigrations 
python .\manage.py migrate 
```

Create a superuser (optional)
```
python manage.py createsuperuser
# follow the steps on screen
```



### Frontend / React

Install packages and the run webpack.

```
cd <root>/frontend

# If you're using npm
npm install
npm run dev

# If you're using yarn
yarn
yarn run dev
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







