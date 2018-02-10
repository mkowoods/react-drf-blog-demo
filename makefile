build-main-reactjs:
	npm --prefix ./react-ux run build

update-django-main-reactjs: build-main-reactjs
	cp ./react-ux/build/static/js/*.js ./blog/static/js/react-index.js

update-django: update-django-main-reactjs
