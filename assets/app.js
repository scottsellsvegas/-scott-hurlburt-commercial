const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); menu.focus(); } });
const interest = new URLSearchParams(location.search).get('interest');
const choices = { landlord: 'Landlord representation', tenant: 'Tenant representation', buyer: 'Buying / investing' };
if (choices[interest]) document.querySelectorAll('[name="interest"]').forEach(select => select.value = choices[interest]);
document.querySelectorAll('.inquiry-form').forEach(form => {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.form-status');
    button.disabled = true;
    status.replaceChildren(document.createTextNode('Sending your inquiry…'));
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error('Delivery unavailable');
      status.textContent = 'Thank you. Your inquiry has been sent to Scott.';
      form.reset();
    } catch {
      status.textContent = 'Your inquiry was not sent. Please call Scott or use this link to send it from your email app: ';
      const email = document.createElement('a');
      const message = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || ''}\nInterest: ${data.interest}\nProperty: ${data.address || ''}\n\n${data.message}`;
      email.href = `mailto:Scott@SimplyVegasCRE.com?subject=${encodeURIComponent('Commercial real estate inquiry: ' + data.interest)}&body=${encodeURIComponent(message)}`;
      email.textContent = 'Open email draft';
      email.style.textDecoration = 'underline';
      status.append(email);
    } finally { button.disabled = false; }
  });
});
