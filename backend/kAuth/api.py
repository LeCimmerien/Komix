from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from ninja import Schema, Router
from django.contrib import auth
from .models import Reset
import uuid

router = Router()


class LogInput(Schema):
    username: str
    password: str


class RegisterInput(Schema):
    username: str
    email: str
    password: str


class ResetInput(Schema):
    value: str


class ApplyResetInput(Schema):
    reset_id: str
    password: str


@router.post("/register")
def register(request, payload: RegisterInput):
    u = get_user_model().objects.create_user(
        username=payload.username, password=payload.password, email=payload.email
    )
    return u.id


@router.post("/login")
def login(request, payload: LogInput):
    u = auth.authenticate(request, username=payload.username, password=payload.password)
    if u is None:
        return HttpResponse(status=401)
    auth.login(request, u)
    return HttpResponse(status=204)


@router.post("/login/reset")
def send_reset(request, payload: ResetInput):
    u = get_object_or_404(get_user_model(), username=payload.value)
    r = Reset(id=uuid.uuid4(), user_id=u.id)
    r.save()

    base_url = "http://localhost:3000/"
    endpoint = f"auth/reset/{r.id}"
    body = render_to_string(
        "reset_mail.html",
        {"url": base_url + endpoint},
    )
    u.email_user("Reset du password", body, from_email="bgp.connan@gmail.com")

    return HttpResponse(status=204)


@router.post("/reset")
def apply_reset(request, payload: ApplyResetInput):
    r = get_object_or_404(Reset, id=payload.reset_id)
    r.user.set_password(payload.password)

    return HttpResponse(status=204)
