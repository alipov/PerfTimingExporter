var logFileWriter = null;

function initFs(fs) {

  	fs.root.getFile('logFileForChrome.txt', {create: true}, function(fileEntry) {

	    fileEntry.createWriter(function(writer) {  // FileWriter

    		logFileWriter = writer;

	        writer.onwrite = function(e) {
	          //console.log('Write completed.');
	        };

	        writer.onerror = function(e) {
	          console.log('Write failed: ' + e);
	        };
    	}, errorHandler);
  	});
}

function errorHandler(e) {
  var msg = '';
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log("errorHandler: " + msg);
}

window.webkitRequestFileSystem(
  PERSISTENT,         // persistent vs. temporary storage
  5 * 1024 * 1024,    // size (bytes) of needed space
  initFs,             // success callback
  errorHandler        // opt. error callback, denial of access
);

chrome.runtime.onMessage.addListener(
  function(t, sender, sendResponse) {

  	// query is async, according to:
  	chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
  	var tab = tabs[0];
		var tabUrl = tab.url;

    if (t.loadEventEnd > 0) {

        var record = String("\n");
        record += tabUrl + " ";
        record += t.navigationStart + " ";
        record += t.unloadEventStart + " ";
        record += t.unloadEventEnd + " ";
        record += t.redirectStart + " ";
        record += t.redirectEnd + " ";
        record += t.fetchStart + " ";
        record += t.domainLookupStart + " ";
        record += t.domainLookupEnd + " ";
        record += t.connectStart + " ";
        record += t.connectEnd + " ";
        record += t.secureConnectionStart + " ";
        record += t.requestStart + " ";
        record += t.responseStart + " ";
        record += t.responseEnd + " ";
        record += t.domLoading + " ";
        record += t.domInteractive + " ";
        record += t.domContentLoadedEventStart + " ";
        record += t.domContentLoadedEventEnd + " ";
        record += t.domComplete + " ";
        record += t.loadEventStart + " ";
        record += t.loadEventEnd;

    		var blob = new Blob([record], {type: 'text/plain'});
    		logFileWriter.seek(logFileWriter.length);
    		logFileWriter.write(blob);
      }
	});
});