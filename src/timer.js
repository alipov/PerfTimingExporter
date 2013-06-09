(function() {
    (function waitForCompletion() {
        if(document.readyState == "complete")
            chrome.runtime.sendMessage(performance.timing);
        else
            setTimeout(waitForCompletion, 300);
    })();
})();