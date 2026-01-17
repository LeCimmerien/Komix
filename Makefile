
generate:
	cd backend && python manage.py freeze_api
	cp -r backend/generated frontend/api-schema
	cd frontend && npm run generate
	