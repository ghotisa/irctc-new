let user_data = {};

GetVpa();

function addDelay(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

let intervalID = "";

function UpiVpaHandler() {
	
	    intervalID = setInterval(function(){
		if(!IsInPrograss())
		{

			if (user_data["other_preferences"]["paymentmethod"]=="IRCUPIID") {
				console.log('IRCUPIID');
				const UpiIdfield = document.getElementById("vpaCheck");
				UpiIdfield.value = user_data["vpa"]["vpa"];
				UpiIdfield.dispatchEvent(new Event("input"));
				UpiIdfield.dispatchEvent(new Event("change"));		
				addDelay(500);	
				
				clickInt = setInterval(() => {
					if ( document.getElementById("vpaCheck").value !== null || document.getElementById("vpaCheck").value !== ""  ||document.getElementById("vpaCheck").value !== 'undefined')
					{
					console.log('click VPA');
					document.getElementById("upi-sbmt").click(); clearInterval(clickInt);
					}
				}, 200);				
			}

			if (user_data["other_preferences"]["paymentmethod"]=="IRCUPIQR") {
				console.log('IRCUPIQR');
				let intClickShowQR = setInterval(() => {
					const showQRCodeButton = document.evaluate("//span[contains(text(),'Click here to pay through QR')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
					if(showQRCodeButton)
					{
						clearInterval(intClickShowQR);
						console.log('click show QR button');
						showQRCodeButton.click();
					}
				}, 500);
			}
		}

		},500);
}

function IsInPrograss()
{
	if(document.getElementById("vpaCheck"))
	{
		console.log("Page loaded.");
		clearInterval(intervalID);
		return false;
	}
	return true;
}

function GetVpa()
{
	console.log("GetVpa");
  chrome.storage.local.get(null, (result) => {
    user_data = result;

	if (document.readyState !== 'loading') {
		UpiVpaHandler();
		
	} else {
			document.addEventListener('DOMContentLoaded', function () {
			UpiVpaHandler();
		});
	}
	
  });
  
}