const config = {
    iceServers: [
        {
            urls: ["stun:stun.l.google.com:19302"]
        }
    ]
};
const rtcConnection = new RTCPeerConnection(config);
let dc;

rtcConnection.onicecandidate = e => {
    logEvent(`New ice candiate found!! Reprinting sdp. ${JSON.stringify(rtcConnection.localDescription)}`);
    document.getElementById("icecandidate").innerText = JSON.stringify(rtcConnection.localDescription);
};

rtcConnection.onicegatheringstatechange = e => {
    logEvent(`ICE gathering state change to: ${rtcConnection.iceGatheringState.toString()}`);
    document.getElementById("ic_gathering_state").innerText = rtcConnection.iceGatheringState.toString();
}

rtcConnection.oniceconnectionstatechange = e => {
    logEvent(`ICE Connection state change to ${rtcConnection.iceConnectionState.toString()}`);
}

rtcConnection.onconnectionstatechange = e => {
    logEvent(`Connection state changes to ${rtcConnection.connectionState.toString()}`);
    document.getElementById("connection_status").innerText = `Connection ${rtcConnection.iceConnectionState.toString()}`;
}

rtcConnection.ondatachannel = e => {
    dc = e.channel;
    setDataChannel();
};

function setDataChannel() {
    dc.onmessage = e => {
        logEvent(`New Message: ${e.data}`);
        const li = document.createElement('li');
        li.innerText = `Remote: ${JSON.stringify(e.data)}`;
        document.getElementById("msg_list").appendChild(li);
    };
    dc.onopen = e => {
        logEvent("Data channel open");
    };
    dc.onclose = e => {
        logEvent("Data channel closed");
    };
    dc.onerror = e => {
        logEvent(`Data channel error : ${e}`, true);
    }
}

function startChannel() {
    dc = rtcConnection.createDataChannel("Channel");
    setDataChannel();
    rtcConnection.createOffer()
        .then(offer => rtcConnection.setLocalDescription(offer))
        .then(e => logEvent(`Offer successfully:  ${JSON.stringify(e)}`))
        .catch(e => {
            logEvent(`Error while creating/setting offer: ${JSON.stringify(e)}`, true);
        });
    document.getElementById("start_info").classList.remove('hidden');
    document.getElementById("join_info").classList.add('hidden');
    document.getElementById('btn_connect').classList.add('hidden');
}

function start() {
    const answer_str = document.getElementById("answer").value;
    const answer = JSON.parse(answer_str);
    rtcConnection.setRemoteDescription(answer);
}

function joinChannel() {
    const offer_str = document.getElementById("offer").value;
    const offer = JSON.parse(offer_str);
    rtcConnection.setRemoteDescription(offer)
        .then(e => logEvent(`Remote offer set: ${JSON.stringify(e)}`))
        .catch(err => {
            logEvent(`Error while setting remote offer: ${err}`, true);
        });

    rtcConnection.createAnswer()
        .then(ans => rtcConnection.setLocalDescription(ans))
        .then(e => logEvent(`Answer created successfully ${JSON.stringify(e)}`))
        .catch(err => {
            logEvent(`Error occur while creating answer:, ${err}`, true);
        });
}

function sendMessage() {
    const msg = document.getElementById("msg_input").value;
    dc.send(msg);
    document.getElementById("msg_input").value = "";
    const li = document.createElement('li');
    li.innerText = `You: ${msg}`;
    document.getElementById("msg_list").appendChild(li);
}

function connect() {
    document.getElementById("start_info").classList.add('hidden');
    document.getElementById("join_info").classList.remove('hidden');
    document.getElementById('btn_start_channel').classList.add('hidden');
}

function logEvent(event, isError = false) {
    const event_msg = JSON.stringify(event);
    if (isError) {
        document.getElementById('last_error').innerText = event_msg;
        document.getElementById('last_error').style.color = 'red';
    }

    const li = document.createElement('li');
    li.innerText = `${Date.now().toString()}: ${event_msg}`;
    if (isError) {
        li.style.color = 'red';
    }
    document.getElementById('event_list').appendChild(li);
    isError ? console.error(li.innerText) : console.log(li.innerText);
}
