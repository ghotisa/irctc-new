let user_data = {};
function getMsg(e, t) {
  return { msg: { type: e, data: t }, sender: 'content_script', id: 'irctc' };
}
function statusUpdate(e) {
  chrome.runtime.sendMessage(
    getMsg('status_update', {
      status: e,
      time: new Date().toString().split(' ')[4],
    })
  );
}
function classTranslator(e) {
  return (
    (labletext =
      '1A' === e
        ? 'AC First Class (1A)'
        : 'EV' === e
        ? 'Vistadome AC (EV)'
        : 'EC' === e
        ? 'Exec. Chair Car (EC)'
        : '2A' === e
        ? 'AC 2 Tier (2A)'
        : '3A' === e
        ? 'AC 3 Tier (3A)'
        : '3E' === e
        ? 'AC 3 Economy (3E)'
        : 'CC' === e
        ? 'AC Chair car (CC)'
        : 'SL' === e
        ? 'Sleeper (SL)'
        : '2S' === e
        ? 'Second Sitting (2S)'
        : 'None'),
    labletext
  );
}
function quotaTranslator(e) {
  return (
    'GN' === e
      ? (labletext = 'GENERAL')
      : 'TQ' === e
      ? (labletext = 'TATKAL')
      : 'PT' === e
      ? (labletext = 'PREMIUM TATKAL')
      : 'LD' === e
      ? (labletext = 'LADIES')
      : 'SR' === e
      ? (labletext = 'LOWER BERTH/SR.CITIZEN')
      : labletext,
    labletext
  );
}
function addDelay(e) {
  const t = Date.now();
  let o = null;
  do {
    o = Date.now();
  } while (o - t < e);
}
chrome.runtime.onMessage.addListener((e, t, o) => {
  if ('irctc' !== e.id) return void o('Invalid Id');
  const r = e.msg.type;
  if ('selectJourney' === r) {
    console.log('selectJourney'),
      (popupbtn = document.querySelectorAll('.btn.btn-primary')),
      popupbtn.length > 0 &&
        (popupbtn[1].click(), console.log('Close last trxn popup'));
    const e = [
      ...document
        .querySelector('#divMain > div > app-train-list')
        .querySelectorAll('.tbis-div app-train-avl-enq'),
    ];
    console.log(user_data.journey_details['train-no']);
    const t = user_data.journey_details['train-no'],
      o = e.filter((e) =>
        e
          .querySelector('div.train-heading')
          .innerText.trim()
          .includes(t.split('-')[0])
      )[0];
    if ('M' === user_data.travel_preferences.AvailabilityCheck)
      return void alert('Please manually select train and click Book');
    if (
      'A' === user_data.travel_preferences.AvailabilityCheck ||
      'I' === user_data.travel_preferences.AvailabilityCheck
    ) {
      if (!o)
        return (
          console.log('Precheck - Train not found for search criteria.'),
          void alert(
            'Precheck - Train(' +
              t +
              ') not found for search criteria. You can manually proceed or correct data and restart the process.'
          )
        );
      const e = classTranslator(user_data.journey_details.class);
      if (
        ![...o.querySelectorAll('table tr td div.pre-avl')].filter(
          (t) => t.querySelector('div').innerText === e
        )[0]
      )
        return (
          console.log('Precheck - Selected Class not available in the train.'),
          void alert(
            'Precheck - Selected Class not available in the train. You can manually proceed or correct data and restart the process.'
          )
        );
    }
    const r = document.querySelector(
      'div.row.col-sm-12.h_head1 > span > strong'
    );
    if ('A' === user_data.travel_preferences.AvailabilityCheck)
      if (
        (console.log('Automatically click'),
        'TQ' === user_data.journey_details.quota ||
          'PT' === user_data.journey_details.quota ||
          'GN' === user_data.journey_details.quota)
      ) {
        console.log('Verify tatkal time');
        const e = user_data.journey_details.class;
        (requiredTime = '00:00:00'),
          (current_time = '00:00:00'),
          ['1A', '2A', '3A', 'CC', 'EC', '3E'].includes(e.toUpperCase())
            ? (requiredTime = user_data.other_preferences.acbooktime)
            : (requiredTime = user_data.other_preferences.slbooktime),
          'GN' === user_data.journey_details.quota &&
            (requiredTime = user_data.other_preferences.gnbooktime),
          console.log('requiredTime', requiredTime);
        var a = 0;
        let t = new MutationObserver((e) => {
          if (
            ((current_time = new Date().toString().split(' ')[4]),
            console.log('current_time', current_time),
            current_time > requiredTime)
          )
            t.disconnect(), selectJourney();
          else {
            if (0 == a) {
              console.log('Inside wait counter 0 ');
              try {
                const e = document.createElement('div');
                (e.textContent =
                  'Please wait..Booking will automatically start at ' +
                  requiredTime),
                  (e.style.textAlign = 'center'),
                  (e.style.color = 'white'),
                  (e.style.height = 'auto'),
                  (e.style.fontSize = '20px');
                document
                  .querySelector(
                    '#divMain > div > app-train-list > div> div > div > div.clearfix'
                  )
                  .insertAdjacentElement('afterend', e);
              } catch (e) {
                console.log('wait time failed', e.message);
              }
            }
            try {
              a % 2 == 0
                ? (console.log('counter1', a % 2),
                  (document.querySelector(
                    '#divMain > div > app-train-list > div > div > div > div:nth-child(2)'
                  ).style.background = 'green'))
                : (console.log('counter2', a % 2),
                  (document.querySelector(
                    '#divMain > div > app-train-list > div > div > div > div:nth-child(2)'
                  ).style.background = 'red'));
            } catch (e) {}
            (a += 1), console.log('wait time');
          }
        });
        t.observe(r, { childList: !0, subtree: !0, characterDataOldValue: !0 });
      } else console.log('select journey GENERAL quota'), selectJourney();
    else
      'I' === user_data.travel_preferences.AvailabilityCheck &&
        (console.log('Immediately click'), selectJourney());
  } else if ('fillPassengerDetails' === r)
    console.log('fillPassengerDetails'), fillPassengerDetails();
  else if ('reviewBooking' === r) {
    console.log('reviewBooking');
    try {
    } catch (e) {}
    if (
      (document.querySelector('#captcha').scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      }),
      void 0 !== user_data.other_preferences.autoCaptcha &&
        user_data.other_preferences.autoCaptcha)
    )
      setTimeout(() => {
        getCaptchaTC();
      }, 500);
    else {
      console.log('Manuall captcha filling');
      let e = 'X';
      const t = document.querySelector('#captcha');
      (t.value = e),
        t.dispatchEvent(new Event('input')),
        t.dispatchEvent(new Event('change')),
        t.focus();
    }
  } else if ('bkgPaymentOptions' === r) {
    addDelay(200), console.log('bkgPaymentOptions');
    let e = 'Multiple Payment Service',
      t = 'IRCTC iPay (Credit Card/Debit Card/UPI)',
      o = !0;
    if (
      (user_data.other_preferences.paymentmethod.includes('IRCUPI') &&
        ((o = !1),
        (e = 'IRCTC iPay (Credit Card/Debit Card/UPI)'),
        (t = 'Credit cards/Debit cards/Netbanking/UPI (Powered by IRCTC)'),
        console.log('Payment option-IRCUPI')),
      user_data.other_preferences.paymentmethod.includes('PAYTMUPI') &&
        ((e = 'BHIM/ UPI/ USSD'),
        (t = 'Pay using BHIM (Powered by PAYTM ) also accepts UPI'),
        console.log('Payment option-PAYTMUPI')),
      user_data.other_preferences.paymentmethod.includes('PHONEPEUPI') &&
        ((e = 'Multiple Payment Service'),
        (t = 'Credit & Debit cards / Wallet / UPI (Powered by PhonePe)'),
        console.log('Payment option-PHONEPEUPI')),
      user_data.other_preferences.paymentmethod.includes('MOBUPI'))
    ) {
      const o = window.navigator.userAgent;
      console.log('BrowserUserAgent', o),
        o.includes('Android') &&
          (console.log('Android browser'),
          (e = 'Multiple Payment Service'),
          (t = 'Credit & Debit cards / Wallet / UPI (Powered by PhonePe)'));
    }
    user_data.other_preferences.paymentmethod.includes('IRCWA') &&
      ((e = 'IRCTC eWallet'),
      (t = 'IRCTC eWallet'),
      console.log('Payment option-IRCWA')),
      user_data.other_preferences.paymentmethod.includes('HDFCDB') &&
        ((e = 'Payment Gateway / Credit Card / Debit Card'),
        (t = 'Visa/Master Card(Powered By HDFC BANK)'),
        console.log('Payment option-HDFCDB'));
    let r = t.replace('&', '&amp;'),
      a = !1;
    var n = setInterval(() => {
      if (document.getElementsByClassName('bank-type').length > 1) {
        clearInterval(n);
        var t = document.getElementById('pay-type').getElementsByTagName('div');
        for (i = 0; i < t.length; i++)
          t[i].innerText.indexOf(e) >= 0 &&
            (o && t[i].click(),
            setTimeout(() => {
              var e = document.getElementsByClassName('border-all no-pad');
              for (i = 0; i < e.length; i++) {
                if (
                  0 != e[i].getBoundingClientRect().top &&
                  -1 !=
                    e[i]
                      .getElementsByTagName('span')[0]
                      .innerHTML.toUpperCase()
                      .indexOf(r.toUpperCase())
                ) {
                  o && e[i].click(),
                    (a = !0),
                    document
                      .getElementsByClassName('btn-primary')[0]
                      .scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest',
                      }),
                    user_data.other_preferences.hasOwnProperty(
                      'paymentManual'
                    ) && user_data.other_preferences.paymentManual
                      ? alert('Manually submit the payment page.')
                      : setTimeout(() => {
                          document
                            .getElementsByClassName('btn-primary')[0]
                            .click();
                        }, 500);
                  break;
                }
                i != e.length - 1 ||
                  a ||
                  alert(
                    'Selected payment option not available, please select other option manually.'
                  );
              }
            }, 500));
      }
    }, 500);
  } else console.log('Nothing to do');
  o('Something went wrong');
});
let captchaRetry = 0;
function getCaptcha() {
  if (captchaRetry < 100) {
    console.log('getCaptcha'), (captchaRetry += 1);
    const e = document.querySelector('.captcha-img');
    if (e) {
      const t = new XMLHttpRequest(),
        o = e.src.substr(22),
        r = JSON.stringify({
          requests: [
            {
              image: { content: o },
              features: [{ type: 'TEXT_DETECTION' }],
              imageContext: { languageHints: ['en'] },
            },
          ],
        }),
        a = 'AIzaSyDnvpf2Tusn2Cp2icvUjGBBbfn_tY86QgQ';
      user_data.other_preferences.projectId;
      t.open(
        'POST',
        'https://vision.googleapis.com/v1/images:annotate?key=' + a,
        !1
      ),
        (t.onload = function () {
          if (200 != t.status)
            console.log(`Error ${t.status}: ${t.statusText}`),
              console.log(t.response);
          else {
            let e = '';
            const o = document.querySelector('#captcha');
            (e = JSON.parse(t.response).responses[0].fullTextAnnotation.text),
              console.log('Org text', e);
            const r =
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=@',
              a = Array.from(
                e.split(' ').join('').replace(')', 'J').replace(']', 'J')
              );
            let n = '';
            for (const e of a) r.includes(e) && (n += e);
            (o.value = n),
              '' == e &&
                (console.log('Null captcha text from api'),
                document
                  .getElementsByClassName('glyphicon glyphicon-repeat')[0]
                  .parentElement.click(),
                setTimeout(() => {
                  getCaptcha();
                }, 500)),
              o.dispatchEvent(new Event('input')),
              o.dispatchEvent(new Event('change')),
              o.focus();
            const l = document.querySelector('app-login'),
              i = document.querySelector(
                '#divMain > div > app-review-booking > p-toast'
              );
            let c = new MutationObserver((e) => {
              l &&
                l.innerText.toLowerCase().includes('valid captcha') &&
                (setTimeout(() => {
                  getCaptcha();
                }, 500),
                console.log('disconnect loginCaptcha'),
                c.disconnect()),
                i &&
                  i.innerText.toLowerCase().includes('valid captcha') &&
                  (setTimeout(() => {
                    getCaptcha();
                  }, 500),
                  console.log('disconnect reviewCaptcha'),
                  c.disconnect());
            });
            l &&
              (console.log('observe loginCaptcha'),
              c.observe(l, {
                childList: !0,
                subtree: !0,
                characterDataOldValue: !0,
              })),
              i &&
                (console.log('observe reviewCaptcha'),
                c.observe(i, {
                  childList: !0,
                  subtree: !0,
                  characterDataOldValue: !0,
                }));
          }
        }),
        (t.onerror = function () {
          console.log('Captcha API Request failed');
        }),
        t.send(r);
    } else
      console.log('wait for captcha load'),
        setTimeout(() => {
          getCaptcha();
        }, 1e3);
  }
}
function getCaptchaTC() {
  if (captchaRetry < 100) {
    console.log('getCaptchaTC'), (captchaRetry += 1);
    const e = document.querySelector('.captcha-img');
    if (e) {
      const t = new XMLHttpRequest(),
        o = e.src.substr(22),
        r = JSON.stringify({
          client: 'chrome extension',
          location: 'https://www.irctc.co.in/nget/train-search',
          version: '0.3.8',
          case: 'mixed',
          promise: 'true',
          extension: !0,
          userid: 'nandkumarsh222@gmail.com',
          apikey: 'hW6X7tAP8nMtDRpaQk2m',
          data: o,
        });
      t.open('POST', 'https://api.apitruecaptcha.org/one/gettext', !1),
        (t.onload = function () {
          if (200 != t.status)
            console.log(`Error ${t.status}: ${t.statusText}`),
              console.log(t.response);
          else {
            let e = '';
            const o = document.querySelector('#captcha');
            (e = JSON.parse(t.response).result), console.log('Org text', e);
            const r =
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=@',
              a = Array.from(
                e.split(' ').join('').replace(')', 'J').replace(']', 'J')
              );
            let n = '';
            for (const e of a) r.includes(e) && (n += e);
            (o.value = n),
              '' == e &&
                (console.log('Null captcha text from api'),
                document
                  .getElementsByClassName('glyphicon glyphicon-repeat')[0]
                  .parentElement.click(),
                setTimeout(() => {
                  getCaptchaTC();
                }, 500)),
              o.dispatchEvent(new Event('input')),
              o.dispatchEvent(new Event('change')),
              o.focus();
            const l = document.querySelector('app-login'),
              i = document.querySelector(
                '#divMain > div > app-review-booking > p-toast'
              );
            let c = new MutationObserver((e) => {
              l &&
                l.innerText.toLowerCase().includes('valid captcha') &&
                (setTimeout(() => {
                  getCaptchaTC();
                }, 500),
                console.log('disconnect loginCaptcha'),
                c.disconnect()),
                i &&
                  i.innerText.toLowerCase().includes('valid captcha') &&
                  (setTimeout(() => {
                    getCaptchaTC();
                  }, 500),
                  console.log('disconnect reviewCaptcha'),
                  c.disconnect());
            });
            if (
              (l &&
                (console.log('observe loginCaptcha'),
                c.observe(l, {
                  childList: !0,
                  subtree: !0,
                  characterDataOldValue: !0,
                })),
              i &&
                (console.log('observe reviewCaptcha'),
                c.observe(i, {
                  childList: !0,
                  subtree: !0,
                  characterDataOldValue: !0,
                })),
              void 0 !== user_data.other_preferences.CaptchaSubmitMode &&
                'A' == user_data.other_preferences.CaptchaSubmitMode)
            ) {
              console.log('Auto submit captcha');
              const e = document.querySelector('#divMain > app-login');
              if (e) {
                const t = e.querySelector(
                    "button[type='submit'][class='search_btn train_Search']"
                  ),
                  o = e.querySelector(
                    "button[type='submit'][class='search_btn train_Search train_Search_custom_hover']"
                  ),
                  r = e.querySelector(
                    "input[type='text'][formcontrolname='userid']"
                  ),
                  a = e.querySelector(
                    "input[type='password'][formcontrolname='password']"
                  );
                '' != r.value && '' != a.value
                  ? (console.log('Submit login info and captcha'),
                    setTimeout(() => {
                      try {
                        t.click();
                      } catch (e) {}
                      try {
                        o.click();
                      } catch (e) {}
                    }, 500))
                  : () => {
                      setTimeout(() => {
                        try {
                          t.click();
                        } catch (e) {}
                        try {
                          o.click();
                        } catch (e) {}
                      }, 500);
                    };
              }
              if (
                ((reviewPage = document.querySelector(
                  '#divMain > div > app-review-booking'
                )),
                reviewPage)
              ) {
                console.log('reviewPage', reviewPage);
                if ('' != document.querySelector('#captcha').value) {
                  const e = document.querySelector('.btnDefault.train_Search');
                  e &&
                    setTimeout(() => {
                      if (
                        (console.log(
                          'Confirm berth',
                          user_data.other_preferences.confirmberths
                        ),
                        user_data.other_preferences.confirmberths)
                      )
                        if (document.querySelector('.AVAILABLE'))
                          console.log('Seats available'), e.click();
                        else {
                          if (
                            1 !=
                            confirm(
                              'No seats Available, Do you still want to continue booking?'
                            )
                          )
                            return void console.log('No Seats available, STOP');
                          console.log('No Seats available, still Go ahead'),
                            e.click();
                        }
                      else e.click();
                    }, 500);
                } else
                  alert('Captcha automatically not filled, submit manually');
              }
            } else console.log('Manual captcha submission');
          }
        }),
        (t.onerror = function () {
          console.log('Captcha API Request failed');
        }),
        t.send(r);
    } else
      console.log('wait for captcha load'),
        setTimeout(() => {
          getCaptchaTC();
        }, 1e3);
  }
}
function loadLoginDetails() {
  const e = document.querySelector('#divMain > app-login'),
    t = e.querySelector("input[type='text'][formcontrolname='userid']"),
    o = e.querySelector("input[type='password'][formcontrolname='password']");
  e.querySelector("button[type='submit']");
  if (
    ((t.value = user_data.irctc_credentials.user_name ?? ''),
    t.dispatchEvent(new Event('input')),
    t.dispatchEvent(new Event('change')),
    (o.value = user_data.irctc_credentials.password ?? ''),
    o.dispatchEvent(new Event('input')),
    o.dispatchEvent(new Event('change')),
    document.querySelector('#captcha').scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    }),
    void 0 !== user_data.other_preferences.autoCaptcha &&
      user_data.other_preferences.autoCaptcha)
  )
    setTimeout(() => {
      getCaptchaTC();
    }, 500);
  else {
    console.log('Manual captcha filling');
    let e = 'X';
    const t = document.querySelector('#captcha');
    (t.value = e),
      t.dispatchEvent(new Event('input')),
      t.dispatchEvent(new Event('change')),
      t.focus();
  }
}
function loadJourneyDetails() {
  console.log('filling_journey_details');
  const e = document.querySelector('app-jp-input form');
  const t = e.querySelector('#origin > span > input');
  t.value = user_data.journey_details.from;
  t.dispatchEvent(new Event('keydown')), t.dispatchEvent(new Event('input'));
  const o = e.querySelector('#destination > span > input');
  o.value = user_data.journey_details.destination;
  o.dispatchEvent(new Event('keydown'));
  o.dispatchEvent(new Event('input'));
  const r = e.querySelector('#jDate > span > input');
  r.value = user_data.journey_details.date
    ? `${user_data.journey_details.date.split('-').reverse().join('/')}`
    : '';
  r.dispatchEvent(new Event('keydown')), r.dispatchEvent(new Event('input'));
  const a = e.querySelector('#journeyClass');
  a.querySelector("div > div[role='button']").click(),
    addDelay(300),
    [...a.querySelectorAll('ul li')]
      .filter(
        (e) =>
          e.innerText === classTranslator(user_data.journey_details.class) ?? ''
      )[0]
      ?.click(),
    addDelay(300);
  const n = e.querySelector('#journeyQuota');
  n.querySelector("div > div[role='button']").click(),
    [...n.querySelectorAll('ul li')]
      .filter(
        (e) =>
          e.innerText === quotaTranslator(user_data.journey_details.quota) ?? ''
      )[0]
      ?.click(),
    addDelay(300);
  const l = e.querySelector("button.search_btn.train_Search[type='submit']");
  addDelay(300), console.log('filled_journey_details'), l.click();
}
function selectJourneyOld() {
  if (!user_data.journey_details['train-no']) return;
  const e = [
    ...document
      .querySelector('#divMain > div > app-train-list')
      .querySelectorAll('.tbis-div app-train-avl-enq'),
  ];
  console.log(user_data.journey_details['train-no']);
  const t = e.filter((e) =>
    e
      .querySelector('div.train-heading')
      .innerText.trim()
      .includes(user_data.journey_details['train-no'])
  )[0];
  if (!t)
    return (
      console.log('Train not found.'),
      alert('Train not found'),
      void statusUpdate('journey_selection_stopped.no_train')
    );
  const o = classTranslator(user_data.journey_details.class),
    r = new Date(user_data.journey_details.date).toString().split(' '),
    a = { attributes: !1, childList: !0, subtree: !0 };
  [...t.querySelectorAll('table tr td div.pre-avl')]
    .filter((e) => e.querySelector('div').innerText === o)[0]
    ?.click();
  const n = document.querySelector('#divMain > div > app-train-list > p-toast');
  new MutationObserver((e, a) => {
    const n = [
        ...t.querySelectorAll(
          "div p-tabmenu ul[role='tablist'] li[role='tab']"
        ),
      ].filter((e) => e.querySelector('div').innerText === o)[0],
      l = [...t.querySelectorAll('div div table td div.pre-avl')].filter(
        (e) => e.querySelector('div').innerText === `${r[0]}, ${r[2]} ${r[1]}`
      )[0],
      i = t.querySelector('button.btnDefault.train_Search.ng-star-inserted');
    if (n) {
      if ((console.log(1), !n.classList.contains('ui-state-active')))
        return console.log(2), void n.click();
      l &&
        (console.log(3),
        l.classList.contains('selected-class')
          ? (console.log(4), i.click(), a.disconnect())
          : (console.log(5), l.click()));
    } else console.log('6'), l.click(), i.click(), a.disconnect();
  }).observe(t, a);
  const l = new MutationObserver((e, r) => {
    console.log('Popup error'),
      console.log(
        'Class count ',
        [...t.querySelectorAll('table tr td div.pre-avl')].length
      ),
      console.log('Class count ', [
        ...t.querySelectorAll('table tr td div.pre-avl'),
      ]),
      n.innerText.includes('Unable to perform') &&
        (console.log('Unable to perform'),
        [...t.querySelectorAll('table tr td div.pre-avl')]
          .filter((e) => e.querySelector('div').innerText === o)[0]
          ?.click(),
        r.disconnect());
  });
  l.observe(n, a);
}
function retrySelectJourney() {
  console.log('Retrying selectJourney...'), setTimeout(selectJourney, 1e3);
}
function selectJourney() {
  const e = setInterval(() => {
    const t = document.querySelector(
        '#divMain > div > app-train-list > p-toast > div > p-toastitem > div > div > a'
      ),
      o = document.querySelector(
        'body > app-root > app-home > div.header-fix > app-header > p-toast > div > p-toastitem > div > div > a'
      ),
      r = t || o,
      a = document.querySelector('#loaderP'),
      n = a && 'none' !== a.style.display;
    r &&
      !n &&
      (console.log('Toast link found. Clicking it now...'),
      r.click(),
      console.log('Toast link clicked'),
      retrySelectJourney(),
      console.log('Toast link clicked and called retrySelectJourney'),
      clearInterval(e));
  }, 1e3);
  if (!user_data?.journey_details?.['train-no'])
    return void console.error('Train number is not available in user_data.');
  const t = document.querySelector('#divMain > div > app-train-list');
  if (!t) return void console.error('Train list parent not found.');
  const o = Array.from(t.querySelectorAll('.tbis-div app-train-avl-enq')),
    r = user_data.journey_details['train-no'],
    a = classTranslator(user_data.journey_details.class),
    n = new Date(user_data.journey_details.date),
    l =
      n.toDateString().split(' ')[0] +
      ', ' +
      n.toDateString().split(' ')[2] +
      ' ' +
      n.toDateString().split(' ')[1];
  console.log('Train Number:', r),
    console.log('Class:', a),
    console.log('date', l);
  const i = o.find((e) =>
    e
      .querySelector('div.train-heading')
      .innerText.trim()
      .includes(r.split('-')[0])
  );
  if (!i)
    return (
      console.error('Train not found.'),
      void statusUpdate('journey_selection_stopped.no_train')
    );
  const c = (e) => {
      if (!e) return !1;
      const t = window.getComputedStyle(e);
      return (
        'none' !== t.display && 'hidden' !== t.visibility && '0' !== t.opacity
      );
    },
    s = Array.from(i.querySelectorAll('table tr td div.pre-avl')).find(
      (e) => e.querySelector('div').innerText.trim() === a
    ),
    d = Array.from(i.querySelectorAll('span')).find(
      (e) => e.innerText.trim() === a
    ),
    u = s || d;
  if ((console.log('FOUND updatedClassToClick:', u), !u))
    return void console.error('Class to click not found.');
  const p = document.querySelector('#loaderP');
  if (c(p))
    return void console.error('Loader is visible. Cannot click the class.');
  let h;
  u.click();
  new MutationObserver((e, t) => {
    console.log('Mutation observed at', new Date().toLocaleTimeString()),
      clearTimeout(h),
      (h = setTimeout(() => {
        const e = Array.from(
          i.querySelectorAll('div div table td div.pre-avl')
        ).find((e) => e.querySelector('div').innerText.trim() === l);
        console.log('FOUND classTabToSelect:', e),
          e
            ? (e.click(),
              console.log('Clicked on selectdate'),
              setTimeout(() => {
                const e = () => {
                  const o = i.querySelector(
                    'button.btnDefault.train_Search.ng-star-inserted'
                  );
                  if (c(document.querySelector('#loaderP')))
                    return (
                      console.warn('Loader is visible, retrying...'),
                      void setTimeout(e, 100)
                    );
                  !o || o.classList.contains('disable-book') || o.disabled
                    ? (console.warn(
                        'bookBtn is disabled or not found, retrying...'
                      ),
                      retrySelectJourney())
                    : setTimeout(() => {
                        o.click(),
                          console.log('Clicked on bookBtn'),
                          clearTimeout(h),
                          t.disconnect();
                      }, 300);
                };
                e();
              }, 1e3))
            : console.warn('classTabToSelect not found');
      }, 300));
  }).observe(i, { attributes: !1, childList: !0, subtree: !0 });
}
let keyCounter = 0;
function fillPassengerDetails() {
  if (
    (console.log('passenger_filling_started'),
    user_data.journey_details.boarding.length > 0)
  ) {
    console.log('Set boarding station ' + user_data.journey_details.boarding);
    const e = document.getElementsByTagName('strong'),
      t = Array.from(e).filter((e) =>
        e.innerText.includes(
          user_data.journey_details.from.split('-')[0].trim() + ' | '
        )
      );
    t[0] && (t[0].click(), addDelay(300));
    const o = document.getElementsByTagName('strong'),
      r = Array.from(o).filter((e) =>
        e.innerText.includes(
          user_data.journey_details.boarding.split('-')[0].trim()
        )
      );
    r[0] && r[0].click();
  }
  keyCounter = new Date().getTime();
  const e = document.querySelector('app-passenger-input');
  let t = 1;
  for (; t < user_data.passenger_details.length; )
    addDelay(200), document.getElementsByClassName('prenext')[0].click(), t++;
  try {
    let e = 0;
    for (; e < user_data.infant_details.length; )
      addDelay(200), document.getElementsByClassName('prenext')[2].click(), e++;
  } catch (e) {
    console.error('add infant error', e);
  }
  const o = [...e.querySelectorAll('app-passenger')],
    r = [...e.querySelectorAll('app-infant')];
  user_data.passenger_details.forEach((e, t) => {
    let r = o[t].querySelector('p-autocomplete > span > input');
    (r.value = e.name), r.dispatchEvent(new Event('input'));
    let a = o[t].querySelector(
      "input[type='number'][formcontrolname='passengerAge']"
    );
    (a.value = e.age), a.dispatchEvent(new Event('input'));
    let n = o[t].querySelector("select[formcontrolname='passengerGender']");
    (n.value = e.gender), n.dispatchEvent(new Event('change'));
    let l = o[t].querySelector(
      "select[formcontrolname='passengerBerthChoice']"
    );
    (l.value = e.berth), l.dispatchEvent(new Event('change'));
    let i = o[t].querySelector("select[formcontrolname='passengerFoodChoice']");
    i && ((i.value = e.food), i.dispatchEvent(new Event('change')));
    try {
      let r = o[t].querySelector(
        "input[type='checkbox'][formcontrolname='childBerthFlag']"
      );
      if (
        (console.log('noChildberth', t, e.passengerchildberth),
        r && e.passengerchildberth)
      ) {
        console.log('set child half seat'), r.click(), addDelay(200);
        document.evaluate(
          "//div[contains(text(),'No berth will be allotted for child and')]",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue &&
          (console.log('clikc OK'),
          document
            .querySelector(
              'app-passenger > p-dialog > div > div > div > p-footer > button'
            )
            .click(),
          addDelay(200));
      }
    } catch (e) {
      console.error('opt Half seat error', e);
    }
  });
  try {
    user_data.infant_details.forEach((e, t) => {
      let o = r[t].querySelector("input#infant-name[name='infant-name']");
      (o.value = e.name), o.dispatchEvent(new Event('input'));
      let a = r[t].querySelector("select[formcontrolname='age']");
      (a.value = e.age), a.dispatchEvent(new Event('change'));
      let n = r[t].querySelector("select[formcontrolname='gender']");
      (n.value = e.gender), n.dispatchEvent(new Event('change'));
    });
  } catch (e) {
    console.error('fill infant error', e);
  }
  if ('' !== user_data.other_preferences.mobileNumber) {
    let t = e.querySelector(
      "input#mobileNumber[formcontrolname='mobileNumber'][name='mobileNumber']"
    );
    (t.value = user_data.other_preferences.mobileNumber),
      t.dispatchEvent(new Event('input'));
  }
  let a = [
    ...e.querySelectorAll(
      "p-radiobutton[formcontrolname='paymentType'][name='paymentType'] input[type='radio']"
    ),
  ];
  addDelay(100);
  let n = '2';
  user_data.other_preferences.paymentmethod.includes('UPI') || (n = 1),
    a.filter((e) => e.value === n)[0]?.click();
  let l = e.querySelector(
    "input#autoUpgradation[type='checkbox'][formcontrolname='autoUpgradationSelected']"
  );
  l &&
    user_data.other_preferences.hasOwnProperty('autoUpgradation') &&
    user_data.other_preferences.autoUpgradation &&
    (l.checked = user_data.other_preferences.autoUpgradation ?? !1);
  let i = e.querySelector(
    "input#confirmberths[type='checkbox'][formcontrolname='bookOnlyIfCnf']"
  );
  i &&
    user_data.other_preferences.hasOwnProperty('confirmberths') &&
    user_data.other_preferences.confirmberths &&
    (i.checked = user_data.other_preferences.confirmberths ?? !1);
  let c = [
    ...e.querySelectorAll(
      "p-radiobutton[formcontrolname='travelInsuranceOpted'] input[type='radio'][name='travelInsuranceOpted-0']"
    ),
  ];
  addDelay(200),
    c
      .filter(
        (e) =>
          e.value ===
          ('yes' === user_data.travel_preferences.travelInsuranceOpted
            ? 'true'
            : 'false')
      )[0]
      ?.click();
  try {
    let t = e.querySelector("input[formcontrolname='coachId']");
    t &&
      user_data.travel_preferences.hasOwnProperty('prefcoach') &&
      user_data.travel_preferences.prefcoach.trim().length > 0 &&
      (console.log('set preferred coach Id'),
      (t.value = user_data.travel_preferences.prefcoach));
    const o = e.querySelector(
      "p-dropdown[formcontrolname='reservationChoice']"
    );
    if (
      o &&
      user_data.travel_preferences.hasOwnProperty('reservationchoice') &&
      !user_data.travel_preferences.reservationchoice.includes(
        'Reservation Choice'
      )
    ) {
      console.log('set reservationchoice');
      o.querySelector("div > div[role='button']").click(),
        addDelay(300),
        [...o.querySelectorAll('ul li')]
          .filter(
            (e) =>
              e.innerText === user_data.travel_preferences.reservationchoice ??
              ''
          )[0]
          ?.click();
    }
  } catch (e) {
    console.error('pref coach and reservation choice error', e);
  }
  submitPassengerDetailsForm(e);
}
function submitPassengerDetailsForm(e) {
  if (
    (console.log('passenger_filling_completed'),
    window.scrollBy(0, 600, 'smooth'),
    user_data.other_preferences.hasOwnProperty('psgManual') &&
      user_data.other_preferences.psgManual)
  )
    alert('Manually submit the passenger page.');
  else
    var t = setInterval(function () {
      var o = new Date().getTime();
      keyCounter > 0 &&
        o - keyCounter > 2e3 &&
        (clearInterval(t),
        e
          .querySelector(
            "#psgn-form > form div > button.train_Search.btnDefault[type='submit']"
          )
          ?.click(),
        window.scrollBy(0, 600, 'smooth'));
    }, 500);
}
function continueScript() {
  const e = document.querySelector(
    'body > app-root > app-home > div.header-fix > app-header > div.col-sm-12.h_container > div.text-center.h_main_div > div.row.col-sm-12.h_head1 > a.search_btn.loginText.ng-star-inserted'
  );
  window.location.href.includes('train-search')
    ? ('LOGOUT' === e.innerText.trim().toUpperCase() && loadJourneyDetails(),
      'LOGIN' === e.innerText.trim().toUpperCase() &&
        (e.click(), loadLoginDetails()))
    : window.location.href.includes('nget/booking/train-list') ||
      console.log('Nothing to do');
}
async function a() {}
window.onload = function (e) {
  setInterval(function () {
    console.log('Repeater'), statusUpdate('Keep listener alive.');
  }, 15e3);
  const t = document.querySelector(
    'body > app-root > app-home > div.header-fix > app-header > div.col-sm-12.h_container > div.text-center.h_main_div > div.row.col-sm-12.h_head1 '
  );
  new MutationObserver((e, o) => {
    e.filter(
      (e) =>
        'childList' === e.type &&
        e.addedNodes.length > 0 &&
        [...e.addedNodes].filter(
          (e) => 'LOGOUT' === e?.innerText?.trim()?.toUpperCase()
        ).length > 0
    ).length > 0
      ? (o.disconnect(), loadJourneyDetails())
      : (t.click(), loadLoginDetails());
  }).observe(t, { attributes: !1, childList: !0, subtree: !1 }),
    chrome.storage.local.get(null, (e) => {
      (user_data = e), continueScript();
    });
};
