setup:
	npm install

watch:
	NODE_ENV=development PORT=3000 gulp

release:
	NODE_ENV=production gulp
