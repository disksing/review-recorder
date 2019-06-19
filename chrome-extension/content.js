var titleMatches = document.title.match(/^(.*) by (.*) · Pull Request #(.*) · (.*)$/);
if (titleMatches.length == 5) {
    var title = titleMatches[1], author = titleMatches[2], pr = titleMatches[3], project = titleMatches[4];
    var url = "https://github.com/"+project+"/pull/"+pr;
    if (author != IGNORE_AUTHOR_ID) {
        var reviewing = false;
        function update(e) {
            if (!reviewing && window.location.href.indexOf("pull/"+pr+"/files") > 0) {
                reviewing = true;
            }
        }
        document.onkeypress = update;
        document.onscroll = update;
        document.onclick = update;
        (function save() {
            if (reviewing) {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", SCRIPT_APP_URL, true);
                xhr.setRequestHeader('content-type', 'application/json');
                xhr.send(JSON.stringify([new Date().toISOString(), title, author, project, pr, url]));
                reviewing = false;
            }
            setTimeout(save, RECORD_INTERVAL);
        })()
    }
}
