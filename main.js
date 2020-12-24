const rtcConnection = new RTCPeerConnection();
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
}

function startChannel() {
    dc = rtcConnection.createDataChannel("Channel");
    setDataChannel();
    rtcConnection.createOffer().then(offer => rtcConnection.setLocalDescription(offer)).then(e => console.log("set offer successfully", e));
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
    rtcConnection.setRemoteDescription(offer).then(e => console.log("Offer set"));
    rtcConnection.createAnswer().then(ans => rtcConnection.setLocalDescription(ans)).then(e => console.log("Answer created", e));
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
