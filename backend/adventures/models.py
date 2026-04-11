from django.db import models
from django.contrib.auth.models import User


class Adventure(models.Model):
    title = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    address = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    google_place_id = models.CharField(max_length=255, blank=True)
    image_url = models.URLField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class SavedAdventure(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    adventure = models.ForeignKey(Adventure, on_delete=models.CASCADE)
    notes = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)
    saved_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.adventure.title}"
