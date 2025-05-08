from rest_framework import serializers
from .models import Team, TaskTeam
from acc.serializers import UserSerializer
from acc.models import CustomUser



class TeamsSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    class Meta:
        model = Team
        fields = ['id', 'name', 'members', 'created_by']
        extra_kwargs = {'members': {'required': False}}
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username']

class TaskTeamSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(many=False, read_only=True)
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())

    class Meta:
        model = TaskTeam
        fields = ['id', 'title', 'description', 'priority', 'due_date', 'assigned_to', 'team','status']