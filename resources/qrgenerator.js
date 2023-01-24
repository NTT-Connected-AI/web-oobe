var qrcode = []
function generateQR(){

	//Clear any previous QRs:
	document.getElementById("qrintro").innerHTML = "&nbsp;";
	for (i=0;i<qrcode.length;i++){
		document.getElementById("qrcode" + i).innerHTML = "";
	}

	// Recover all the strings from the site
	var wifiname = document.getElementById("wifiname").value;
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var security = document.getElementById("wifi_type").value;

	var ip = document.getElementById("ip").value;
	var subnetMask = document.getElementById("subnetMask").value;
	var router = document.getElementById("router").value;
	var dns1 = document.getElementById("dns1").value;
	var dns2 = document.getElementById("dns2").value;

	var advanced = false;

	if (ip !== '' && subnetMask !== '' && router !== '' && dns1 !== '' && dns2 !== '')
		advanced = true;

	if(oobeSelected){
		var token = document.getElementById("oobe_token").innerHTML; //THIS TOKEN IS THE TOKEN RETRIEVED WHEN CALLING JIBO OOBE PREPARE ROBOT
	}else{
		var token = "JiboLives"; 
	}
	var stringToEncode = "";
	 
	if(security === "WPA-EAP"){ // YOU CAN ONLY USED THIS WHEN OOBE HAS ALREADY BE DONE, SO SECURITY OPTION WILL ALWAYS BE SENT
		if (!advanced){
			stringToEncode = wifiname + "\n" + security + "\n" + password + "\n" + username + "\n" + token;
		} else {
			stringToEncode = wifiname + "\n" + security + "\n" + password + "\n" + username + "\n" + ip + "\n" + subnetMask + "\n" + router + "\n" + dns1 + "\n" + dns2 + "\n" + token;
		}
	}
	if(security === "WPA-PSK"){
		if(oobeSelected){ //OBE WAS SELECTED SO WE WONT ADD SECURITY FIELD TO QR
			if (!advanced){
				stringToEncode = wifiname + "\n" + password + "\n" + token; //NOT ADDING SECURITY SINCE ALREADY FLASHED ROBOTS WON'T HAVE THIS FUNCTIONALITY
			} else {
				stringToEncode = wifiname + "\n" + password + "\n" + ip + "\n" + subnetMask + "\n" + router + "\n" + dns1 + "\n" + dns2 + "\n" + token;
			}
		}else{ // OOBE WASNT SELECTED SO WE WILL ADD SECURITY FIELD TO QR
			if (!advanced){
				stringToEncode = wifiname + "\n" + security + "\n" + password + "\n" + token;
			} else {
				stringToEncode = wifiname + "\n" + security + "\n"  + password + "\n" + ip + "\n" + subnetMask + "\n" + router + "\n" + dns1 + "\n" + dns2 + "\n" + token;
			}
		}
	}
	
	console.log(stringToEncode);
	text = "V293LCB5b3UgY3JhY2tlZCBvdXIgc2VjcmV0IGNvZGUuIEltcHJlc3NpdmUuIE1heWJlIHlvdSBzaG91bGQgY2hlY2sgb3V0IGppYm8uY29tL2pvYnMu";
    encodedData = xorString(stringToEncode, atob(text));

    //Split data into as many QR codes as needed
	var maxChunk = 50;
    var estimatedQtyOfCodes = Math.ceil(encodedData.length / maxChunk);
    var estimatedBytesPerCode = Math.ceil(encodedData.length / estimatedQtyOfCodes);

    var tmp=breakChunks(encodedData,estimatedBytesPerCode);

    var result = [];

    if (tmp.length === 1){
    	document.getElementById("qrintro").innerHTML = "Please show Jibo the following QR code";
    }else if (tmp.length > 1){
    	document.getElementById("qrintro").innerHTML = "Please show Jibo the following " + tmp.length + " QR codes in order";
    }
    
    for (i = 0; i < tmp.length; i++) {
     
        result[i] = (i+1) + "/" + tmp.length + "\n" + tmp[i];
        qrcode[i] = new QRCode("qrcode" + i, {
    				text: result[i],
    				width: 300,
    				height: 300,
    				colorDark : "#000000",
    				colorLight : "#ffffff",
    				correctLevel : QRCode.CorrectLevel.L
		});
		let element = document.getElementById("qrcode" + i);
		element.style.display = "block";
    }
    
    return;

}

function xorString(str, key){
    var result = '';
    for(var i = 0; i < str.length; i++) {
        result += String.fromCharCode(key.charCodeAt(i % key.length) ^ str.charCodeAt(i));
    }
    return result;
}


function breakChunks(string,length){
	return string.match(new RegExp('(.|[\r\n]){1,' + length + '}', 'g'));
}