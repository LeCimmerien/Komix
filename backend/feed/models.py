from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models import Q, F


class Follow(models.Model):
    """Represents a user following another user."""

    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="following_relations",
        on_delete=models.CASCADE,
    )
    following = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="follower_relations",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["follower", "following"], name="unique_follow_relation"
            ),
            models.CheckConstraint(
                check=~Q(follower=F("following")), name="prevent_self_follow"
            ),
        ]
        ordering = ["-created_at"]

    def clean(self):
        if self.follower_id == self.following_id:
            raise ValidationError("Users cannot follow themselves")

    def __str__(self) -> str:
        return f"{self.follower_id} -> {self.following_id}"


class Subscription(models.Model):
    """Represents a user subscribing to a project."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="subscriptions", on_delete=models.CASCADE
    )
    project = models.ForeignKey(
        "projects.Project", related_name="subscriptions", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "project"], name="unique_project_subscription"
            )
        ]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user_id} -> project {self.project_id}"
