const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarCorreo(to, subject, html) {
  return await resend.emails.send({
    from: 'Películas <contact@joseolvera.com>',
    to,
    subject,
    html
  });
}

module.exports = enviarCorreo;