from rest_framework import serializers
from .models import Character, User, CharacterImage
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        # ...
        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data['email']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
    

class CharacterSerializer(serializers.ModelSerializer):

    owner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Character
        fields = ('id', 'owner', 'name', 'age', 'gender', 'race', 'weapon', 'character_class', 'story', 'prompt', 'image_prompt')

    def validate(self, attrs):
        errors = {}
        if not attrs['owner']:
            errors["owner"] = "owner is missing for character."
        
        if not attrs['name']:
            errors["name"] = "name is missing for character."

        if errors.__len__() > 0:
            raise serializers.ValidationError(errors)

        return attrs
    
    def to_representation(self, instance):
        # self.fields['owner'] =  UserSerializer(read_only=True)
        return super(CharacterSerializer, self).to_representation(instance)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email')


class CharacterImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharacterImage
        fields = ('id', 'filename', 'prompt', 'created')