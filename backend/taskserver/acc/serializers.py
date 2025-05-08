from rest_framework import serializers
from .models import CustomUser
from teams.models import Team

class UserSerializer(serializers.ModelSerializer):
    teams = serializers.StringRelatedField(many=True, read_only=True) # read_only=True - важно!

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'role', 'teams']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser(**validated_data) # Убираем обработку teams
        user.set_password(validated_data['password'])
        user.save()
        return user

    def get_teams(self, obj):
        return [team.name for team in obj.teams.all()]