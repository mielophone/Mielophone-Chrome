require(["../data/include", "../plugins/include", "templates"], function(){
	(function() {
        // precompile templates
        var songTemplate =  Handlebars.templates.song,
            container = $("#container"),
            songsContainer = $("#songs");

		// bind actions
		$("#search").keydown(function(e){
			if(e.which == 13){
                songsContainer.empty();
                // search
				var query = $("#search").val();
				window.plugins[0].query(query, function(data){
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

            var i, j, plugin, item, found = false;
            for(i in window.plugins){
                plugin = window.plugins[i];
                for(j in plugin.songs){
                    item = plugin.songs[j];
                    if(item.id == id){
                        found = true;
                        break;
                    }
                }

                if(found) break;
            }

            plugin.getStreamUrl(item.url, function(streamUrl){
                var source = $('<source/>');
                source.attr('type', 'audio/mpeg');
                source.attr('src', streamUrl);
                $("#player").append(source);
            });
			return false;
		});
	})();
});