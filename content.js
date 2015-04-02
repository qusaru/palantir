var window = window;

window.onclick = function()
{
	var servers =
	{
		iceServers:
		[
			{
				url: 'stun:stun.l.google.com:19302'
			}
		]
	};

	var channelReceive, channelSend;

	var local = new webkitRTCPeerConnection
	(
		servers,
		{
			optional:
			[
				{
					RtpDataChannels: true
				}
			]
		}
	);

	var remote = new webkitRTCPeerConnection
	(
		servers,
		{
			optional:
			[
				{
					RtpDataChannels: true
				}
			]
		}
	);

	local.onicecandidate = function(event)
	{
		if(event.candidate)
		{
			window.console.log('ice local');
			window.console.log(event.candidate.candidate);
			remote.addIceCandidate(event.candidate);
		}
	};

	remote.onicecandidate = function(event)
	{
		if(event.candidate)
		{
			window.console.log('ice remote');
			window.console.log(event.candidate.candidate);
			local.addIceCandidate(event.candidate);
		};
	};

	local.ondatachannel = function(event)
	{
		channelSend = event.channel;
		channelSend.onmessage = function(event)
		{
			window.console.log(event.data);
		};
	};

	remote.ondatachannel = function(event)
	{
		channelReceive = event.channel;
		channelReceive.onmessage = function(event)
		{
			window.console.log(event.data);
		};
	};

	var send = local.createDataChannel
	(
		'send',
		{
			reliable: false
		}
	);

	send.onopen = function(event)
	{
		if(send.readyState == 'open')
		{
			send.send('hi');
		};
	};

	local.createOffer
	(
		function(description)
		{
			local.setLocalDescription(description);
			remote.setRemoteDescription(description);
			remote.createAnswer
			(
				function(description)
				{
					remote.setLocalDescription(description);
					local.setRemoteDescription(description);
				}
			);
		}
	);

	window.console.log('click');
};