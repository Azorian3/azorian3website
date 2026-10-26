(function () {
  var FORM_EMAIL = 'contact@azorian3.com'; /* where contact and newsletter submissions are emailed (FormSubmit) */

  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); burger.classList.remove('open'); });
    });
  }

  document.querySelectorAll('.acc').forEach(function (b) {
    b.addEventListener('click', function () {
      var body = document.getElementById(b.getAttribute('aria-controls'));
      var open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', !open);
      body.classList.toggle('open', !open);
    });
  });

  function scrollTo(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  window.addEventListener('message', function (e) {
    var t = e.data && e.data.type;
    if (t === 'cs-contact') scrollTo('contact');
    if (t === 'cs-showcase') scrollTo('spend-reports');
  });

  /* dashboards are laid out at 980px; scale them down on narrow screens */
  function fitEmbeds() {
    document.querySelectorAll('.embed-scale').forEach(function (box) {
      var f = box.querySelector('iframe');
      var base = parseInt(f.getAttribute('data-h'), 10);
      var w = box.clientWidth;
      var s = Math.min(1, w / 980);
      f.style.width = '980px';
      f.style.height = base + 'px';
      f.style.transform = 'scale(' + s + ')';
      box.style.height = Math.round(base * s) + 'px';
    });
  }
  window.addEventListener('resize', fitEmbeds);
  fitEmbeds();

  /* forms: posted to FormSubmit, no page reload */
  function toast(msg) {
    var t = document.querySelector('.toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 4500);
  }
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var data = new FormData(form);
      data.append('_subject', form.getAttribute('data-form') === 'contact' ? 'azorian3.com contact form' : 'azorian3.com newsletter signup');
      data.append('_captcha', 'false');
      data.append('_template', 'table');
      btn.disabled = true;
      fetch('https://formsubmit.co/ajax/' + FORM_EMAIL, { method: 'POST', headers: { Accept: 'application/json' }, body: data })
        .then(function (r) { return r.json(); })
        .then(function () { form.reset(); toast(form.getAttribute('data-form') === 'contact' ? 'Thanks. We reply within two business days.' : 'You are on the list.'); })
        .catch(function () { toast('Something went wrong. Email us directly at ' + FORM_EMAIL + '.'); })
        .then(function () { btn.disabled = false; });
    });
  });

  /* light copy protection, same intent as the Wix site */
  function block(e) {
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    e.preventDefault();
  }
  ['contextmenu', 'dragstart', 'copy', 'cut'].forEach(function (ev) { document.addEventListener(ev, block, true); });
})();
