var webSocket = null;
var ws_hostname = null;
var ws_port = null;
var rdElement = "";

/**
 * Event handler for clicking on button "Connect"
 */
function onConnectClick() {
  var ws_hostname = document.getElementById("hostname").value;
  var ws_port = document.getElementById("port").value;

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
      document.getElementById("btnConnect").disabled = true;
      document.getElementById("btnDisconnect").disabled = false;
      enableElements();
    };
    webSocket.onclose = function(closeEvent) {
      console.log("WebSocket CLOSE: " + JSON.stringify(closeEvent, null, 4));
      document.getElementById("btnConnect").disabled = false;
      document.getElementById("btnDisconnect").disabled = true;
      disableElements();
    };
    webSocket.onerror = function(errorEvent) {
      console.log("WebSocket ERROR: " + JSON.stringify(errorEvent, null, 4));
    };
    webSocket.onmessage = function(messageEvent) {
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
function onActionClick(elementAction, storyElement) {
  if (webSocket.readyState != WebSocket.OPEN) {
    console.error("webSocket is not open: " + webSocket.readyState);
    alert("Not connected!")
    return;
  }
  webSocket.send('{"path" : "/control/' + storyElement + '/' + elementAction + '", "args" : [1]}');
  console.log('{"path" : "/control/' + storyElement + '/' + elementAction + '", "args" : [1]}');

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
  xmlhttp.open("GET", "rundown/rundown.xml", true);
  xmlhttp.send();
}

/**
 * Create rundown
 */

function createRundown(xml) {
  //Remove existing elements
  removeElements();
  var x, i, xmlDoc, txt;
  xmlDoc = xml.responseXML;

  x = xmlDoc.childNodes[0].getElementsByTagName("remotetriggerid");

  for (i = 0; i < x.length; i++) {
    console.log("X i childnodes", x[i].childNodes);
    if (typeof x[i].childNodes[0] !== "undefined") {
      rdElement = x[i].childNodes[0].nodeValue;

      //Append to "media_elements"
      var node = document.getElementById("media_elements")
      //node.appendChild(button);
      //node.innerHTML += "<br />";
      storyElement = rdElement
      node.innerHTML += '<div class="col s12">' +
        '<div class="card-panel grey lighten-5">' +
        '    <div class="col s8" style="font-size: 24px; margin-top: -18px;font-weight: bold;">' + rdElement + '</div>' +
        '  <div class="col s1">' +
        '      <button class="red hoverable waves-effect waves-light btn-small media"' +
        '      style="margin-top: -26px; padding-left: 6px; padding-right: 6px" onclick="onActionClick(' + "'" + 'stop' + "'" + ',' + "'" + storyElement + "'" + ')">Stop</button>' +
        '    </div>' +
        '    <div class="col s1">' +
        '      <button class="red hoverable waves-effect waves-light btn-small media"' +
        '      style="margin-top: -26px; padding-left: 6px; padding-right: 6px" onclick="onActionClick(' + "'" + 'play' + "'" + ',' + "'" + storyElement + "'" + ')">Play</button>' +
        '    </div>' +
        '    <div class="col s1">' +
        '      <button class="red hoverable waves-effect waves-light btn-small media"' +
        '     style="margin-top: -26px; padding-left: 6px; padding-right: 6px" onclick="onActionClick(' + "'" + 'load' + "'" + ',' + "'" + storyElement + "'" + ')">Load</button>' +
        '    </div>' +
        '    <div class="col s1">' +
        '      <button class="red hoverable waves-effect waves-light btn-small media"' +
        '     style="margin-top: -26px; padding-left: 6px; padding-right: 6px" onclick="onActionClick(' + "'" + 'pause' + "'" + ',' + "'" + storyElement + "'" + ')">Pause</button>' +
        '    </div>' +
        '  </div>' +
        '  </div>' +
        ' </div>';

    }
  }
  //Check if it should be disabled
  if (webSocket == null) {
    disableElements();
  } else {
    if (webSocket.readyState != WebSocket.OPEN) {
      disableElements();
    }
  }
}

//Remove elements with class media
function removeElements() {
  var paras = document.getElementsByClassName('media');

  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  document.getElementById("media_elements").innerHTML = "";
}

function enableElements() {
  var elements = document.getElementsByClassName("media");
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = false;
  }
}

function disableElements() {
  var elements = document.getElementsByClassName("media");
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = true;
  }
}
