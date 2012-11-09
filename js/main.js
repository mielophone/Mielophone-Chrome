require([
    "../mielophone/Mielophone.js",
    "../data/include",
    "../plugins/include",
    "templates"
], function(){
	(function() {
        // init templates
        var songTemplate =  Handlebars.templates.song;

        // precache elemets
        var container = $("#container"),
            songsContainer = $("#songs");

		// bind actions
		$("#search").keydown(function(e){
			if(e.which == 13){
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