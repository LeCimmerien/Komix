from Space.models import Reset
import uuid


def create(user_id):
    r = Reset(id=uuid.uuid4(), user_id=user_id)
    r.save()
    return r.id


def get(reset_id):
    try:
        return Reset.objects.get(id=reset_id)
    except Reset.DoesNotExist:
        return None


def apply(reset_id, new_password):
    try:
        r = Reset.objects.get(id=reset_id)
        r.user.set_password(new_password)
    except Reset.DoesNotExist:
        return None
