# Webrtc example
Basic WebRTC Implementation 

# Steps

Person A:

- Click on start channel
- Wait for SDP Gathering state to change to completed.
- Copy SDP and share with your partner Person B

Person B:
- Click on Connect
- Paste SDP from Person A in join info
- Click on join
- Wait for SDP Gathering state to change to completed.
- Copy SDP and share with your partner Person A

Person A:
- Paste SDP from Person B in start info
- Click on Start
- Check connection status. If it's connected
- Start Chatting 😁😁


Note: As Webrtc works Peer to Peer, it may fails depending on network configuration mainly if your Router is configured with Symmertic NAT.
