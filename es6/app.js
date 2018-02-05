/*
	The CurrencyApp class connects and listens to WebSockets via Stomp.
	It subscribes to data change pushed by the messaging server, lets the consumer
	of the class subscribe to topic and publishes data to the consumer.
 */

import { Constants } from './constants';

class CurrencyApp {
	constructor() {
		this.stomp_url = Constants.STOMP_URL;
		this.stomp_client = Constants.STOMP_CLIENT;
		this.currencyPairs = [];
		this.handlers = [];
	}

	subscribe(event, handler, context) {
		if (typeof context === 'undefined') {
			context = handler;
		}

		this.handlers.push({
			event: event,
			handler: handler.bind(context)
		});
	}

	publish(event, args) {
		this.handlers.forEach((topic) => {
			if (topic.event === event) {
				topic.handler(args);
			}
		});
	}

	init() {
		this.stomp_client.connect({}, () => {
			// Connection success callback
			this.stomp_client.subscribe('/fx/prices', (result) => {
				let currencyPair = {
					bestAsk: 0,
					bestBid: 0,
					lastChangeAsk: 0,
					lastChangeBid: 0,
					name: '',
					openAsk: 0,
					openBid: 0,
					sparkLine: []
				};

				const resultBody = JSON.parse(result.body);

				if (this.currencyPairs.find(obj => obj.name === resultBody.name)) {
					Object.assign(this.currencyPairs, this.currencyPairs.map(function(el) {
						if (el.name === currencyPair.name) {
							currencyPair.sparkLine.push((currencyPair.bestBid + currencyPair.bestAsk) / 2);
							return currencyPair;
						} else {
							el.sparkLine.push((el.bestBid + el.bestAsk) / 2);
							return el;
						}
					}));
				} else {
					currencyPair.bestAsk = resultBody.bestAsk;
					currencyPair.bestBid = resultBody.bestBid;
					currencyPair.lastChangeAsk = resultBody.lastChangeAsk;
					currencyPair.lastChangeBid = resultBody.lastChangeBid;
					currencyPair.name = resultBody.name;
					currencyPair.openAsk = resultBody.openAsk;
					currencyPair.openBid = resultBody.openBid;
					currencyPair.sparkLine.push(currencyPair.bestBid + currencyPair.bestAsk / 2);

					this.currencyPairs.push(currencyPair);
				}

				this.publish('prices', this.currencyPairs);
			});
		}, (error) => {
			// Connection failure callback
			console.error('Error occured while connecting to stomp: ', error);
		});
	}
}

module.exports = CurrencyApp;