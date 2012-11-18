require([
    "../mielophone/Mielophone",
    "../data/include",
    "../plugins/include",
    "templates"
], function(){
    var loadImage = function(url, $element, defaultClass){
        if(typeof defaultClass == 'undefined') defaultClass = "img-circle";

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            var img = document.createElement('img');
            img.src = window.webkitURL.createObjectURL(this.response);
            img.className = defaultClass;
            $element.prepend(img);
        };

        xhr.send();
    };

	(function() {
        // init vars
        var currentResults, currentArtist, currentAlbum;


        // init templates
        var songTemplate = Handlebars.templates.song;
        var artistTemplate = Handlebars.templates.artist;
        var albumTemplate = Handlebars.templates.album;

        // pre-cache main container
        var container = $("#container"),
        // pre-cache results
            resultsContainer = $("#results"),
            artistResultsContainer = $("#artistResults"),
            albumResultsContainer = $("#albumResults"),
            songsResultsContainer = $("#songResults"),
        // pre-cache artist stuff
            artistInfo = $("#artistInfo"),
            artistImage = $("#artistImage"),
            artistName = $("#artistName"),
            artistAlbums = $("#artistAlbums"),
        // pre-cache album stuff
            albumInfo = $("#albumInfo"),
            albumImage = $("#albumImage"),
            albumTitle = $("#albumTitle"),
            albumTracklist = $("#albumTracklist");


        var getCurrentArtist = function(id){
            var i;
            for(i = 0; i < currentResults.length; i++){
                if(currentResults[i].id == id && currentResults[i].type == "artist")
                    return currentResults[i];
            }
        };
        var getCurrentAlbum = function(id){
            var i;
            for(i = 0; i < currentResults.length; i++){
                if(currentResults[i].id == id && (currentResults[i].type == "master" || currentResults[i].type == "release"))
                    return currentResults[i];
            }
        };


		// bind actions
		$("#search").keydown(function(e){
			if(e.which == 13){
                // get query
                var query = $(this).val();

                // clean old stuff
                artistResultsContainer.empty();
                albumResultsContainer.empty();
                songsResultsContainer.empty();
                currentAlbum = currentArtist = currentResults = null;

                // hide all
                artistInfo.hide();
                albumInfo.hide();
                resultsContainer.hide();

                // get new results
                Mielophone.queryAll(query, function(data){
                    currentResults = data;

                    var htmlArtists = "",
                        htmlAlbums = "",
                        htmlSongs = "";

                    var artistsNum = 0,
                        albumsNum = 0,
                        songsNum = 0,
                        maxNum = 5, maxSongsNum = 10;

                    var item, i;
                    for(i = 0; i < data.length; i++){
                        item = data[i];
                        if(item instanceof Artist && artistsNum < maxNum){
                            htmlArtists += artistTemplate(item);
                            artistsNum++;
                        }else if(item instanceof Album && albumsNum < maxNum){
                            htmlAlbums += albumTemplate(item);
                            albumsNum++;
                        }else if(item instanceof Track && songsNum < maxSongsNum){
                            item.num = songsNum+1;
                            htmlSongs += songTemplate(item);
                            songsNum++;
                        }

                        if( artistsNum >= maxNum && albumsNum >= maxNum && songsNum >= maxSongsNum ) break;
                    }

                    // adjust size
                    container.height(window.innerHeight - 55);
                    resultsContainer.show();

                    artistResultsContainer.html(htmlArtists);
                    albumResultsContainer.html(htmlAlbums);
                    songsResultsContainer.html(htmlSongs);

                    $(".artist").each(function(index, item){
                        var url = $(this).data('image');
                        loadImage(url, $(this));
                    });
                    $(".album").each(function(index, item){
                        var url = $(this).data('image');
                        loadImage(url, $(this));
                    });
                });
			}
		});

        $("body").on("click", ".artist", function(evt){
            evt.stopImmediatePropagation();
            evt.preventDefault();
            var aid = $(this).data('id'),
                aname = $(this).text(),
                aimage = $(this).data('image');

            // set current artist
            currentArtist = getCurrentArtist(aid);

            // set name & image
            artistName.text(aname);
            artistImage.empty();
            loadImage(aimage, artistImage, "img-rounded");

            // show container
            artistInfo.show();

            // hide old stuff
            resultsContainer.hide();
            albumInfo.hide();

            // get albums
            Mielophone.getDiscography(aid, function(results){
                currentResults = results;

                var htmlAlbums = "";

                var item, i;
                for(i = 0; i < results.length; i++){
                    item = results[i];
                    htmlAlbums += albumTemplate(item);
                }

                // adjust container size
                container.height(window.innerHeight - 55);

                // html
                artistAlbums.html(htmlAlbums);

                // load images
                $(".album").each(function(index, item){
                    var url = $(this).data('image');

                    loadImage(url, $(this));
                });
            });
            return false;
        })
        .on("click", ".album", function(evt){
            evt.stopImmediatePropagation();
            evt.preventDefault();
            var aid = $(this).data('id'),
                aname = $(this).text(),
                aimage = $(this).data('image');

            // set current album
            currentAlbum = getCurrentAlbum(aid);

            // set current artist
            if( currentArtist == null ){
                currentArtist = {name: aname.split(" - ")[0]};
            }

            // set name & image
            albumTitle.text(currentArtist.name + " - " + aname);
            albumImage.empty();
            loadImage(aimage, albumImage, "img-rounded");
            // show container
            albumInfo.show();

            // hide old stuff
            artistInfo.hide();
            resultsContainer.hide();

            // get albums
            Mielophone.getAlbumTracklist(aid, currentAlbum.type, currentArtist.name, function(results){
                var htmlTracks = "";

                var item, i;
                for(i = 0; i < results.length; i++){
                    item = results[i];
                    htmlTracks += songTemplate(item);
                }

                // adjust container size
                container.height(window.innerHeight - 55);

                // html
                albumTracklist.html(htmlTracks);
            });
            return false;
        })
        .on("click", ".song", function(evt){
			evt.stopImmediatePropagation();
			evt.preventDefault();
			var id = $(this).data('id');
            var name = $(this).find(".songArtist").text() + " " + $(this).find(".songTitle").text();
            var duration = $(this).find(".songDuration").text();

            // if track was found by plugin, just fetch the url
            if( id.indexOf("noplugin") == -1 ){
                Mielophone.getStreamUrl(id, function(streamUrl){
                    var source = $('<source/>');
                    source.attr('type', 'audio/mpeg');
                    source.attr('src', streamUrl);
                    $("#player").append(source);
                });
            }else{
            // if track was fetched from discogs, search for url
                Mielophone.findStream(name, duration, function(streamUrl){
                    var source = $('<source/>');
                    source.attr('type', 'audio/mpeg');
                    source.attr('src', streamUrl);
                    $("#player").append(source);
                });
            }
			return false;
		});
	})();
});