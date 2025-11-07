from django.db import models
from django.contrib.auth import get_user_model


class Project(models.Model):
    owner = models.ForeignKey(
        get_user_model(), related_name="projects", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "name"], name="unique_project_per_owner"
            )
        ]

    def __str__(self) -> str:
        return self.name


class Chapter(models.Model):
    project = models.ForeignKey(
        Project, related_name="chapters", on_delete=models.CASCADE
    )
    url = models.URLField(max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.url
