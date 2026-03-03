let finalData = {
  irctc_credentials: {},
  journey_details: {},
  passenger_details: [],
  travel_preferences: {},
  other_preferences: {},
  vpa: {},
};
function autocompleteSourcDstTrain(e, t, a) {
  var r;
  function n(e) {
    if (!e) return !1;
    !(function (e) {
      for (var t = 0; t < e.length; t++)
        e[t].classList.remove('autocomplete-active');
    })(e),
      r >= e.length && (r = 0),
      r < 0 && (r = e.length - 1),
      e[r].classList.add('autocomplete-active');
  }
  function o(t) {
    for (
      var a = document.getElementsByClassName('autocomplete-items'), r = 0;
      r < a.length;
      r++
    )
      t != a[r] && t != e && a[r].parentNode.removeChild(a[r]);
  }
  e.addEventListener('input', function (n) {
    var s,
      c,
      l,
      i = this.value;
    if ((o(), !i)) return !1;
    for (
      r = -1,
        (s = document.createElement('DIV')).setAttribute(
          'id',
          this.id + 'autocomplete-list'
        ),
        s.setAttribute('class', 'autocomplete-items'),
        this.parentNode.appendChild(s),
        l = 0;
      l < t.length;
      l++
    )
      t[l].toUpperCase().includes(i.toUpperCase()) &&
        (((c = document.createElement('DIV')).innerHTML =
          '<strong>' + t[l].substr(0, i.length) + '</strong>'),
        (c.innerHTML += t[l].substr(i.length)),
        (c.innerHTML += "<input type='hidden' value='" + t[l] + "'>"),
        c.addEventListener('click', function (t) {
          if (
            ((e.value = this.getElementsByTagName('input')[0].value),
            'SOURCE' == a &&
              (finalData.journey_details.from =
                this.getElementsByTagName('input')[0].value),
            'DEST' == a &&
              (finalData.journey_details.destination =
                this.getElementsByTagName('input')[0].value),
            'TRAIN' == a)
          ) {
            const e = this.getElementsByTagName('input')[0].value;
            finalData.journey_details['train-no'] = e.trim();
          }
          'BOARDING' == a &&
            (finalData.journey_details.boarding =
              this.getElementsByTagName('input')[0].value),
            o();
        }),
        s.appendChild(c));
  }),
    e.addEventListener('keydown', function (e) {
      var t = document.getElementById(this.id + 'autocomplete-list');
      t && (t = t.getElementsByTagName('div')),
        40 == e.keyCode
          ? (r++, n(t))
          : 38 == e.keyCode
          ? (r--, n(t))
          : 13 == e.keyCode &&
            (e.preventDefault(), r > -1 && t && t[r].click());
    }),
    document.addEventListener('click', function (e) {
      o(e.target);
    });
}
const stationData = [],
  stationList = [];
async function fetchStationData() {
  try {
    // Use local stationlist.json instead of API
    const response = await fetch(chrome.runtime.getURL('stationlist.json'));
    if (!response.ok)
      throw (
        (alert(
          'Unable to fetch station data',
          `HTTP error! status: ${response.status}`
        ),
        new Error(
          'Unable to fetch station data',
          `HTTP error! status: ${response.status}`
        ))
      );
    const stationDataArray = await response.json();
    stationData.push(...stationDataArray);
    for (let e in stationData)
      stationList.push(stationData[e].name + ' - ' + stationData[e].code);
    return stationList;
  } catch (e) {
    throw (
      (console.error('Station data fetching error:', e),
      alert('Station data fetching error:', e),
      e)
    );
  }
}
async function fetchTrainData() {
  try {
    // Use local train_data.js instead of API
    const response = await fetch(chrome.runtime.getURL('train_data.js'));
    if (!response.ok)
      throw (
        (alert('Unable to fetch train data', `HTTP error! status: ${response.status}`),
        new Error(
          'Unable to fetch train data',
          `HTTP error! status: ${response.status}`
        ))
      );
    return (await response.text()).split(/\r?\n/);
  } catch (e) {
    throw (
      (console.error('Train data fetching error:', e),
      alert('Train data fetching error:', e),
      e)
    );
  }
}
function setIRCTCUsername(e) {
  finalData.irctc_credentials || (finalData.irctc_credentials = {}),
    (finalData.irctc_credentials.user_name = e.target.value),
    console.log('data-update', finalData);
}
function setIRCTCPassword(e) {
  (finalData.irctc_credentials.password = e.target.value),
    console.log('data-update', finalData);
}

function setFromStation(e) {
  (finalData.journey_details.from = e.target.value.toUpperCase()),
    (document.querySelector('#from-station-input').value = e.target.value);
}
function setDestinationStation(e) {
  (finalData.journey_details.destination = e.target.value.toUpperCase()),
    (document.querySelector('#destination-station-input').value =
      e.target.value);
}
function setBoardingStation(e) {
  (finalData.journey_details.boarding = e.target.value.toUpperCase()),
    (document.querySelector('#boarding-station-input').value = e.target.value);
}
function setJourneyClass(e) {
  (finalData.journey_details.class = e.target.value),
    (document.querySelector('#journey-class-input').value = e.target.value);
}
function setQuota(e) {
  (finalData.journey_details.quota = e.target.value),
    (document.querySelector('#quota-input').value = e.target.value);
}
function journeyDateChanged(e) {
  finalData.journey_details.date = e.target.value;
}
function setTrainNumber(e) {
  finalData.journey_details['train-no'] = e.target.value;
}
function setPassengerDetails(e, t, a) {
  finalData.passenger_details[t] || (finalData.passenger_details[t] = {}),
    (finalData.passenger_details[t][e.target.name] =
      'checkbox' === e.target.type ? e.target.checked : e.target.value);
}
function setInfantDetails(e, t, a) {
  finalData.infant_details[t] || (finalData.infant_details[t] = {}),
    (finalData.infant_details[t][e.target.name] = e.target.value);
}
function setOtherPreferences(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] =
      'checkbox' === e.target.type ? e.target.checked : e.target.value);
}
function setAutoCaptcha(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] =
      'checkbox' === e.target.type ? e.target.checked : e.target.value);
}
function setOtherPreferencesVpa(e) {
  finalData.vpa || (finalData.vpa = {}),
    (finalData.vpa[e.target.name] = e.target.value);
}
function setpaymentMethod(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences.paymentmethod = e.target.value);
}
function setCaptchaSubmitMode(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences.CaptchaSubmitMode = e.target.value);
}
function setCardDetails(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    'cardnumber' == e.target.name &&
      (finalData.other_preferences[e.target.name] = e.target.value),
    'cardexpiry' == e.target.name &&
      (finalData.other_preferences[e.target.name] = e.target.value),
    'cardcvv' == e.target.name &&
      (finalData.other_preferences[e.target.name] = e.target.value),
    'cardholder' == e.target.name &&
      (finalData.other_preferences[e.target.name] = e.target.value),
    'staticpassword' == e.target.name &&
      (finalData.other_preferences[e.target.name] = e.target.value);
}
function setOtherPreferencesbooktime(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] = e.target.value);
}
function setcardtype(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] = e.target.value);
}
function setMobileNumber(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] = e.target.value);
}
function setTravelPreferences(e) {
  finalData.travel_preferences || (finalData.travel_preferences = {}),
    (finalData.travel_preferences[e.target.name] =
      'checkbox' === e.target.type ? e.target.checked : e.target.value);
}
function setAvailabilyCheck(e) {
  finalData.travel_preferences || (finalData.travel_preferences = {}),
    (finalData.travel_preferences[e.target.name] =
      'checkbox' === e.target.type ? e.target.checked : e.target.value);
}
function setIrctcWallet(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] =
      'checkbox' === e.target.type ? e.target.checked : e.target.value);
}
function setTokenString(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] = e.target.value);
}
function setprojectId(e) {
  finalData.other_preferences || (finalData.other_preferences = {}),
    (finalData.other_preferences[e.target.name] = e.target.value);
}
function modifyUserData() {
  console.log('before modifyUserData'),
    console.log(finalData),
    (finalData.passenger_details =
      finalData.passenger_details
        ?.filter((e) => e.name?.length > 0 && e.age?.length > 0)
        ?.map((e) => ({
          name: e.name,
          age: e.age,
          gender: e.gender ?? 'M',
          berth: e.berth ?? '',
          nationality: 'IN',
          food: e.food ?? 'D',
          passengerchildberth: e.passengerchildberth ?? !1,
        })) ?? []),
    (finalData.infant_details =
      finalData.infant_details
        ?.filter((e) => e.name?.length > 0)
        ?.map((e) => ({
          name: e.name,
          age: e.age ?? '0',
          gender: e.gender ?? 'M',
        })) ?? []),
    null == finalData.other_preferences.slbooktime &&
      (finalData.other_preferences.slbooktime =
        document.getElementById('slbooktime').value),
    null == finalData.other_preferences.acbooktime &&
      (finalData.other_preferences.acbooktime =
        document.getElementById('acbooktime').value),
    null == finalData.other_preferences.gnbooktime &&
      (finalData.other_preferences.gnbooktime =
        document.getElementById('gnbooktime').value),
    null == finalData.journey_details.class &&
      (finalData.journey_details.class = document.getElementById(
        'journey-class-input'
      ).value),
    null == finalData.journey_details.quota &&
      (finalData.journey_details.quota =
        document.getElementById('quota-input').value),
    ('TQ' === finalData.journey_details.quota ||
      'PT' === finalData.journey_details.quota) &&
    finalData.passenger_details.length > 4
      ? alert('For tatkal quota Maximum 4 passengers allowed.')
      : (null == finalData.journey_details.boarding &&
          (finalData.journey_details.boarding = ''),
        '' == document.getElementById('boarding-station-input').value &&
          (finalData.journey_details.boarding = ''),
        null == finalData.other_preferences.tokenString &&
          (finalData.other_preferences.tokenString = ''),
        null == finalData.other_preferences.projectId &&
          (finalData.other_preferences.projectId = ''),
        null == finalData.other_preferences.mobileNumber &&
          (finalData.other_preferences.mobileNumber = ''),
        null == finalData.other_preferences.paymentmethod &&
          (finalData.other_preferences.paymentmethod =
            document.getElementById('paymentMethod').value),
        !document.getElementById('paymentMethod').value.includes('UPIID') ||
        isValid_UPI_ID(document.getElementById('vpa').value)
          ? (null == finalData.other_preferences.CaptchaSubmitMode &&
              (finalData.other_preferences.CaptchaSubmitMode =
                document.getElementById('CaptchaSubmitMode').value),
            null == finalData.other_preferences.cardnumber &&
              (finalData.other_preferences.cardnumber =
                document.getElementById('cardnumber').value),
            null == finalData.other_preferences.cardexpiry &&
              (finalData.other_preferences.cardexpiry =
                document.getElementById('cardexpiry').value),
            null == finalData.other_preferences.cardcvv &&
              (finalData.other_preferences.cardcvv =
                document.getElementById('cardcvv').value),
            null == finalData.other_preferences.cardholder &&
              (finalData.other_preferences.cardholder =
                document.getElementById('cardholder').value),
            null == finalData.other_preferences.cardtype &&
              (finalData.other_preferences.cardtype =
                document.getElementById('cardtype').value),
            null == finalData.other_preferences.staticpassword &&
              (finalData.other_preferences.staticpassword =
                document.getElementById('staticpassword').value),
            null == finalData.travel_preferences.AvailabilityCheck &&
              (finalData.travel_preferences.AvailabilityCheck = 'A'),
            null == finalData.journey_details['train-no'] &&
              (console.log('Set default train nr.'),
              (finalData.journey_details['train-no'] = '00000- DEFAULT')),
            console.log('after modifyUserData'),
            console.log(finalData),
            chrome.storage.local.set(finalData),
            alert('Data saved successfully'))
          : alert('Valid UPI ID is required for selected payment method.'));
}
function isValid_UPI_ID(e) {
  let t = new RegExp('^[0-9A-Za-z.-]{2,256}@[A-Za-z]{2,64}$');
  return null != e && 1 == t.test(e);
}
function validstring(str) {
  if (
    str === undefined ||
    str === null ||
    str.length === 0 ||
    str === 'undefined'
  ) {
    return '';
  }
  return str;
}
function loadUserData() {
  chrome.storage.local.get(null, (e) => {
    if (
      (console.log('loadUserData'), console.log(e), 0 !== Object.keys(e).length)
    ) {
      (document.querySelector('#irctc-login').value = validstring(
        e.irctc_credentials.user_name
      )),
        (document.querySelector('#irctc-password').value = validstring(
          e.irctc_credentials.password
        )),
        (document.querySelector('#from-station-input').value = validstring(
          e.journey_details.from
        )),
        (document.querySelector('#destination-station-input').value =
          validstring(e.journey_details.destination)),
        (document.querySelector('#boarding-station-input').value = validstring(
          e.journey_details.boarding
        )),
        (document.querySelector('#journey-date').value = validstring(
          e.journey_details.date
        )),
        (document.querySelector('#journey-class-input').value = validstring(
          e.journey_details.class
        )),
        (document.querySelector('#quota-input').value = validstring(
          e.journey_details.quota
        )),
        (document.querySelector(
          '#train-no'
        ).value = `${e.journey_details['train-no']}`),
        e.passenger_details.forEach((e, t) => {
          (document.querySelector(`#passenger-name-${t + 1}`).value =
            e.name ?? ''),
            (document.querySelector(`#age-${t + 1}`).value = e.age ?? ''),
            (document.querySelector(`#passenger-gender-${t + 1}`).value =
              e.gender ?? 'M'),
            (document.querySelector(`#passenger-berth-${t + 1}`).value =
              e.berth ?? ''),
            (document.querySelector(`#passenger-food-${t + 1}`).value =
              e.food ?? ''),
            (document.querySelector(`#passengerchildberth${t + 1}`).checked =
              e.passengerchildberth ?? !1);
        }),
        e.infant_details.forEach((e, t) => {
          (document.querySelector(`#Infant-name-${t + 1}`).value =
            e.name ?? ''),
            (document.querySelector(`#Infant-age-${t + 1}`).value =
              e.age ?? '0'),
            (document.querySelector(`#Infant-gender-${t + 1}`).value =
              e.gender ?? 'M');
        }),
        e.travel_preferences?.travelInsuranceOpted &&
          (document.querySelector(
            '#travelInsuranceOpted-' +
              ('yes' === e.travel_preferences?.travelInsuranceOpted ? 1 : 2)
          ).checked = !0),
        e.travel_preferences.prefcoach &&
          (document.querySelector('#prefcoach').value =
            e.travel_preferences.prefcoach ?? ''),
        e.travel_preferences.reservationchoice &&
          (document.querySelector('#reservationchoice').value =
            e.travel_preferences.reservationchoice ?? '');
      try {
        e.travel_preferences?.AvailabilityCheck
          ? (document.querySelector(
              '#AvailabilityCheck-' +
                ('A' === e.travel_preferences?.AvailabilityCheck
                  ? 1
                  : 'M' === e.travel_preferences?.AvailabilityCheck
                  ? 2
                  : 'I' === e.travel_preferences?.AvailabilityCheck
                  ? 3
                  : 1)
            ).checked = !0)
          : (console.log(
              'Load user data - set availability A - if not defined'
            ),
            chrome.storage.local.set(
              { travel_preferences: { AvailabilityCheck: 'A' } },
              () => {
                console.log('set AvailabilityCheck A');
              }
            ));
      } catch {
        console.log('error getting availability check');
      }
      Object.keys(e.other_preferences).length > 0 &&
        ((document.querySelector('#autoUpgradation').checked =
          e.other_preferences.autoUpgradation ?? !1),
        (document.querySelector('#confirmberths').checked =
          e.other_preferences.confirmberths ?? !1),
        (document.querySelector('#acbooktime').value =
          e.other_preferences.acbooktime),
        (document.querySelector('#slbooktime').value =
          e.other_preferences.slbooktime),
        e.other_preferences.hasOwnProperty('gnbooktime')
          ? (document.querySelector('#gnbooktime').value =
              e.other_preferences.gnbooktime)
          : (console.log('Load user data - set GN book time - if not defined'),
            chrome.storage.local.set(
              { other_preferences: { gnbooktime: '07:59:59' } },
              () => {
                console.log('set gnbooktime');
              }
            ),
            (document.querySelector('#gnbooktime').value = '07:59:59')),
        (document.querySelector('#mobileNumber').value =
          e.other_preferences.mobileNumber),
        (document.querySelector('#paymentmethod').value =
          e.other_preferences.paymentmethod),
        (document.querySelector('#CaptchaSubmitMode').value =
          e.other_preferences.CaptchaSubmitMode),
        (document.querySelector('#autoCaptcha').checked =
          e.other_preferences.autoCaptcha ?? !1),
        (document.querySelector('#psgManual').checked =
          e.other_preferences.psgManual ?? !1),
        (document.querySelector('#paymentManual').checked =
          e.other_preferences.paymentManual ?? !1),
        (document.querySelector('#tokenString').value =
          e.other_preferences.tokenString),
        (document.querySelector('#projectId').value =
          e.other_preferences.projectId)),
        Object.keys(e.vpa).length > 0 &&
          '' !== e.vpa.vpa &&
          (console.log('load vpa', e.vpa.vpa),
          (document.querySelector('#vpa').hidden = !1),
          (document.querySelector('#vpa').value = e.vpa.vpa)),
        ('DBTCRD' != e.other_preferences.paymentmethod &&
          'DBTCRDI' != e.other_preferences.paymentmethod) ||
          (document.getElementById('carddetails').hidden = !1),
        (document.querySelector('#cardnumber').value =
          e.other_preferences.cardnumber),
        (document.querySelector('#cardexpiry').value =
          e.other_preferences.cardexpiry),
        (document.querySelector('#cardcvv').value =
          e.other_preferences.cardcvv),
        (document.querySelector('#cardholder').value =
          e.other_preferences.cardholder),
        (document.querySelector('#cardtype').value =
          e.other_preferences.cardtype),
        (document.querySelector('#staticpassword').value =
          e.other_preferences.staticpassword),
        (finalData = e);
    }
  });
}
function getMsg(e, t) {
  return { msg: { type: e, data: t }, sender: 'popup', id: 'irctc' };
}
function saveForm() {
  modifyUserData();
}
function clearData() {
  1 == confirm('Do you want to clear data?') && chrome.storage.local.clear();
}
function connectWithBg() {
  startScript();
}
function startScript() {
  chrome.runtime.sendMessage(getMsg('activate_script', finalData), (e) => {
    console.log(e, 'activate_script response');
  });
}

function showirctcpswd() {
  var e = document.getElementById('irctc-password');
  'password' === e.type ? (e.type = 'text') : (e.type = 'password');
}
function showhdfcpass() {
  var e = document.getElementById('staticpassword');
  'password' === e.type ? (e.type = 'text') : (e.type = 'password');
}
fetchStationData().then((e) => {
  autocompleteSourcDstTrain(
    document.getElementById('from-station-input'),
    e,
    'SOURCE'
  ),
    autocompleteSourcDstTrain(
      document.getElementById('destination-station-input'),
      e,
      'DEST'
    ),
    autocompleteSourcDstTrain(
      document.getElementById('boarding-station-input'),
      e,
      'BOARDING'
    );
}),
  fetchTrainData().then((e) => {
    autocompleteSourcDstTrain(document.getElementById('train-no'), e, 'TRAIN');
  }),
  window.addEventListener('load', () => {
    loadUserData(),
      document
        .querySelector('#irctc-login')
        .addEventListener('change', setIRCTCUsername),
      document
        .querySelector('#irctc-password')
        .addEventListener('change', setIRCTCPassword),
      document
        .querySelector('#journey-date')
        .addEventListener('change', journeyDateChanged),
      document
        .querySelector('#journey-class-input')
        .addEventListener('change', setJourneyClass),
      document
        .querySelector('#quota-input')
        .addEventListener('change', setQuota),
      document.querySelector('#showirctcpswd').addEventListener('change', () => {
        showirctcpswd();
      });
    for (let e = 0; e < 6; e++)
      document
        .querySelector(`#passenger-name-${e + 1}`)
        .addEventListener('change', (t) =>
          setPassengerDetails(t, e, 'passenger')
        ),
        document
          .querySelector(`#age-${e + 1}`)
          .addEventListener('change', (t) =>
            setPassengerDetails(t, e, 'passenger')
          ),
        document
          .querySelector(`#passenger-gender-${e + 1}`)
          .addEventListener('change', (t) =>
            setPassengerDetails(t, e, 'passenger')
          ),
        document
          .querySelector(`#passenger-berth-${e + 1}`)
          .addEventListener('change', (t) =>
            setPassengerDetails(t, e, 'passenger')
          ),
        document
          .querySelector(`#passenger-food-${e + 1}`)
          .addEventListener('change', (t) =>
            setPassengerDetails(t, e, 'passenger')
          ),
        document
          .querySelector(`#passengerchildberth${e + 1}`)
          .addEventListener('change', (t) =>
            setPassengerDetails(t, e, 'passenger')
          );
    for (let e = 0; e < 2; e++)
      document
        .querySelector(`#Infant-name-${e + 1}`)
        .addEventListener('change', (t) => setInfantDetails(t, e, 'infant')),
        document
          .querySelector(`#Infant-age-${e + 1}`)
          .addEventListener('change', (t) => setInfantDetails(t, e, 'infant')),
        document
          .querySelector(`#Infant-gender-${e + 1}`)
          .addEventListener('change', (t) => setInfantDetails(t, e, 'infant'));
    document
      .querySelector('#autoUpgradation')
      .addEventListener('change', setOtherPreferences),
      document
        .querySelector('#autoCaptcha')
        .addEventListener('change', setAutoCaptcha),
      document
        .querySelector('#psgManual')
        .addEventListener('change', setAutoCaptcha),
      document
        .querySelector('#paymentManual')
        .addEventListener('change', setAutoCaptcha),
      document
        .querySelector('#confirmberths')
        .addEventListener('change', setOtherPreferences),
      document
        .querySelector('#vpa')
        .addEventListener('change', setOtherPreferencesVpa);
    const e = document.querySelector('#cardnumber');
    e.addEventListener('keyup', () => {
      let t = e.value;
      (t = t.replace(/\s/g, '')),
        Number(t) &&
          ((t = t.match(/.{1,4}/g)),
          (t = t.join(' ')),
          (e.value = t),
          (finalData.other_preferences.cardnumber = e.value));
    }),
      document
        .querySelector('#cardexpiry')
        .addEventListener('change', setCardDetails),
      document
        .querySelector('#cardcvv')
        .addEventListener('change', setCardDetails),
      document
        .querySelector('#cardholder')
        .addEventListener('change', setCardDetails),
      document
        .querySelector('#paymentMethod')
        .addEventListener('change', setpaymentMethod),
      document
        .querySelector('#CaptchaSubmitMode')
        .addEventListener('change', setCaptchaSubmitMode),
      document
        .querySelector('#cardtype')
        .addEventListener('change', setcardtype),
      document
        .querySelector('#slbooktime')
        .addEventListener('change', setOtherPreferencesbooktime),
      document
        .querySelector('#acbooktime')
        .addEventListener('change', setOtherPreferencesbooktime),
      document
        .querySelector('#gnbooktime')
        .addEventListener('change', setOtherPreferencesbooktime),
      document
        .querySelector('#mobileNumber')
        .addEventListener('change', setMobileNumber),
      document
        .querySelector('#travelInsuranceOpted-1')
        .addEventListener('change', setTravelPreferences),
      document
        .querySelector('#travelInsuranceOpted-2')
        .addEventListener('change', setTravelPreferences),
      document
        .querySelector('#AvailabilityCheck-1')
        .addEventListener('change', setAvailabilyCheck),
      document
        .querySelector('#AvailabilityCheck-2')
        .addEventListener('change', setAvailabilyCheck),
      document
        .querySelector('#AvailabilityCheck-3')
        .addEventListener('change', setAvailabilyCheck),
      document
        .querySelector('#tokenString')
        .addEventListener('change', setTokenString),
      document
        .querySelector('#projectId')
        .addEventListener('change', setprojectId),
      document
        .querySelector('#staticpassword')
        .addEventListener('change', setprojectId),
      document.querySelector('#submit-btn').addEventListener('click', saveForm),
      document
        .querySelector('#clear-btn')
        .addEventListener('click', () => clearData()),
      document
        .querySelector('#connect-btn')
        .addEventListener('click', connectWithBg),
      document
        .querySelector('#showhdfcpass')
        .addEventListener('click', showhdfcpass),
      document
        .querySelector('#reservationchoice')
        .addEventListener('change', setTravelPreferences),
      document
        .querySelector('#prefcoach')
        .addEventListener('change', setTravelPreferences);
  });
