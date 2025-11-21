from django.test import TestCase, Client
from django.contrib.auth.models import User

from .models import Project, Chapter


class ProjectModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="artist", password="pass")

    def test_create_project_and_str(self):
        p = Project.objects.create(owner=self.user, name="My Project")
        self.assertEqual(str(p), "My Project")
        self.assertIsNotNone(p.created_at)
        self.assertIsNotNone(p.updated_at)

    def test_unique_name_per_owner(self):
        Project.objects.create(owner=self.user, name="P1")
        with self.assertRaises(Exception):
            Project.objects.create(owner=self.user, name="P1")

    def test_same_name_different_owners_ok(self):
        other = User.objects.create_user(username="other", password="pass")
        Project.objects.create(owner=self.user, name="P1")
        Project.objects.create(owner=other, name="P1")  # should not raise


class ChapterModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="artist", password="pass")
        self.project = Project.objects.create(owner=self.user, name="Book")

    def test_create_chapter_and_str(self):
        c = Chapter.objects.create(project=self.project, url="https://example.com/1")
        self.assertEqual(str(c), "https://example.com/1")
        self.assertIsNotNone(c.created_at)
        self.assertEqual(c.project, self.project)


class ProjectApiTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username="artist", password="pass")
        self.client.login(username="artist", password="pass")

    def test_create_and_list_projects(self):
        # Create
        res = self.client.post(
            "/api/v1/projects",
            data={"name": "Book", "description": "Desc"},
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["name"], "Book")

        # List
        res = self.client.get("/api/v1/projects")
        self.assertEqual(res.status_code, 200)
        items = res.json()
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["name"], "Book")

    def test_detail_update_delete(self):
        # create one
        res = self.client.post(
            "/api/v1/projects", data={"name": "P"}, content_type="application/json"
        )
        pid = res.json()["id"]

        # detail
        res = self.client.get(f"/api/v1/projects/{pid}")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["name"], "P")

        # update
        res = self.client.patch(
            f"/api/v1/projects/{pid}",
            data={"name": "New"},
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["name"], "New")

        # delete
        res = self.client.delete(f"/api/v1/projects/{pid}")
        self.assertEqual(res.status_code, 204)
        # now list empty
        res = self.client.get("/api/v1/projects")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), [])

    def test_auth_required(self):
        c = Client()
        res = c.get("/api/v1/projects")
        self.assertEqual(res.status_code, 401)


class ChapterApiTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username="artist", password="pass")
        self.client.login(username="artist", password="pass")
        # create a project to attach chapters
        res = self.client.post(
            "/api/v1/projects", data={"name": "P"}, content_type="application/json"
        )
        self.project_id = res.json()["id"]

    def test_create_list_detail_update_delete_chapter(self):
        # create
        res = self.client.post(
            f"/api/v1/projects/{self.project_id}/chapters",
            data={"url": "https://example.com/ch1"},
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 200)
        ch = res.json()
        self.assertEqual(ch["url"], "https://example.com/ch1")
        self.assertIn("created_at", ch)
        cid = ch["id"]

        # list
        res = self.client.get(f"/api/v1/projects/{self.project_id}/chapters")
        self.assertEqual(res.status_code, 200)
        items = res.json()
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["id"], cid)

        # detail
        res = self.client.get(f"/api/v1/projects/{self.project_id}/chapters/{cid}")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["id"], cid)

        # update
        res = self.client.patch(
            f"/api/v1/projects/{self.project_id}/chapters/{cid}",
            data={"url": "https://example.com/updated"},
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["url"], "https://example.com/updated")

        # delete
        res = self.client.delete(f"/api/v1/projects/{self.project_id}/chapters/{cid}")
        self.assertEqual(res.status_code, 204)
        # now list empty
        res = self.client.get(f"/api/v1/projects/{self.project_id}/chapters")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), [])

    def test_auth_required_for_chapters(self):
        c = Client()
        res = c.get(f"/api/v1/projects/{self.project_id}/chapters")
        self.assertEqual(res.status_code, 401)
