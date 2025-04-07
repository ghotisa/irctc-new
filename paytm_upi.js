let user_data = {};

function fillVPA() {
    function updateTextChange(elem, value) {
        elem.dispatchEvent(new Event('keydown', {
            bubbles: true
        }));
        elem.value = value;
        elem.dispatchEvent(new Event('keyup', {
            bubbles: true
        }));
        elem.dispatchEvent(new Event('input', {
            bubbles: true
        }));
        elem.dispatchEvent(new Event('change', {
            bubbles: true
        }));
    }
    
    try
    {
    console.log('Fill paytm VPA new');
    document.getElementById('ptm-upi').getElementsByTagName('div')[1].getElementsByTagName('div')[0].click();
    console.log('Fill paytm VPA-after click');
    var tt = setInterval(function() {
        if (document.getElementsByName('upiMode').length > 0) {
            clearInterval(tt);
            var tt2 = setInterval(function() {
                var elem = document.getElementsByName('upiMode')[0].parentNode.parentNode.parentNode.getElementsByTagName('input')[1];
                if (elem != null) {
                    clearInterval(tt2);
                    updateTextChange(elem, user_data["vpa"]["vpa"]);
                    setTimeout(function() {
                        try{
                            //document.getElementsByClassName('btn-primary')[1].click();
                            const proceedButton = document.evaluate("//span[text()='Proceed']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                console.log('click proceedButton');
                                proceedButton.click();
                        }
                        catch(err) {
                            console.error(err);
                            alert('Unable to request UPI payment. Please proceed manually');
                          }

                    }, 500);
                }
            }, 100);
        }
    }, 500);
    }
    catch(err) 
    {
        console.error(err);
        alert('Unable to request UPI payment. Please proceed manually');
    }  

}

chrome.storage.local.get(null, (result) => {
    user_data = result;
   if (user_data["other_preferences"]["paymentmethod"] == "PAYTMUPIID")
   {
        console.log('PAYTMUPIID');
        {
            if (document.readyState !== 'loading') {
                fillVPA();
                
            } else {
                    document.addEventListener('DOMContentLoaded', function () {
                        fillVPA();
                });
            }
        }
    }

  });