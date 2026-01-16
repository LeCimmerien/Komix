from ninja import Router, Schema
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.http import HttpResponse

from .models import Follow, Subscription
from projects.models import Project

router = Router()


# Schemas
class UserOut(Schema):
    id: int
    username: str


def _user_out(u) -> UserOut:
    return UserOut(id=u.id, username=u.get_username())


class ProjectOut(Schema):
    id: int
    name: str


def _project_out(p: Project) -> ProjectOut:
    return ProjectOut(id=p.id, name=p.name)


# Follow endpoints
@router.get("/following", response=list[UserOut])
def list_following(request):
    user = request.user
    User = get_user_model()
    qs = User.objects.filter(follower_relations__follower=user).order_by("username")
    return [_user_out(u) for u in qs]


@router.get("/followers", response=list[UserOut])
def list_followers(request):
    user = request.user
    User = get_user_model()
    qs = User.objects.filter(following_relations__following=user).order_by("username")
    return [_user_out(u) for u in qs]


@router.post("/follow/{user_id}", response=UserOut)
def follow_user(request, user_id: int):
    User = get_user_model()
    target = get_object_or_404(User, id=user_id)
    if target.id == request.user.id:
        # Return bad request for self-follow attempts
        return HttpResponse(status=400)
    Follow.objects.get_or_create(follower=request.user, following=target)
    return _user_out(target)


@router.delete("/follow/{user_id}")
def unfollow_user(request, user_id: int):
    User = get_user_model()
    target = get_object_or_404(User, id=user_id)
    Follow.objects.filter(follower=request.user, following=target).delete()
    return HttpResponse(status=204)


# Subscription endpoints
@router.get("/subscriptions", response=list[ProjectOut])
def list_subscriptions(request):
    qs = Project.objects.filter(subscriptions__user=request.user).order_by("name")
    return [_project_out(p) for p in qs]


@router.post("/subscribe/{project_id}", response=ProjectOut)
def subscribe_project(request, project_id: int):
    project = get_object_or_404(Project, id=project_id)
    Subscription.objects.get_or_create(user=request.user, project=project)
    return _project_out(project)


@router.delete("/subscribe/{project_id}")
def unsubscribe_project(request, project_id: int):
    project = get_object_or_404(Project, id=project_id)
    Subscription.objects.filter(user=request.user, project=project).delete()
    return HttpResponse(status=204)


@router.get(
    "/projects/{project_id}/subscribers", response=list[UserOut]
)
def list_project_subscribers(request, project_id: int):
    project = get_object_or_404(Project, id=project_id)
    # Only project owner can view subscribers
    if project.owner_id != request.user.id:
        return HttpResponse(status=403)
    User = get_user_model()
    users = User.objects.filter(subscriptions__project=project).order_by("username")
    return [_user_out(u) for u in users]
