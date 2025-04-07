let user_data = {};

function fillVPA() {

    console.log('fillVPA');

    var int = setInterval(function() {
        if (document.getElementById('vpaInput')) {
            clearInterval(int);
            vpa = document.getElementById('vpaInput');
            vpa.value = user_data["vpa"]["vpa"];
            vpa.dispatchEvent(new Event('keyup', {
                bubbles: true
            }));
            vpa.dispatchEvent(new Event('input', {
                bubbles: true
            }));
            vpa.dispatchEvent(new Event('change', {
                bubbles: true
            }));
            document.querySelectorAll('#container > div > div > div > div > div > undefined > div')[0].firstChild.click();
            var payint = setInterval(() => {
                if (document.querySelectorAll('button').length > 0) {
                    document.querySelectorAll('button')[0].click();
                    clearInterval(payint);
                }
            }, 500);
        }
    }, 500);

}

chrome.storage.local.get(null, (result) => {
    user_data = result;

   if ( user_data["other_preferences"]["paymentmethod"] == "PHONEPEUPIID" ||user_data["other_preferences"]["paymentmethod"] == "MOBUPIID")
    {
	if (document.readyState !== 'loading') {
		fillVPA();
		
	} else {
			document.addEventListener('DOMContentLoaded', function () {
                fillVPA();
		});
	}
    }

    if (user_data["other_preferences"]["paymentmethod"] == "PHONEPEUPIQR")
    {
        var showQR = setInterval(() => {
            if (document.body.innerHTML.includes('SHOW CODE')) {
                if (document.getElementsByTagName('button')[0].innerText.includes('SHOW CODE')) {
                    clearInterval(showQR);
                    document.getElementsByTagName('button')[0].click();
                }
            }
        }, 300);
    }

  });