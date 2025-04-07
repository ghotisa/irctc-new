let user_data = {};
GetVpa();
function GetVpa()
{
	console.log("GetVpa");
  chrome.storage.local.get(null, (result) => {
    user_data = result;

	if (document.readyState !== 'loading') {
		fillCardDatasecurehdfc();
		
	} else {
			document.addEventListener('DOMContentLoaded', function () {
				fillCardDatasecurehdfc();
		});
	}

  });
  
}
function fillCardDatasecurehdfc() {
    var xyz1 = setInterval(function() {
        if (document.getElementById('submitBtn2') != null) {
            if (user_data["other_preferences"].hasOwnProperty("staticpassword"))
            {
                if(user_data["other_preferences"]["staticpassword"].trim().length>0)
                    {
                        document.getElementsByClassName('auth-tab')[0].getElementsByTagName('li')[1].getElementsByTagName('a')[0].click();
                        if (document.getElementById('submitBtn2').getBoundingClientRect().top > 0) {
                            document.getElementById('staticPassword').value = user_data["other_preferences"]["staticpassword"];
                            setTimeout(function() {
                                try {
                                    document.getElementById('submitBtn2xxxxxx').click();
                                } catch {}
                            }, 750);
                            clearInterval(xyz1);
                        }
                    }
        }
    }

    }, 500);
}
