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
    
    DATA_DIR = Path.cwd() / f"frontend/static/images/generated/{request.user.id}"
    DATA_DIR.mkdir(exist_ok=True)

    prompt = "epic battle scene of an orc warrior holding a sword, award-winning photography"
   

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
    uri = request.build_absolute_uri(f'/images/generated/{request.user.id}/{file_name}')
    print(uri)
    path = DATA_DIR / file_name

    print(path)

    urls = [image["url"] for image in response['data']]
    for url in urls:
        image = requests.get(url)
        with open(path, mode="wb") as file:
            file.write(image.content)

    image = CharacterImage(owner=request.user, character=Character.objects.get(pk=30), filename=file_name, prompt=prompt)
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
