let user_data = {};

GetVpa();

let intervalID = "";
let intervalID1 = "";

function addDelay(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
	  currentDate = Date.now();
	} while (currentDate - date < milliseconds);
  }

function hdfcPgHandler() {
	
	    intervalID = setInterval(function(){
		if(!IsInPrograss())
		{
				console.log("HDFC bank startt");
/* 				document.querySelectorAll(".payment_mode")[0].click();
				addDelay(200);
				document.querySelectorAll("#other_debit")[0].click(); */

		}

		},200);

		intervalID1 = setInterval(function(){
			if(!IsInPrograss1())
			{
					console.log("Fill data start");				
					const cardno = document.getElementById("card_no");
					cardno.value = user_data["other_preferences"]["cardnumber"];
					cardno.dispatchEvent(new Event("input"));
					cardno.dispatchEvent(new Event("change"));		
					
				
					const name = document.getElementById("name");
					name.value = user_data["other_preferences"]["cardholder"];
					name.dispatchEvent(new Event("input"));
					name.dispatchEvent(new Event("change"));
			
					const OtherDebitcvvHideShow = document.getElementById("other_debit_cvv_no");
					OtherDebitcvvHideShow.value = user_data["other_preferences"]["cardcvv"];
					OtherDebitcvvHideShow.dispatchEvent(new Event("input"));
					OtherDebitcvvHideShow.dispatchEvent(new Event("change"));
					console.log('exp Month',user_data["other_preferences"]["cardexpiry"].split('/')[0]);
					console.log('exp Year',user_data["other_preferences"]["cardexpiry"].split('/')[1]);
					const cardexp = user_data["other_preferences"]["cardexpiry"];
					const expmonth = document.getElementById("expMonthSelect");
					expmonth.value = Number(user_data["other_preferences"]["cardexpiry"].split('/')[0]);
					expmonth.dispatchEvent(new Event("input"));
					expmonth.dispatchEvent(new Event("change"));

					const expYearSelect = document.getElementById("expYearSelect");
					expYearSelect.value = "20" + user_data["other_preferences"]["cardexpiry"].split('/')[1];
					expYearSelect.dispatchEvent(new Event("input"));
					expYearSelect.dispatchEvent(new Event("change"));
					
					///captcha text field id capacha
					///captcha img id captcha_image
					//console.log(document.getElementById('capacha'));
					//console.log(document.getElementById('captcha_image').src);
					getCaptcha();	
					console.log("END");
	
			}
			},200);
}

function IsInPrograss()
{
	console.log("wait for page");
	document.querySelectorAll(".payment_mode")[0].click();
	addDelay(200);
	document.querySelectorAll("#other_debit")[0].click();

	if(document.getElementById("captchaDiv").style.display != "none")
	{
		console.log("Page loaded.");
		clearInterval(intervalID);
		return false;
	}
	return true;
}

function IsInPrograss1()
{
	console.log("wait for captcha page");
	if(document.getElementById("captchaDiv").style.display != "none")
	{
		console.log("captcha Page loaded.");
		clearInterval(intervalID1);
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
		hdfcPgHandler();
		
	} else {
			document.addEventListener('DOMContentLoaded', function () {
			hdfcPgHandler();
		});
	}

  });
  
}

function getCaptcha()
{
	console.log("getCaptcha");
	const captchaImg = document.getElementById('captcha_image');
	if (!captchaImg){
		console.log("wait for captcha load");
		setTimeout(() => {
			getCaptcha();	
		}, 1000);
	}				
	else{
		fetch(captchaImg.src)
        .then((res) => res.blob())
        .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
					const image_data=reader.result;
					const image_data1 = image_data.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");				
					const url = "https://api.apitruecaptcha.org/one/gettext";
					const params = {			
					userid:'nandkumarsh222@gmail.com',
					apikey:'hW6X7tAP8nMtDRpaQk2m',
					data:   image_data1,
					}
					fetch(url, {
					method: 'post',
					body: JSON.stringify(params)
					})
					.then((response) => response.json())
					.then((data) => {
						console.log(data);					
						const captchaTextField = document.getElementById('capacha');
						const captchaText = data.result;
						console.log('Decoded captcha',captchaText);	
						if (captchaText == ""){
							console.log("Null captcha text from api");
							document.getElementById('reload').click();							
							setTimeout(() => {
								getCaptcha();	
							}, 500);				
							}					
						captchaTextField.value = captchaText.split(" ").join("");
						captchaTextField.dispatchEvent(new Event("input"));
						captchaTextField.dispatchEvent(new Event("change"));
						captchaTextField.focus();
						
						document.getElementById("submit_btn").click();
					});
				
					};
			reader.readAsDataURL(blob);
			});		
		}
}

