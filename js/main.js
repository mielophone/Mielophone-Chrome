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
        var albumTemplate = Handlebars.templates.album;

        // precache elemets
        var container = $("#container"),
            resultsContainer = $("#results"),
            artistResultsContainer = $("#artistResults"),
            albumResultsContainer = $("#albumResults"),
            songsResultsContainer = $("#songResults");

		// bind actions
		$("#search").keydown(function(e){
			if(e.which == 13){
                // get query
                var query = $(this).val();

                // clean old stuff
                artistResultsContainer.empty();
                albumResultsContainer.empty();
                songsResultsContainer.empty();

                // get new results
                Mielophone.queryDatabase(query, function(data){
                    var htmlArtists = "",
                        htmlAlbums = "";

                    var item, num;
                    for(var i in data){
                        item = data[i];
                        if(item instanceof Artist){
                            htmlArtists += artistTemplate(item);
                        }else if(item instanceof Album){
                            htmlAlbums += albumTemplate(item);
                        }
                    }

                    container.height(window.innerHeight - 55);
                    resultsContainer.show();

                    artistResultsContainer.html(htmlArtists);
                    albumResultsContainer.html(htmlAlbums);

                    $(".artist").each(function(index, item){
                        var url = $(this).data('image');

                        loadImage(url, $(this));
                    });
                });

                // search for songs
                Mielophone.findAllResults(query, function(data){
					var html = "";

					var i, item;
					for(i = 0; i < data.length; i++){
                        item = data[i];
                        item.num = i+1;
                        html += songTemplate(item);
					}

                    container.height(window.innerHeight - 55);
                    resultsContainer.show();

					songsResultsContainer.html(html);
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