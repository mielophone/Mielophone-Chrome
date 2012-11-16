require([
    "../mielophone/Mielophone",
    "../data/include",
    "../plugins/include",
    "templates"
], function(){
    var loadImage = function(url, $element){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            var img = document.createElement('img');
            img.src = window.webkitURL.createObjectURL(this.response);
            img.className = "img-circle";
            $element.prepend(img);
        };

        xhr.send();
    };

	(function() {
        // init templates
        var songTemplate = Handlebars.templates.song;
        var artistTemplate = Handlebars.templates.artist;

        // precache elemets
        var container = $("#container"),
            resultsContainer = $("#results"),
            songsContainer = $("#songs");

		// bind actions
		$("#search").keydown(function(e){
			if(e.which == 13){
                // get query
                var query = $(this).val();

                // clean old stuff
                resultsContainer.empty();

                // get new results
                Mielophone.queryDatabase(query, function(data){
                    var html = "";

                    var item, num;
                    for(var i in data){
                        item = data[i];
                        if(item instanceof Artist){
                            html += artistTemplate(item);
                        }
                    }

                    container.height(window.innerHeight - 55);
                    resultsContainer.html(html);

                    $(".artist").each(function(index, item){
                        var url = $(this).data('image');

                        loadImage(url, $(this));
                    });
                });


                return; // old song search stuff
                songsContainer.empty();
                // search
				var query = $("#search").val();
                Mielophone.findAllResults(query, function(data){
					var html = "";

					var item, num;
					for(var i in data){
                        item = data[i];
                        num = parseInt(i)+1;
                        item.num = num;
                        html += songTemplate(item);
					}

                    container.height(window.innerHeight - 55);
					songsContainer.html(html).show();
				});
			}
		});

		$("body").on("click", ".song", function(evt){
			evt.stopImmediatePropagation();
			evt.preventDefault();
			var id = $(this).data('id');

            Mielophone.getStreamUrl(id, function(streamUrl){
                var source = $('<source/>');
                source.attr('type', 'audio/mpeg');
                source.attr('src', streamUrl);
                $("#player").append(source);
            });
			return false;
		});
	})();
});