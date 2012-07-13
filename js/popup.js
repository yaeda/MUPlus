$(function() {
    var BASE_URL = "https://music.sonyentertainmentnetwork.com/"
    var MATCH_URL = BASE_URL + "*";
    var muTab = null;

    var createCommand = function(btn_index) {
        return "var btn = document.getElementsByTagName('img')[" + btn_index + "]; btn.click();";
    }

    var sendCommand = function(command, callback) {
        /*
        chrome.tabs.query(
            {url: "https://music.sonyentertainmentnetwork.com/*"},
            function(response){
                chrome.tabs.executeScript(response[0].id, {code: command}, function(response) {
                    if (typeof callback === 'function') callback(response);
                });
            }
        );
        */
        chrome.tabs.executeScript(muTab.id, {code: command}, function() {
            if (typeof callback === 'function') callback();
        });
    }

    var activate = function(tab) {
        muTab = tab;
        $('.btn').removeClass('disabled');
    }

    var deactivate = function() {
        muTab = null;
        $('.btn').addClass('disabled');
        $('#home').removeClass('disabled');
    }

    // tab check
    chrome.tabs.query(
        {url: MATCH_URL},
        function(response){
            if (response.length) {
                activate(response[0]);
            } else {
                deactivate();
            }
        }
    );

    // Maybe following 'addListener's are not needed,
    // because lifetime of this pop is very short.
    chrome.tabs.onRemoved.addListener(function(tabId) {
        if (muTab.id === tabId) deactivate();
    });

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (muTab) return;
        var url = changeInfo.url;
        if (url && url.match(MATCH_URL)) activate(tab);
    });

    // clicke event handling
    $('#backward').on('click', function() {
        if (muTab) sendCommand(createCommand(1), function() {window.close();});
    });
    $('#play').on('click', function() {
        if (muTab) sendCommand(createCommand(2), function() {window.close();});
    });
    $('#forward').on('click', function() {
        if (muTab) sendCommand(createCommand(3), function() {window.close();});
    });
    $('#home').on('click', function() {
        if (muTab) {
            // move MU page
            chrome.tabs.update(muTab.id, {active: true}, function() {window.close();});
        } else {
            // open MU page
            chrome.tabs.create({url: BASE_URL, active: true}, function(){window.close();});
        }
    });
})