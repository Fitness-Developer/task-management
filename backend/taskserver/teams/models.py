from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()  # Получаем пользовательскую модель

class Team(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, related_name='teams', blank=True) # Обратная связь добавлена
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teams_created')
    def __str__(self):
        return self.name

class TaskTeam(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('deferred', 'Deferred'),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=[('high', 'High'), ('medium', 'Medium'), ('low', 'Low')])
    due_date = models.DateField(blank=True, null=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='tasks')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='tasks')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')

    def __str__(self):
        return self.title