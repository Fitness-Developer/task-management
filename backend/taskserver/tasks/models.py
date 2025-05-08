from django.db import models
from django.conf import settings


class Task(models.Model):
    PRIORITY_CHOICES = [
        ('high', 'Высокий'),
        ('medium', 'Средний'),
        ('low', 'Низкий'),
    ]

    STATUS_CHOICES = [
        ('in_progress', 'В процессе'),
        ('completed', 'Завершено'),
        ('deferred', 'Отложено'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    due_date = models.DateField()
    tags = models.CharField(max_length=255)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='in_progress')

    def __str__(self):
        return self.title

