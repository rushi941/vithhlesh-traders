/* Vitthalesh Traders – site behaviour (no dependencies) */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Site settings – edit these values before publishing.
     ------------------------------------------------------------------ */
  var CONFIG = {
    businessName: 'Vitthalesh Traders',
    phoneDisplay: '098987 70189',
    phoneE164: '+919898770189',

    // WhatsApp number: country code + number, digits only (e.g. '919876543210').
    // Leave empty until the shop confirms which number is registered on WhatsApp.
    // While empty, WhatsApp buttons fall back to calling the shop.
    whatsappNumber: '918758382400',

    // Google Maps embed URL from Google Maps > Share > Embed a map (the src="..." value).
    // Must start with https://www.google.com/maps/embed. Leave empty to show the directions card.
    mapEmbedUrl: ''
  };

  var DEFAULT_WA_MESSAGE = 'Hello ' + CONFIG.businessName + ', I would like to make an enquiry.';
  var waEnabled = /^\d{10,15}$/.test(CONFIG.whatsappNumber);
  var telHref = 'tel:' + CONFIG.phoneE164;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function waUrl(message) {
    return 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message);
  }

  /* Footer year */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* WhatsApp links */
  $$('[data-wa]').forEach(function (el) {
    if (waEnabled) {
      el.href = waUrl(el.getAttribute('data-wa-message') || DEFAULT_WA_MESSAGE);
      el.target = '_blank';
      el.rel = 'noopener';
      return;
    }
    if (el.hasAttribute('data-wa-optional')) {
      el.hidden = true;
      return;
    }
    el.href = telHref;
    var label = $('[data-wa-label]', el);
    if (label) label.textContent = el.getAttribute('data-wa-fallback') || 'Call to Enquire';
    var use = $('use', el);
    if (use) use.setAttribute('href', '#i-phone');
  });

  /* Sticky header state */
  var header = $('[data-header]');
  if (header) {
    var ticking = false;
    var updateHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(updateHeader); }
    }, { passive: true });
    updateHeader();
  }

  /* Mobile navigation */
  var toggle = $('[data-nav-toggle]');
  var nav = $('[data-nav]');
  if (toggle && nav) {
    var toggleLabel = $('[data-nav-toggle-label]', toggle);
    var toggleIcon = $('use', toggle);
    var desktopQuery = window.matchMedia('(min-width: 961px)');

    var setNav = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      toggleIcon.setAttribute('href', open ? '#i-close' : '#i-menu');
      toggleLabel.textContent = open ? 'Close menu' : 'Open menu';
    };

    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) setNav(false);
    });
    var onBreakpoint = function () { if (desktopQuery.matches) setNav(false); };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', onBreakpoint);
  }

  /* Active nav link on scroll */
  var navLinks = $$('[data-nav-link]');
  if ('IntersectionObserver' in window && navLinks.length) {
    var linkFor = {};
    navLinks.forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });
    var sectionAlias = { 'why-us': 'wholesale-retail', enquiry: 'contact' };
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = sectionAlias[entry.target.id] || entry.target.id;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a === linkFor[id]); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { sectionObserver.observe(s); });
  }

  /* Entrance animations */
  var revealEls = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* Map embed */
  var map = $('[data-map]');
  if (map && CONFIG.mapEmbedUrl.indexOf('https://www.google.com/maps/embed') === 0) {
    var iframe = document.createElement('iframe');
    iframe.src = CONFIG.mapEmbedUrl;
    iframe.title = 'Map showing ' + CONFIG.businessName + ' in Piplod, Dahod';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    map.replaceChildren(iframe);
  }

  /* Enquiry form */
  var form = $('[data-enquiry-form]');
  if (!form) return;

  var productSelect = $('#enq-product', form);
  var statusBox = $('[data-form-status]', form);
  var submitLabel = $('[data-submit-label]', form);
  var submitIcon = $('button[type="submit"] use', form);

  $$('.product-card[data-product]').forEach(function (card) {
    var name = card.getAttribute('data-product');
    productSelect.add(new Option(name, name));
  });
  productSelect.add(new Option('Multiple products / not listed', 'Multiple products / not listed'));

  if (!waEnabled) {
    submitLabel.textContent = 'Prepare My Enquiry';
    submitIcon.setAttribute('href', '#i-check');
  }

  $$('[data-enquire]').forEach(function (link) {
    link.addEventListener('click', function () {
      productSelect.value = link.getAttribute('data-enquire');
      clearError('product');
    });
  });

  function normaliseMobile(value) {
    var digits = value.replace(/[^\d]/g, '');
    if (digits.length === 12 && digits.indexOf('91') === 0) digits = digits.slice(2);
    else if (digits.length === 11 && digits.charAt(0) === '0') digits = digits.slice(1);
    return /^[6-9]\d{9}$/.test(digits) ? digits : null;
  }

  var validators = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name.'; },
    mobile: function (v) { return normaliseMobile(v) ? '' : 'Please enter a valid 10-digit Indian mobile number.'; },
    customerType: function (v) { return v ? '' : 'Please choose Retail or Wholesale.'; },
    product: function (v) { return v ? '' : 'Please choose a product category.'; }
  };

  var errorIds = { name: 'enq-name-error', mobile: 'enq-mobile-error', customerType: 'enq-type-error', product: 'enq-product-error' };

  function fieldValue(name) {
    if (name === 'customerType') {
      var checked = $('input[name="customerType"]:checked', form);
      return checked ? checked.value : '';
    }
    return form.elements[name].value;
  }

  function setError(name, message) {
    var errorEl = document.getElementById(errorIds[name]);
    errorEl.textContent = message;
    if (name === 'customerType') {
      errorEl.closest('fieldset').classList.toggle('field--invalid', !!message);
    } else {
      form.elements[name].setAttribute('aria-invalid', message ? 'true' : 'false');
    }
  }

  function clearError(name) { setError(name, ''); }

  function validateField(name) {
    var message = validators[name](fieldValue(name));
    setError(name, message);
    return !message;
  }

  var attempted = false;
  Object.keys(validators).forEach(function (name) {
    var els = name === 'customerType' ? $$('input[name="customerType"]', form) : [form.elements[name]];
    els.forEach(function (el) {
      el.addEventListener(el.tagName === 'INPUT' && el.type !== 'radio' ? 'input' : 'change', function () {
        if (attempted) validateField(name);
      });
      el.addEventListener('blur', function () {
        if (attempted || el.value) validateField(name);
      });
    });
  });

  function buildMessage() {
    var mobile = normaliseMobile(fieldValue('mobile'));
    var lines = [
      'Hello ' + CONFIG.businessName + ',',
      'I would like to make an enquiry.',
      '',
      'Name: ' + fieldValue('name').trim(),
      'Mobile: +91 ' + mobile.slice(0, 5) + ' ' + mobile.slice(5),
      'Customer type: ' + fieldValue('customerType'),
      'Product interest: ' + fieldValue('product')
    ];
    var quantity = form.elements.quantity.value.trim();
    var message = form.elements.message.value.trim();
    if (quantity) lines.push('Quantity / requirement: ' + quantity);
    if (message) lines.push('Message: ' + message);
    lines.push('', '(Sent from the website enquiry form)');
    return lines.join('\n');
  }

  function showStatus(type, build) {
    statusBox.className = 'form-status field--full' + (type ? ' form-status--' + type : '');
    statusBox.replaceChildren();
    build(statusBox);
    statusBox.hidden = false;
  }

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text) node.textContent = text;
    return node;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    attempted = true;

    var firstInvalid = null;
    Object.keys(validators).forEach(function (name) {
      if (!validateField(name) && !firstInvalid) {
        firstInvalid = name === 'customerType' ? $('input[name="customerType"]', form) : form.elements[name];
      }
    });

    if (firstInvalid) {
      showStatus('error', function (box) {
        box.appendChild(el('p', {}, 'Please correct the highlighted fields and try again.'));
      });
      firstInvalid.focus();
      return;
    }

    var message = buildMessage();

    if (waEnabled) {
      var url = waUrl(message);
      window.open(url, '_blank', 'noopener');
      showStatus('', function (box) {
        box.appendChild(el('p', {}, 'WhatsApp is opening with your enquiry. Review the message and tap send.'));
        var actions = el('div', { class: 'form-status__actions' });
        actions.appendChild(el('a', { class: 'btn btn--outline', href: url, target: '_blank', rel: 'noopener' }, 'WhatsApp did not open? Click here'));
        box.appendChild(actions);
      });
      return;
    }

    showStatus('info', function (box) {
      box.appendChild(el('p', {}, 'Your enquiry is ready. Please call the shop on ' + CONFIG.phoneDisplay + ' and share these details:'));
      box.appendChild(el('pre', {}, message));
      var actions = el('div', { class: 'form-status__actions' });
      actions.appendChild(el('a', { class: 'btn btn--primary', href: telHref }, 'Call ' + CONFIG.phoneDisplay));
      if (navigator.clipboard && window.isSecureContext) {
        var copyBtn = el('button', { class: 'btn btn--outline', type: 'button' }, 'Copy details');
        copyBtn.addEventListener('click', function () {
          navigator.clipboard.writeText(message).then(function () {
            copyBtn.textContent = 'Copied';
          }, function () {
            copyBtn.textContent = 'Copy failed – please select the text';
          });
        });
        actions.appendChild(copyBtn);
      }
      box.appendChild(actions);
    });
  });
})();
