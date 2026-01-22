// 🔥 CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyB2hYymrzOG__95wxyrG3soEjinVD9ONvM",
  authDomain: "achadosebompre.firebaseapp.com",
  projectId: "achadosebompre",
  storageBucket: "achadosebompre.firebasestorage.app",
  messagingSenderId: "885306134293",
  appId: "1:885306134293:web:a167546fe9c8a7662e231c"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// 🔐 LOGIN ADMIN
const loginForm = document.getElementById("loginForm");
const adminArea = document.getElementById("adminArea");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        loginForm.style.display = "none";
        adminArea.style.display = "block";
      })
      .catch(err => {
        alert("Login inválido");
        console.error(err);
      });
  });
}

// 🔒 PROTEÇÃO AUTOMÁTICA
auth.onAuthStateChanged(user => {
  if (user) {
    loginForm.style.display = "none";
    adminArea.style.display = "block";
    loadProducts(); // 👈 CHAMA A LISTAGEM
  } else {
    loginForm.style.display = "block";
    adminArea.style.display = "none";
  }
});
// 📦 REFERÊNCIA DA COLEÇÃO
const produtosRef = db.collection("produtos");

// ➕ ADICIONAR PRODUTO (versão inicial)
function addProduct() {
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const link = document.getElementById("link").value.trim();

  if (!name || !price || !link) {
    alert("Preencha nome, preço e link.");
    return;
  }

  produtosRef.add({
    name,
    price,
    link,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("link").value = "";
    loadProducts();
  });
}
// 📋 LISTAR PRODUTOS
function loadProducts() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  produtosRef.orderBy("createdAt", "desc").onSnapshot(snapshot => {
    list.innerHTML = "";

    snapshot.forEach(doc => {
      const p = doc.data();

      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <strong>${p.name}</strong><br>
        ${p.price}<br>
        <a href="${p.link}" target="_blank">Link</a><br><br>
        <button class="delete" onclick="deleteProduct('${doc.id}')">
          Excluir
        </button>
      `;

      list.appendChild(div);
    });
  });
}
// 🗑️ EXCLUIR PRODUTO
function deleteProduct(id) {
  if (confirm("Excluir este produto?")) {
    produtosRef.doc(id).delete();
  }
}
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>

<script src="admin.js"></script>



