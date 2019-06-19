Date.prototype.addDays = function(days) {
        var date = new Date(this);
        date.setDate(date.getDate() + parseInt(days));
        return date;
};
Date.prototype.trimDay = function() {
        return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};

chrome.browserAction.onClicked.addListener(function(tab){
        var today = new Date().trimDay();
        chrome.tabs.create({
                "url": SCRIPT_APP_URL + "?from=" + today.addDays(-6).toISOString() + "&to=" + today.addDays(1).toISOString(),
        });
})