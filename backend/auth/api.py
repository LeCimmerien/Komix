from django.http import HttpResponseBadRequest, Http404, HttpResponse
from ninja import Schema, Router
from auth.actions import resets, users
from django.contrib import auth

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
    try:
        users.create(payload.username, payload.password, payload.email)
        return {"result": "success"}
    except users.UserAlreadyExists:
        return HttpResponseBadRequest("User already exists")


@router.post("/login")
def login(request, payload: LogInput):
    print("payload", payload)
    user = auth.authenticate(
        request, username=payload.username, password=payload.password
    )
    print("user", user)
    if user is None:
        return {"error": "Invalid credentials"}
    result = auth.login(request, user)
    return {"result": result}


@router.post("/login/reset")
def send_reset(request, payload: ResetInput):
    user = users.fetch_by_username(payload.value)
    if user is None:
        raise Http404("User not found")

    reset_id = resets.create(user.id)
    users.send_reset_email(user, reset_id)

    return HttpResponse(status=204)


@router.post("/reset")
def apply_reset(request, payload: ApplyResetInput):
    resets.apply(payload.reset_id, payload.password)
    return {"result": "success"}
