// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_AUTH_DOMAIN_AQUI",
  projectId: "SEU_PROJECT_ID_AQUI",
  storageBucket: "SEU_STORAGE_BUCKET_AQUI",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID_AQUI",
  appId: "SEU_APP_ID_AQUI",
  measurementId: "SEU_MEASUREMENT_ID_AQUI"
};

// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);

// Referência ao serviço de autenticação
const auth = firebase.auth();
const db = firebase.firestore();

// Função de Login
function login(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user; // Obter o usuário logado
      console.log("Usuário logado:", user);

      // Gera um OTP de 6 dígitos
      const otp = Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('otp', otp);
      sendOTP(email, otp);

      // Redirecionar para a página de verificação de OTP
      window.location.href = "otp.html";
    })
    .catch((error) => {
      console.error("Erro ao logar:", error);
    });
}

// Event Listener para o formulário de login
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

// Event Listener para o botão de registro
document.getElementById('register-button').addEventListener('click', () => {
  window.location.href = 'register.html'; // Redireciona para a página de registro
});

// Função para enviar OTP
function sendOTP(email, otp) {
  fetch('http://localhost:3000/send-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  })
    .then((response) => {
      if (response.ok) {
        console.log('OTP enviado com sucesso para:', email);
      } else {
        console.error('Erro ao enviar OTP.');
      }
    })
    .catch((error) => {
      console.error('Erro:', error);
    });
}
