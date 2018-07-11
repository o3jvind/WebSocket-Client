var webSocket   = null;
var ws_hostname = null;
var ws_port     = null;

/**
 * Event handler for clicking on button "Connect"
 */
function onConnectClick() {
    var ws_hostname = document.getElementById("hostname").value;
    var ws_port     = document.getElementById("port").value;
	
	openWSConnection(ws_hostname, ws_port);
}
/**
 * Event handler for clicking on button "Disconnect"
 */
function onDisconnectClick() {
    webSocket.close();
}
/**
 * Open a new WebSocket connection using the given parameters
 */
function openWSConnection(hostname, port) {
    var webSocketURL = null;
    webSocketURL = "ws://" + hostname + ":" + port + "/";
    console.log("openWSConnection::Connecting to: " + webSocketURL);
    try {
        webSocket = new WebSocket(webSocketURL);
        webSocket.onopen = function(openEvent) {
            console.log("WebSocket OPEN: " + JSON.stringify(openEvent, null, 4));
            //document.getElementById("btnSend").disabled       = false;
            document.getElementById("btnConnect").disabled    = true;
            document.getElementById("btnDisconnect").disabled = false;
			var elements = document.getElementsByClassName("media"); 
             for (var i = 0; i < elements.length; i++) { 
             elements[i].disabled = false;
			}
        };
        webSocket.onclose = function (closeEvent) {
            console.log("WebSocket CLOSE: " + JSON.stringify(closeEvent, null, 4));
            //document.getElementById("btnSend").disabled       = true;
            document.getElementById("btnConnect").disabled    = false;
            document.getElementById("btnDisconnect").disabled = true;
			var elements = document.getElementsByClassName("media"); 
             for (var i = 0; i < elements.length; i++) { 
             elements[i].disabled = true;
			}
        };
        webSocket.onerror = function (errorEvent) {
            console.log("WebSocket ERROR: " + JSON.stringify(errorEvent, null, 4));
        };
        webSocket.onmessage = function (messageEvent) {
            var wsMsg = messageEvent.data;
            console.log("WebSocket MESSAGE: " + wsMsg);
            if (wsMsg.indexOf("error") > 0) {
                document.getElementById("incomingMsgOutput").value += "error: " + wsMsg.error + "\r\n";
            } else {
                document.getElementById("incomingMsgOutput").value += "message: " + wsMsg + "\r\n";
            }
        };
    } catch (exception) {
        console.error(exception);
    }
}
/**
 * Send a message to the WebSocket server
 */
function onSendClick(txt) {
    if (webSocket.readyState != WebSocket.OPEN) {
        console.error("webSocket is not open: " + webSocket.readyState);
        return;
    }
    webSocket.send('{"path" : "/control/' + txt + '/play", "args" : [1]}');
	}

/**
 * Load rundown
 */
	
function loadXMLDoc() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      createRundown(this);
    }
  };
  xmlhttp.open("GET", "rundown/WS_test.xml", true);
  xmlhttp.send();
}

/**
 * Create rundown
 */

function createRundown(xml) {
	
 var x, i, xmlDoc, txt;
  xmlDoc = xml.responseXML;
  txt = "";
  x = xmlDoc.childNodes[0].getElementsByTagName("remotetriggerid");
  
  for (i = 0; i< x.length; i++) {
    txt = x[i].childNodes[0].nodeValue;
	// 1. Create a button
	var button = document.createElement("button");
	button.innerHTML = txt;
	button.setAttribute("id", txt);
	button.setAttribute("value", txt);
	button.setAttribute("class", "media")
	// 2. Append somewhere
	var body = document.getElementsByTagName("body")[0];
    body.appendChild(button);
	linebreak = document.createElement("br");
	body.appendChild(linebreak);
	// 3. Add event handler
    document.getElementById(txt).addEventListener("click", function(){
	onSendClick(this.value);

});
  }
 }