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
    console.log("New ice candiate found!! Reprinting sdp", JSON.stringify(rtcConnection.localDescription))
    document.getElementById("icecandidate").innerText = JSON.stringify(rtcConnection.localDescription);
};

rtcConnection.ondatachannel = e => {
    dc = e.channel;
    setDataChannel();
};

function setDataChannel() {
    dc.onmessage = e => {
        console.log("New Message", e.data);
        const li = document.createElement('li');
        li.innerText = `Remote: ${JSON.stringify(e.data)}`;
        document.getElementById("msg_list").appendChild(li);
    };
    dc.onopen = e => {
        console.log("Connection Open", e);
        document.getElementById("connection_status").innerText = "Connection Open";
    };
    dc.onclose = e => {
        console.log("Connection Closed", e);
        document.getElementById("connection_status").innerText = "Connection Closed";
    };
    dc.onerror = e => {
        error(e)
        console.error("Data channel error", e);
    }
}

function startChannel() {
    dc = rtcConnection.createDataChannel("Channel");
    setDataChannel();
    rtcConnection.createOffer()
        .then(offer => rtcConnection.setLocalDescription(offer))
        .then(e => console.log("set offer successfully", e))
        .catch(e => {
            error(e);
            console.error("Error while setting offer");
        });
    document.getElementById("start_info").classList.remove('hidden');
    document.getElementById("join_info").classList.add('hidden');
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
        .then(e => console.log("Offer set"))
        .catch(err =>{
            error(err);
            console.error("Error while setting offer", err);
        });

    rtcConnection.createAnswer()
        .then(ans => rtcConnection.setLocalDescription(ans))
        .then(e => console.log("Answer created", e))
        .catch(err => {
            console.error("Error occur while creating answer", err);
            error(err);
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
}

function error(err) {
    const error_msg = JSON.stringify(err);
    document.getElementById('last_error').innerText = error_msg;
    const li = document.createElement('li');
    li.innerText = `${Date.now().toLocaleString()} ${error_msg}`;
    document.getElementById('error_list').appendChild(li);
}
