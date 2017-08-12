window.endpoint = 'https://nbox.notif.me';
/* eslint-env browser */
/* global Promise, chrome */

const localize_text = {
  default: {
    'popup.wait': 'Please wait a few seconds...',
    'popup.title': 'Protect your privacy!',
    'popup.desc': 'Generate an email address for ',
    'popup.btn': 'GENERATE AN ADDRESS',
    'popup.myinbox': 'My nBox',
    'popup.emailbelow': 'Below, your email for ',
    'popup.emailnote': 'For security reasons, use this address only on ',
  },

  fr: {
    'popup.wait': 'Patientez SVP...',
    'popup.title': 'Protégez votre vie privée !',
    'popup.desc': 'Générez une adresse email pour ',
    'popup.btn': 'G&Eacute;N&Eacute;RER UNE ADRESSE',
    'popup.myinbox': 'Mon nBox',
    'popup.emailbelow': 'Ci-dessous, votre email pour ',
    'popup.emailnote': "Pour plus de sécurité, n'utilisez cette adresse que sur ",
  },
};

String.prototype.format = function () {
  let formatted = this;
  for (let i = 0; i < arguments.length; i++) {
    const regexp = new RegExp(`\\{${i}\\}`, 'gi');
    formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};

function localize(lang, id, ...args) {
  if (localize_text[lang] && localize_text[lang][id]) {
    return localize_text[lang][id].format(...args);
  } else if (localize_text['default'][id]) {
    return localize_text['default'][id].format(...args);
  } else {
    return id;
  }
}

function _(id, ...args) {
  if (navigator.language && navigator.language.substring(0, 2)) {
    const lang = navigator.language.substring(0, 2);
    return localize(lang, id, ...args);
  }

  return localize('default', id, ...args);
}

const html = `
<style>
  header {
    padding: 5px 15px;
    font-size: 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  header i {
    font-size: 15px;
    font-style: normal;
  }

  footer {
    border-top: 1px solid rgba(255, 255, 255, .2);
    padding: 10px 15px;
    display: flex;
  }

  section {
    flex-grow: 1;
    padding: 10px 20px;
    height: 250px;
  }

  .inbox.hide, #step2-info.hide {
    display: none;
  }

  .btn {
    display: flex;
    align-items: center;
    line-height: 30px;
    padding: 0 8px;
    border: 10px;
    box-sizing: border-box;
    cursor: pointer;
    text-decoration: none;
    color: white;
    outline: none;
    border-radius: 2px;
    background-color: #08ac69;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 6px, rgba(0, 0, 0, 0.5) 0px 1px 4px;
    margin-right: 10px;
  }

  .btn:hover {
    background-color: #09ba79;
  }

  .btn .icon {
    margin-right: 5px;
  }

  .btn.generate {
    justify-content: space-around;
  }

  .title {
    font-size: 18px;
  }

  .inbox {
    display: block;
    padding: 15px;
    color: #08ac69;
    border: 1px solid #08ac69;
    margin-top: 30px;
  }

  #inbox {
    margin-right: 30px;
  }

  .inbox .svg {
    display: inline;
    margin-left: 10px;
  }

  .inbox .renew {
    display: inline;
    margin-left: 7px;
  }

  svg {
    color: white;
    vertical-align: middle;
  }

 /**
  * Tooltip Styles
  */

 /* Base styles for the element that has a tooltip */
 [data-tooltip],
 .tooltip {
   position: relative;
   cursor: pointer;
 }

 /* Base styles for the entire tooltip */
 [data-tooltip]:before,
 [data-tooltip]:after,
 .tooltip:before,
 .tooltip:after {
   position: absolute;
   visibility: hidden;
   opacity: 0;
   -webkit-transition:
       opacity 0.2s ease-in-out,
         visibility 0.2s ease-in-out,
         -webkit-transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24);
     -moz-transition:
         opacity 0.2s ease-in-out,
         visibility 0.2s ease-in-out,
         -moz-transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24);
     transition:
         opacity 0.2s ease-in-out,
         visibility 0.2s ease-in-out,
         transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24);
   -webkit-transform: translate3d(0, 0, 0);
   -moz-transform:    translate3d(0, 0, 0);
   transform:         translate3d(0, 0, 0);
   pointer-events: none;
 }

 /* Show the entire tooltip on hover and focus */
 [data-tooltip]:hover:before,
 [data-tooltip]:hover:after,
 [data-tooltip]:focus:before,
 [data-tooltip]:focus:after,
 .tooltip:hover:before,
 .tooltip:hover:after,
 .tooltip:focus:before,
 .tooltip:focus:after {
   visibility: visible;
   opacity: 1;
 }

 /* Base styles for the tooltip's directional arrow */
 .tooltip:before,
 [data-tooltip]:before {
   z-index: 1001;
   border: 6px solid transparent;
   background: transparent;
   content: "";
 }

 /* Base styles for the tooltip's content area */
 .tooltip:after,
 [data-tooltip]:after {
   text-align: center;
   z-index: 1000;
   padding: 12px 0;
   width: 100px;
   background-color: rgba(30, 30, 30, 0.9);
   color: #fff;
   content: attr(data-tooltip);
   font-size: 14px;
   line-height: 1.2;
 }

 /* Directions */

 /* Top (default) */
 [data-tooltip]:before,
 [data-tooltip]:after,
 .tooltip:before,
 .tooltip:after,
 .tooltip-top:before,
 .tooltip-top:after {
   bottom: 100%;
   left: 50%;
 }

 [data-tooltip]:before,
 .tooltip:before,
 .tooltip-top:before {
   margin-left: -6px;
   margin-bottom: -12px;
   border-top-color: #555;
 }

 /* Horizontally align top/bottom tooltips */
 [data-tooltip]:after,
 .tooltip:after,
 .tooltip-top:after {
   margin-left: -50px;
 }

 [data-tooltip]:hover:before,
 [data-tooltip]:hover:after,
 [data-tooltip]:focus:before,
 [data-tooltip]:focus:after,
 .tooltip:hover:before,
 .tooltip:hover:after,
 .tooltip:focus:before,
 .tooltip:focus:after,
 .tooltip-top:hover:before,
 .tooltip-top:hover:after,
 .tooltip-top:focus:before,
 .tooltip-top:focus:after {
   -webkit-transform: translateY(-12px);
   -moz-transform:    translateY(-12px);
   transform:         translateY(-12px);
 }

 /* Bottom */
 .tooltip-bottom:before,
 .tooltip-bottom:after {
   top: 100%;
   bottom: auto;
   left: 50%;
 }

 .tooltip-bottom:before {
   margin-top: -12px;
   margin-bottom: 0;
   border-top-color: transparent;
   border-bottom-color: rgba(30, 30, 30, 0.9);
 }

 .tooltip-bottom:hover:before,
 .tooltip-bottom:hover:after,
 .tooltip-bottom:focus:before,
 .tooltip-bottom:focus:after {
   -webkit-transform: translateY(12px);
   -moz-transform:    translateY(12px);
   transform:         translateY(12px);
 }
</style>
<header>
  <span>
  <svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 10.48 12h.01L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2C8.2 7.18 6.84 6.62 5.4 6.62 2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.5.01.01L13.52 12h-.01l2.69-2.39c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12c1.02 1.01 2.37 1.57 3.82 1.57 2.98 0 5.4-2.41 5.4-5.38s-2.42-5.37-5.4-5.37z"/>
      <path d="M0 0h24v24H0V0z" fill="none"/>
  </svg>
  nBox</span>
  <i>by notif.me</i>
</header>

<section>
  <p class="title">
    ${_('popup.title')}
  </p>

  <p>
    <span id="word_generate">${_('popup.desc')}</span><i class="site_host">current site</i>
  </p>

  <div id="step2" class="inbox hide">
    <span id="inbox">
      ......@nbox.notif.me
    </span>
    <div id="btn_copy" class="svg tooltip-bottom" data-tooltip="Copy">
      <svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
      </svg>
    </div>
    <!-- <div class="svg renew tooltip-bottom" data-tooltip="New one!">
      <svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </div> -->
  </div>

  <div id="step2-info" class="hide">
    <br>
    ${_('popup.emailnote')} <i class="site_host">current site</i>
  </div>

  <div id="stepi" class="inbox">
    <span id="inbox">
      ${_('popup.wait')}
    </span>
    <div class="svg">
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="24" viewBox="0 0 24 24" width="24">
          <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z"/>
          <path d="M0 0h24v24H0V0z" fill="none"/>
      </svg>
    </div>
  </div>

  <div id="step1" class="inbox hide">
    <a id="btn_generate" class="btn generate">
      <b>${_('popup.btn')}</b>
      <svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
      </svg>
    </a>
  </div>

</section>

<footer>
  <a id="btn_inbox" class="btn" target="_blank" rel="noreferrer noopener">
    <div class="icon">
      <svg fill="white" preserveAspectRatio="xMidYMid meet" height="20" width="20" viewBox="0 0 40 40">
        <g>
          <path d="m33.4 13.4v-3.4l-13.4 8.4-13.4-8.4v3.4l13.4 8.2z m0-6.8q1.3 0 2.3 1.1t0.9 2.3v20q0 1.3-0.9 2.3t-2.3 1.1h-26.8q-1.3 0-2.3-1.1t-0.9-2.3v-20q0-1.3 0.9-2.3t2.3-1.1h26.8z"></path>
        </g>
      </svg>
    </div>
    <span>${_('popup.myinbox')}</span>
  </a>

  <!-- <a class="btn" href="">
    <div class="icon">
      <svg fill="white" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
      </svg>
    </div>
    <span>Settings</span>
  </a> -->
</footer>
`;

$('#root').html(html);

function pop(href) {
  let w = 600,
    h = 400,
    left = Number((screen.width / 2) - (w / 2)),
    tops = Number((screen.height / 2) - (h / 2)),
    win = window.open(href, '', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=1, copyhistory=no, width=${w}, height=${h}, top=${tops}, left=${left}`);
  win.focus();
  //
  // var timer = setInterval(() => {
  //   if(win.closed) {
  //     clearInterval(timer);
  //   }
  // }, 1000);
  //
  // return false;
}

function ajax(method, url, data = {}) {
  return new Promise((res) => {
    $.ajax({
      method,
      url: window.endpoint + url,
      xhrFields: {
        withCredentials: true,
      },
      data,
    }).done(res);
  });
}

function activeTab() {
  return new Promise((res) => {
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    }, tabs => res(tabs[0]));
  });
}

function escape(message) {
  return $('<div />').text(message).html();
}

function inject(email) {
  chrome.tabs.executeScript({
    code: `
      function fireEvent(element, event) {
        if ("createEvent" in document) {
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent(event, false, true);
          element.dispatchEvent(evt);
        } else {
          element.fireEvent(event);
        }
      }

      if(document.querySelector('[name*="email"], [type="email"]')) {
        const element = document.querySelector('[name*="email"], [type="email"]');
        element.value="${escape(email)}";

        fireEvent(element, 'keyup');
        fireEvent(element, 'change');
      }
    `,
  });
}

function copyToClipboard(element) {
  const $temp = $('<input style="height: 0;border: none;position: fixed">');
  $('body').append($temp);
  $temp.val($(element).text()).select();
  document.execCommand('copy');
  $temp.remove();
}

function step2(email) {
  $('#word_generate').text(_('popup.emailbelow'));
  $('#inbox').text(email);
  $('#stepi').hide();
  $('#step2').show();
  $('#step2-info').show();
  inject(email);
}

ajax('POST', '/api/user')
  .then(() => Promise.all([ajax('GET', '/api/has-devices'), activeTab()]))
  .then(([{hasDevices}, {url}]) => {
    const host = url.split('/')[2];
    $('.site_host').text(host);

    if (!hasDevices) {
      $('#stepi').hide();
      $('#step1').show();
      $('#btn_generate').on('click', () => pop(`${window.endpoint}/auth?url=${encodeURIComponent(url)}`));
    } else {
      return Promise.all([ajax('GET', '/api/inbox', {url}), url]);
    }
  })
  .then(([inbox, url]) => {
    if (inbox.email !== null) {
      step2(inbox.email);
    } else {
      $('#stepi').hide();
      $('#step1').show();

      $('#btn_generate').on('click', () => {
        $('#step1').hide();
        $('#stepi').show();
        ajax('POST', '/api/inbox', {url})
          .then((inbox) => {
            step2(inbox.email);
          });
      });
    }
  })
;
$('#btn_inbox').attr('href', `${window.endpoint}/list`);

$('#btn_copy')
  .on('click', () => {
    $('#btn_copy').attr('data-tooltip', 'Copied!');
    copyToClipboard('#inbox');
    return false;
  })
  .on('mouseenter', () => $('#btn_copy').attr('data-tooltip', 'Copy'));
