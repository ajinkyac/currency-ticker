export class Constants {
	static get STOMP_URL() {
		return 'ws://localhost:8011/stomp';
	};

	static get STOMP_CLIENT() {
		var client = Stomp.client(Constants.STOMP_URL);
		client.heartbeat.outgoing = 10000000;
		client.heartbeat.incoming = 10000000;
		return client;
	}
}
