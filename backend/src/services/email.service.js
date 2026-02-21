const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarCorreo(to, subject, text) {
  return await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject,
    text
  });
}

module.exports = enviarCorreo;