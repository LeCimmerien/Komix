from django.http import HttpResponse
from ninja import Router, Schema
from ninja.security import django_auth
from django.shortcuts import get_object_or_404
from .models import Project, Chapter

router = Router()


# Projects
class ProjectIn(Schema):
    name: str
    description: str | None = None


class ProjectOut(Schema):
    id: int
    name: str
    description: str | None


def _project_out(p: Project) -> ProjectOut:
    return ProjectOut(id=p.id, name=p.name, description=p.description)


@router.get("", auth=django_auth, response=list[ProjectOut])
def list_projects(request):
    qs = Project.objects.filter(owner=request.user).order_by("-created_at")
    return [_project_out(p) for p in qs]


@router.post("", auth=django_auth, response=ProjectOut)
def create_project(request, payload: ProjectIn):
    p = Project.objects.create(
        owner=request.user, name=payload.name, description=payload.description or ""
    )
    return _project_out(p)


@router.get("/{project_id}", auth=django_auth, response=ProjectOut)
def get_project(request, project_id: int):
    p = get_object_or_404(Project, id=project_id, owner=request.user)
    return _project_out(p)


@router.patch("/{project_id}", auth=django_auth, response=ProjectOut)
def update_project(request, project_id: int, payload: ProjectIn):
    p = get_object_or_404(Project, id=project_id, owner=request.user)
    if payload.name is not None:
        p.name = payload.name
    if payload.description is not None:
        p.description = payload.description
    p.save()
    return _project_out(p)


@router.delete("/{project_id}", auth=django_auth)
def delete_project(request, project_id: int):
    p = get_object_or_404(Project, id=project_id, owner=request.user)
    p.delete()
    return HttpResponse(status=204)


# Chapters
class ChapterIn(Schema):
    url: str


class ChapterOut(Schema):
    id: int
    url: str
    created_at: str


def _chapter_out(c: Chapter) -> ChapterOut:
    # created_at isoformat for simplicity
    return ChapterOut(id=c.id, url=c.url, created_at=c.created_at.isoformat())


@router.get("/{project_id}/chapters", auth=django_auth, response=list[ChapterOut])
def list_chapters(request, project_id: int):
    project = get_object_or_404(Project, id=project_id, owner=request.user)
    qs = project.chapters.all().order_by("-created_at")
    return [_chapter_out(c) for c in qs]


@router.post("/{project_id}/chapters", auth=django_auth, response=ChapterOut)
def create_chapter(request, project_id: int, payload: ChapterIn):
    project = get_object_or_404(Project, id=project_id, owner=request.user)
    c = Chapter.objects.create(project=project, url=payload.url)
    return _chapter_out(c)


@router.get(
    "/{project_id}/chapters/{chapter_id}", auth=django_auth, response=ChapterOut
)
def get_chapter(request, project_id: int, chapter_id: int):
    project = get_object_or_404(Project, id=project_id, owner=request.user)
    c = get_object_or_404(Chapter, id=chapter_id, project=project)
    return _chapter_out(c)


@router.patch(
    "/{project_id}/chapters/{chapter_id}", auth=django_auth, response=ChapterOut
)
def update_chapter(request, project_id: int, chapter_id: int, payload: ChapterIn):
    project = get_object_or_404(Project, id=project_id, owner=request.user)
    c = get_object_or_404(Chapter, id=chapter_id, project=project)
    if payload.url is not None:
        c.url = payload.url
    c.save()
    return _chapter_out(c)


@router.delete("/{project_id}/chapters/{chapter_id}", auth=django_auth)
def delete_chapter(request, project_id: int, chapter_id: int):
    project = get_object_or_404(Project, id=project_id, owner=request.user)
    c = get_object_or_404(Chapter, id=chapter_id, project=project)
    c.delete()
    return HttpResponse(status=204)
