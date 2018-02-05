require('./site/index.html');
require('./site/style.css');
require('./es6/constants.js');

const CurrencyApp = require('./es6/app.js');
const currencyApp = new CurrencyApp();

currencyApp.init();

/*
	Subscribe to currency price updates received from Stomp frames.
	@param {string} topic - Topic to which the observer is subscribed to.
	@param {function} callback - subscription callback that gets executed when the observable notifies the observer.
 */
currencyApp.subscribe('prices', function(data) {
	let table = document.getElementsByClassName('currencyTable')[0],
		rows = table.rows,
  		counter = rows.length;

  	// Removes the rows before replacing them
  	while (--counter) {
    	rows[counter].parentNode.removeChild(rows[counter]);
  	}

  	let i = 0,
  		dataLength = data.length;

  	// Fetch the template document fragment and replace the inner text with the fetched values.
	for (; i < dataLength; i++) {
		let templateRow = document.getElementById('templateRow').content.cloneNode(true);

		templateRow.querySelector('.currency-name').innerText = data[i].name;
		templateRow.querySelector('.currency-best-bid').innerText = data[i].bestBid.toFixed(2);
		templateRow.querySelector('.currency-best-ask').innerText = data[i].bestAsk.toFixed(2);
		templateRow.querySelector('.currency-open-bid').innerText = data[i].openBid.toFixed(2);
		templateRow.querySelector('.currency-open-ask').innerText = data[i].openAsk.toFixed(2);
		templateRow.querySelector('.currency-last-change-ask').innerText = data[i].lastChangeAsk.toFixed(2);
		templateRow.querySelector('.currency-last-change-bid').innerText = data[i].lastChangeBid.toFixed(2);

		const exampleSparkline = templateRow.querySelector('.currency-table-sparkline')
		Sparkline.draw(exampleSparkline, data[i].sparkLine);

		table.tBodies[0].appendChild(templateRow);
	}

}, this);