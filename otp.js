// Event Listener para o formulário de OTP
document.getElementById('otp-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Obtém o OTP enviado
  const sentOtp = localStorage.getItem('otp');
  
  // Obtém o OTP inserido pelo usuário
  const userOtp = document.getElementById('otp-input').value;

  // Verifica se o OTP está correto
  if (userOtp === sentOtp) {
    console.log("OTP válido! Acesso concedido.");
    window.location.href = "marcacao.html"; // Redirecionar para a próxima página
  } else {
    console.error("Código OTP inválido.");
    alert("Código OTP inválido. Tente novamente.");
  }
});
