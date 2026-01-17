import json
from pathlib import Path
from django.core.management.base import BaseCommand, CommandError

# pyright: basic
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Komix.settings")
# django.setup()

from Komix.urls import api

class Command(BaseCommand):
    help = "Closes the specified poll for voting"
    
    # def add_arguments(self, parser):
    #     parser.add_argument("poll_ids", nargs="+", type=int)

    def handle(self, *args, **options):
        path = Path("./generated/openapi.json")
        path.parent.mkdir( parents=True, exist_ok=True)
        with open(path, "w") as f:
            json.dump(api.get_openapi_schema(), f, indent=2)

        self.stdout.write(
                        self.style.SUCCESS("Done!")
                    )