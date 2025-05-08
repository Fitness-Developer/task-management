from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Team, TaskTeam
from .serializers import TeamsSerializer, TaskTeamSerializer
from rest_framework.permissions import IsAuthenticated
from acc.models import CustomUser
from acc.serializers import UserSerializer


class TeamsViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamsSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        team = serializer.save()  # Создаем команду
        team.members.add(self.request.user)

    @action(detail=False, methods=['get'])
    def my_teams(self, request):
        """Возвращает команды, в которые добавлен текущий пользователь."""
        user = request.user
        teams = Team.objects.filter(members=user)
        serializer = self.get_serializer(teams, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_user(self, request, pk=None):
        team = self.get_object()
        username = request.data.get('username')
        try:
            user = CustomUser.objects.get(username=username)
            team.members.add(user)
            return Response({'status': 'user added'}, status=status.HTTP_201_CREATED)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'])
    def remove_user(self, request, pk=None):
        team = self.get_object()
        user_id = request.data.get('user_id')  # Используем user_id, а не username
        try:
            user = CustomUser.objects.get(pk=user_id)
            team.members.remove(user)
            return Response({'status': 'user removed'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'An unexpected error occurred: {e}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TaskTeamViewSet(viewsets.ModelViewSet):
    queryset = TaskTeam.objects.all()
    serializer_class = TaskTeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return TaskTeam.objects.filter(team__members=user) #Более эффективный запрос
        return TaskTeam.objects.none() # Возвращаем пустой QuerySet для неавторизованных пользователей

    def perform_create(self, serializer):
        serializer.save(assigned_to=self.request.user)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.all()  # Используйте CustomUser вместо User
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(username__icontains=search)  # Фильтрация по имени пользователя
        return queryset