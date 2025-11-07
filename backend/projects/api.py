from django.http import HttpResponse
from ninja import Router, Schema
from ninja.security import django_auth
from django.shortcuts import get_object_or_404
from .models import Project

router = Router()


class ProjectIn(Schema):
    name: str
    description: str | None = None


class ProjectOut(Schema):
    id: int
    name: str
    description: str | None


def _to_out(p: Project) -> ProjectOut:
    return ProjectOut(id=p.id, name=p.name, description=p.description)


@router.get("", auth=django_auth, response=list[ProjectOut])
def list_projects(request):
    qs = Project.objects.filter(owner=request.user).order_by("-created_at")
    return [_to_out(p) for p in qs]


@router.post("", auth=django_auth, response=ProjectOut)
def create_project(request, payload: ProjectIn):
    p = Project.objects.create(
        owner=request.user, name=payload.name, description=payload.description or ""
    )
    return _to_out(p)


@router.get("/{project_id}", auth=django_auth, response=ProjectOut)
def get_project(request, project_id: int):
    p = get_object_or_404(Project, id=project_id, owner=request.user)
    return _to_out(p)


@router.patch("/{project_id}", auth=django_auth, response=ProjectOut)
def update_project(request, project_id: int, payload: ProjectIn):
    p = get_object_or_404(Project, id=project_id, owner=request.user)
    if payload.name is not None:
        p.name = payload.name
    if payload.description is not None:
        p.description = payload.description
    p.save()
    return _to_out(p)


@router.delete("/{project_id}", auth=django_auth)
def delete_project(request, project_id: int):
    p = get_object_or_404(Project, id=project_id, owner=request.user)
    p.delete()
    return HttpResponse(status=204)
