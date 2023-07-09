from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from rest_framework import generics, status, generics
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets
import json
from .models import Character, User, CharacterImage
from .serializers import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer, CharacterSerializer, CharacterImageSerializer
import openai
import os
from pathlib import Path
import base64
import requests
import torch
from torchvision.transforms import ToTensor
from torchvision.io import read_image
from torchvision import datasets
from torch import nn
import random
from matplotlib import image
import numpy as np
from django.core.files.base import ContentFile

OPENAI_API_KEY = "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"
openai.api_key = OPENAI_API_KEY


# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/token/refresh/',
        '/api/register/',
        '/api/openai/image/',
        '/api/openai/story/',
        '/api/ping',
        '/api/routes',
        '###############',
        '# ModelViewSet => GET/POST/PUT/DELETE',
        '/api/characters/',

        
    ]
    return Response(routes)

@api_view(['GET', 'POST'])
def unknown_endpoint(request):
    return Response({'error': "Unknown endpoint"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
def logout(request):
    response = JsonResponse("", safe=False)
    response.delete_cookie('')

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        try:
            body = request.body.decode('utf-8')
            data = json.loads(body)
            if 'text' not in data:
                return Response("Invalid JSON data", status.HTTP_400_BAD_REQUEST)
            text = data.get('text')
            data = f'Congratulation your API just responded to POST request with text: {text}'
            return Response({'response': data}, status=status.HTTP_200_OK)
        except json.JSONDecodeError:
            return Response("Invalid JSON data", status.HTTP_400_BAD_REQUEST)
    return Response("Invalid JSON data", status.HTTP_400_BAD_REQUEST)

def ping(request):
    return HttpResponse('Pong')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def characters_list(request):
    if request.user.is_anonymous:
        return JsonResponse({"detail": "You need to be logged in"}, status = status.HTTP_403_FORBIDDEN)
    user = request.user
    return Response({
        'id': user.username,
        'email': user.email,
    })
    # if not request.user_id:
    # return JsonResponse({"error": "Missing user_id"}, status.HTTP_400_BAD_REQUEST)
    data = Character.objects.filter(user_id = 3)
    serializer = CharacterSerializer(data, many=True)
    return Response({"data": serializer.data}, status=status.HTTP_200_OK)
    return JsonResponse({"models_to_return": list(data)})
    # return Response({"data": data}, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
def create_story(request):

    if request.method != 'POST':
        return JsonResponse({"detail": request.method + " is not supported"}, status=status.HTTP_400_BAD_REQUEST)

    print(request.POST)
    params = dict(request.POST)    
    if ("prompt" not in params):
        return JsonResponse({"detail": "Param 'prompt' is mandatory"}, status=status.HTTP_400_BAD_REQUEST)

    prompt = params["prompt"][0]
    response = openai.Completion.create(
        engine = "text-davinci-003",
        prompt = prompt,
        max_tokens = 2000,
        n = 1
    )

    generated_text = response.choices[0].text.strip()
    return JsonResponse({"story": generated_text, "prompt": prompt})

@permission_classes([IsAuthenticated])
def create_image(request):

    params = dict(request.POST)
    if ("character_id" not in params):
        return JsonResponse({"detail": "Param 'character_id' is mandatory"}, status=status.HTTP_400_BAD_REQUEST)
    
    if ("prompt" not in params):
        return JsonResponse({"detail": "Param 'prompt' is mandatory"}, status=status.HTTP_400_BAD_REQUEST)
    
    character = Character.objects.get(id=int(params["character_id"][0]))
    if (not character):
        return JsonResponse({"detail": "Character not found with id "+ params["character_id"][0] }, status=status.HTTP_400_BAD_REQUEST)
    
    
    DATA_DIR = Path.cwd() / f"frontend/static/images/generated/{character.owner.id}"
    DATA_DIR.mkdir(exist_ok=True)

    prompt = params["prompt"][0]
   

    # if request.method != 'POST':
    #     return JsonResponse({"detail": request.method + " is not supported"}, status=status.HTTP_400_BAD_REQUEST)

    # params = dict(request.POST)    
    # if ("prompt" not in params):
    #     return JsonResponse({"detail": "Param 'prompt' is mandatory"}, status=status.HTTP_400_BAD_REQUEST)

    # if ("character_id" not in params):
    #     return JsonResponse({"detail": "Param 'character_id' is mandatory"}, status=status.HTTP_400_BAD_REQUEST)


    response = openai.Image.create(
        prompt = prompt,
        n = 1,
        size="1024x1024",
        # response_format="b64_json",
    )

    print(response)

    file_name = f"{response['created']}.png"
    uri = request.build_absolute_uri(f'/images/generated/{character.owner.id}/{file_name}')
    print(uri)
    path = DATA_DIR / file_name

    print(path)

    urls = [image["url"] for image in response['data']]
    for url in urls:
        image = requests.get(url)
        with open(path, mode="wb") as file:
            file.write(image.content)

    image = CharacterImage(owner=request.user, character=character, filename=file_name, prompt=prompt)
    image.save()

    serializer = CharacterImageSerializer(image)

    return JsonResponse({"detail": serializer.data, "path": uri})

    return redirect(uri)

    return JsonResponse({"prompt": prompt, "url": uri})

class CharacterViewSet(viewsets.ModelViewSet):

    serializer_class = CharacterSerializer
    queryset = Character.objects.all()

    def get_permissions(self):
        permission_classes = []
        if self.action == 'list':
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    

    def list(self, request):
        data = Character.objects.filter(owner = request.user)
        # data = Character.objects.filter(user_id = 4)
        characters = self.serializer_class(data, many=True).data
        return JsonResponse(characters, safe=False)
        return JsonResponse(self.serializer_class(data, many=True).data, safe=False)

    def create(self, request):
        request.data["owner"] = request.user.id
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            data = serializer.save()
            return JsonResponse(serializer.data, safe=False)
        return JsonResponse({"data": data, "errors": serializer.errors}, status= status.HTTP_400_BAD_REQUEST, safe=False)
    
    # def retrieve(self, request, pk=None):
    #     pass

    def update(self, request, *args, **kwargs):
        print("UPDATE", args, kwargs)
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        if instance.owner != request.user:
            return JsonResponse({"detail": "character belongs to a different user"}, status= status.HTTP_403_FORBIDDEN)
        print(instance)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return JsonResponse(serializer.data, safe=False)

    # def partial_update(self, request, pk=None):
    #     pass

    # def destroy(self, request, pk=None):
    #     pass

class CharactersView(generics.CreateAPIView):
    queryset = Character

class CharacterImageViewSet(viewsets.ModelViewSet):

    serializer_class = CharacterImageSerializer
    queryset = CharacterImage.objects.all()

    def get_permissions(self):
        permission_classes = []
        if self.action == 'list':
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    

    def list(self, request):
        params = dict(request.GET)
        data = CharacterImage.objects.filter(character_id = params["character_id"][0]).order_by('-id')[:30] 
        images = self.serializer_class(data, many=True).data
        return JsonResponse(images, safe=False)
        return JsonResponse(self.serializer_class(data, many=True).data, safe=False)

class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(28*28, 28*28*9),
            nn.ReLU(),
            nn.Linear(28*28*9, 28*28*9),
            nn.ReLU(),
            nn.Linear(28*28*9, 10)
        )

    def forward(self, x):
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits
    

    
path = "api/ml/data/model.pth"
if not os.path.exists(path):
    raise(BaseException("Could not find trained model in " + path))

model = NeuralNetwork()
model.load_state_dict(torch.load(path))

test_data = datasets.FashionMNIST(
    root="api/ml/data",
    train=True,
    download=True,
    transform=ToTensor(),
)

def image_as_base64(image_file, format='png'):
    # """
    # :param `image_file` for the complete path of image.
    # :param `format` is format for image, eg: `png` or `jpg`.
    # """
    # if not os.path.isfile(image_file):
    #     return None
    
    # encoded_string = ''
    # with open(image_file, 'rb') as img_f:
    #     encoded_string = base64.b64encode(img_f.read())
    # return 'data:image/%s;base64,%s' % (format, encoded_string)
    binary_fc       = open(image_file, 'rb').read()  # fc aka file_content
    base64_utf8_str = base64.b64encode(binary_fc).decode('utf-8')
    return f'data:image/{format};base64,{base64_utf8_str}'




classes = [
    "T-shirt/top",
    "Trouser",
    "Pullover",
    "Dress",
    "Coat",
    "Sandal",
    "Shirt",
    "Sneaker",
    "Bag",
    "Ankle boot",
]

# @permission_classes([IsAuthenticated])
def get_mnist_image(request):
    params = dict(request.GET)
    index = 0
    if ("index" in params):
        index = int(params["index"][0])
    else:
        index = random.randint(0, len(test_data))
    
    index = index % len(test_data)

    x = test_data[index][0]
    png = np.array(x, dtype='float')
    pixels = png.reshape((28, 28))
    path = 'temp.png'
    image.imsave(path, pixels, cmap = 'gray')
    base64 = image_as_base64("temp.png")

    return JsonResponse({"index": index, "type": classes[test_data[index][1]], "image": base64})

@api_view(['POST'])
def classify_mnist_image(request):
    params = dict(request.POST)
    if ("image" not in params):
        return JsonResponse({"detail": "Param 'image' is mandatory"}, status=status.HTTP_400_BAD_REQUEST)
    print(params)
    image_data = params['image'][0]
    imgStr = image_data.split(';base64')
    imgdata = base64.b64decode(imgStr[1])
    path = "classify.png"
    with open(path, "wb") as fh:
        fh.write(imgdata)
    test = read_image(path)
    result = model(test.float())
    pred = result[0].argmax(0)

    return JsonResponse({"prediction": classes[pred]})


