CURRENT_DATE := $(shell date +'%b %d, %Y')

define replace_build_date
	sed -i 's/^<span class="last-update">.*<\/span>/<span class="last-update">Site last generated: $(CURRENT_DATE)<\/span>/g' _site/archive.html
endef

build:
	cobalt build && rm -rf _site/project/ && rm -rf _site/log/ && $(replace_build_date)
