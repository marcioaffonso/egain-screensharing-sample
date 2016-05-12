var apiKey,
    sessionId,
    token,
    session;

$(document).ready(function() {
  
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  $.get(SERVER_BASE_URL + '/session', function(res) {
    apiKey = res.apiKey;
    sessionId = res.sessionId;
    token = res.token;

    initializeSession();
  });

  ZeroClipboard.destroy();
  ZeroClipboard.config( { swfPath: "flash/ZeroClipboard.swf" } );

});

function initializeSession() {
  
  session = OT.initSession(apiKey, sessionId);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (!error) {
      $('#btn-screenshare').show();
    } else {
      console.log('There was an error connecting to the session: ', error.code, error.message);
    }
  });
}

function startScreensharing() {

  var publisher = OT.initPublisher('publisher', {
    videoSource: 'screen',
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, function(error){
    if(!error) {
      var customer_url = CUSTOMER_PAGE + '?sessionId=' + sessionId;
      setClipboard($('#btn-copy-url'), customer_url);
      $('#btn-copy-url').show();
    }
    else {
      console.log('There was an error publishing: ', error.code, error.message);
    }
  });

  session.publish(publisher);
  $('#btn-screenshare').hide();
}

function setClipboard(element, text) {
  $(element).attr('data-clipboard-text', text);
  var clip = new ZeroClipboard(element);
  clip.on( "aftercopy", function( event ) {
    alert("Copied to clipboard!");
  });
}