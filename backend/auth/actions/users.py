import uuid
from sqlite3 import IntegrityError

from django.contrib.auth.models import User
from django.template.loader import render_to_string
from Space.models import Reset


class UserAlreadyExists(Exception):
    pass


def create(username, password, email):
    try:
        user = User.objects.create_user(
            username=username, password=password, email=email
        )
        return user.id
    except IntegrityError:
        raise


def fetch_by_username(username):
    try:
        return User.objects.get(username=username)
    except User.DoesNotExist:
        return None


def send_reset_email(user, reset_id):
    base_url = "http://localhost:3000/"
    endpoint = f"auth/reset/{reset_id}"
    body = render_to_string(
        "reset_mail.html",
        {"url": base_url + endpoint},
    )
    user.email_user("Reset du password", body, from_email="bgp.connan@gmail.com")
