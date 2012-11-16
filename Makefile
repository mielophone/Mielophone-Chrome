default: clean coffee templates

all: clean coffee templates

templates: 
	@echo 'Compiling templates'
	handlebars templates/*.handlebars -f js/templates.js
	@echo 'Templates compiled'

coffee: 
	@echo 'Compiling coffeescript to js ...'
	coffee -c coffee/*.coffee
	coffee -c coffee/plugins/*.coffee
	coffee -c coffee/data/*.coffee
	coffee -c coffee/services/*.coffee
	@echo 'Minifying ...'
	grunt
	@echo 'Moving compiled js into destination ...'
	mv coffee/Mielophone.js mielophone/
	mv coffee/services/*.js mielophone/services/
	mv coffee/plugins/*.js plugins/
	mv coffee/data/*.js data/
	@echo 'cleaning ...'
	rm -rf coffee/*.js
	rm -rf coffee/data/*.js
	rm -rf coffee/plugins/*.js
	rm -rf coffee/services/*.js
	@echo 'Finished!'

clean:
	rm -rf coffee/*.js
	rm -rf coffee/data/*.js
	rm -rf coffee/plugins/*.js
	rm -rf coffee/services/*.js