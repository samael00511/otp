// Backend Node.js para enviar o OTP via SendGrid
const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Configurar a API Key do SendGrid
sgMail.setApiKey('SUA_API_KEY_AQUI');

//cors
app.use(cors());

// Middleware para analisar JSON
app.use(express.json());

// Rota para enviar o OTP via e-mail
app.post('/send-otp', (req, res) => {
  const { email, otp } = req.body;

  const msg = {
    to: email,
    from: 'SEU_EMAIL_VERIFICADO_NO_SENDGRID', // Seu e-mail verificado no SendGrid
    subject: 'Seu Código OTP',
    text: `Seu código OTP é: ${otp}`,
    html: `<strong>Seu código OTP é: ${otp}</strong>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('E-mail enviado com sucesso!');
      res.status(200).send('OTP enviado com sucesso!');
    })
    .catch((error) => {
      console.error('Erro ao enviar e-mail:', error);
      res.status(500).send('Erro ao enviar OTP.');
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
