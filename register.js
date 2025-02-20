// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCN2dAfEGb907MweOi9mujR3StffFuHWxk",
  authDomain: "teste-de-otp.firebaseapp.com",
  projectId: "teste-de-otp",
  storageBucket: "teste-de-otp.appspot.com",
  messagingSenderId: "130717047812",
  appId: "1:130717047812:web:8ab76243df9a709bde2951",
  measurementId: "G-BQWRJHSE9P"
};

// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);

// Referência ao serviço de autenticação e Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// Classificações dos pontos
const classifications = [
  'Hora de chegada',
  'Saida pro almoço',
  'Volta do almoço',
  'Saida do expediente'
];

// Função para registrar o ponto
function registrarPonto(classification) {
  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;
    const email = user.email;
    const now = new Date();
    const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`; // Chave única para o dia

    const docRef = db.collection('pontos').doc(`${uid}_${dateKey}`);

    docRef.update({
      uid: uid,
      email: email,
      [classification]: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log(`Ponto registrado com sucesso: ${classification}`);
    })
    .catch((error) => {
      if (error.code === 'not-found') {
        docRef.set({
          uid: uid,
          email: email,
          [classification]: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          console.log(`Ponto registrado com sucesso: ${classification}`);
        })
        .catch((error) => {
          console.error('Erro ao registrar ponto: ', error);
        });
      } else {
        console.error('Erro ao registrar ponto: ', error);
      }
    });
  } else {
    console.log('Usuário não autenticado.');
  }
}

// Adiciona os event listeners após o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
  const registrarChegadaBtn = document.getElementById('registrarChegada');
  const registrarSaidaAlmocoBtn = document.getElementById('registrarSaidaAlmoco');
  const registrarVoltaAlmocoBtn = document.getElementById('registrarVoltaAlmoco');
  const registrarSaidaExpedienteBtn = document.getElementById('registrarSaidaExpediente');
  const downloadBtn = document.getElementById('download');

  if (registrarChegadaBtn) {
    registrarChegadaBtn.addEventListener('click', () => registrarPonto('Hora de chegada'));
  }
  if (registrarSaidaAlmocoBtn) {
    registrarSaidaAlmocoBtn.addEventListener('click', () => registrarPonto('Saida pro almoço'));
  }
  if (registrarVoltaAlmocoBtn) {
    registrarVoltaAlmocoBtn.addEventListener('click', () => registrarPonto('Volta do almoço'));
  }
  if (registrarSaidaExpedienteBtn) {
    registrarSaidaExpedienteBtn.addEventListener('click', () => registrarPonto('Saida do expediente'));
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      db.collection('pontos').get().then((querySnapshot) => {
        const pontos = [];
        querySnapshot.forEach((doc) => {
          pontos.push(doc.data());
        });

        const worksheet = XLSX.utils.json_to_sheet(pontos);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pontos');

        // Salva o arquivo
        XLSX.writeFile(workbook, 'Pontos.xlsx');
      }).catch((error) => {
        console.error("Erro ao baixar planilha:", error);
      });
    });
  }

  // Verifica se o usuário está logado e preenche os campos de nome e email
  auth.onAuthStateChanged((user) => {
    if (user) {
      const nomeCompletoInput = document.getElementById('nomeCompleto');
      const emailInput = document.getElementById('email');

      if (nomeCompletoInput) {
        nomeCompletoInput.value = user.displayName || '';
      }
      if (emailInput) {
        emailInput.value = user.email;
      }
    } else {
      // Redirecionar para a página de login se o usuário não estiver autenticado
      window.location.href = '/login';
    }
  });
});
