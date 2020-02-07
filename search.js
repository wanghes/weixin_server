const express = require('express'); 
const noble = require('noble');
const BeaconScanner = require('node-beacon-scanner');


var app = express(); //实例express框架

app.get('/', function(req, res) {
	noble.on('stateChange', function(state) {
	  if (state === 'poweredOn') {
	    noble.startScanning();
	  } else {
	    noble.stopScanning();
	  }
	});

	noble.on('discover', function(peripheral) {
	  console.log('peripheral discovered (' + peripheral.id +
	              ' with address <' + peripheral.address +  ', ' + peripheral.addressType + '>,' +
	              ' connectable ' + peripheral.connectable + ',' +
	              ' RSSI ' + peripheral.rssi + ':');
	  console.log('\thello my local name is:');
	  console.log('\t\t' + peripheral.advertisement.localName);
	  console.log('\tcan I interest you in any of the following advertised services:');
	  console.log('\t\t' + JSON.stringify(peripheral.advertisement.serviceUuids));

	  var serviceData = peripheral.advertisement.serviceData;
	  if (serviceData && serviceData.length) {
	    console.log('\there is my service data:');
	    for (var i in serviceData) {
	      console.log('\t\t' + JSON.stringify(serviceData[i].uuid) + ': ' + JSON.stringify(serviceData[i].data.toString('hex')));
	    }
	  }
	  if (peripheral.advertisement.manufacturerData) {
	    console.log('\there is my manufacturer data:');
	    console.log('\t\t' + JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')));
	  }
	  if (peripheral.advertisement.txPowerLevel !== undefined) {
	    console.log('\tmy TX power level is:');
	    console.log('\t\t' + peripheral.advertisement.txPowerLevel);
	  }

	  console.log();
	});
	res.send("home");
});

app.get('/test', function(req,res) {
	// const scanner = new BeaconScanner();
	const scanner = new BeaconScanner({'noble': noble});


	// Set an Event handler for becons
	scanner.onadvertisement = (ad) => {
	  console.log(JSON.stringify(ad, null, '  '));
	};

	// Start scanning
	scanner.startScan().then(() => {
	  console.log('Started to scan.');
	}).catch((error) => {
	  console.error(error);
	});

	res.send("test");
});

//监听3000端口
app.listen(80, '0.0.0.0', () => {
    console.log('server is running');
});
