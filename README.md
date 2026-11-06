# Tharun P Portfolio (npm project)

Portfolio site served by Express. The contact form sends the message to Tharun with Nodemailer. After that mail is delivered, the server sends a thank-you reply to the visitor.

## Run

```bash
npm install
npm start
```

Open http://localhost:5000

## Real emails (Gmail)

1. Turn on 2-Step Verification, then create an App Password at https://myaccount.google.com/apppasswords
2. Put it in `.env`: `EMAIL_PASS=abcdefghijklmnop`
3. Restart `npm start`

With `EMAIL_PASS` empty the server uses a free Ethereal test inbox. Messages are not really delivered, but the console prints a preview link for the thank-you mail.

## Layout

- `server.js`: Express app and `/api/contact` route (validation, rate limit, owner mail then thank-you mail)
- `mailer.js`: email templates and transporter setup
- `public/`: the website (only this folder is served, so `.env` stays private)
- `test/`: `npm test`
