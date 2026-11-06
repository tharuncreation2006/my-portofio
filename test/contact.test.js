const test = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../server');

function startApp(sendMail) {
  const app = createApp({ getTransporter: async () => ({ sendMail }), ownerEmail: 'owner@example.com' });
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve({ server, url: `http://localhost:${server.address().port}` }));
  });
}

const post = (url, body) =>
  fetch(`${url}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('sends owner mail first, then a thank-you reply to the visitor', async () => {
  const sent = [];
  const { server, url } = await startApp(async (opts) => { sent.push(opts); return { messageId: `id-${sent.length}` }; });
  const res = await post(url, { name: 'Asha', email: 'asha@example.com', message: 'Hello <b>there</b>' });
  const data = await res.json();
  server.close();

  assert.strictEqual(data.success, true);
  assert.strictEqual(data.thankYouSent, true);
  assert.strictEqual(sent.length, 2);
  assert.strictEqual(sent[0].to, 'owner@example.com');
  assert.strictEqual(sent[1].to, 'asha@example.com');
  assert.ok(!sent[0].html.includes('<b>there</b>'), 'message must be HTML-escaped');
});

test('does not send a thank-you if the owner mail fails', async () => {
  let calls = 0;
  const { server, url } = await startApp(async () => { calls++; throw new Error('smtp down'); });
  const res = await post(url, { name: 'Asha', email: 'asha@example.com', message: 'Hi' });
  server.close();
  assert.strictEqual(res.status, 500);
  assert.strictEqual(calls, 1);
});

test('rejects invalid email', async () => {
  const { server, url } = await startApp(async () => ({ messageId: 'x' }));
  const res = await post(url, { name: 'Asha', email: 'not-an-email', message: 'Hi' });
  server.close();
  assert.strictEqual(res.status, 400);
});
