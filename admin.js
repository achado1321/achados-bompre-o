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
const produtosRef = db.collection("produtos");

// 🔐 ELEMENTOS
const loginForm = document.getElementById("loginForm");
const adminArea = document.getElementById("adminArea");

// 🔒 LOGIN
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .catch(() => alert("Login inválido"));
});

// 🔓 ESTADO DE LOGIN
auth.onAuthStateChanged(user => {
  if (user) {
    loginForm.style.display = "none";
    adminArea.style.display = "block";
    loadProducts();
  } else {
    loginForm.style.display = "block";
    adminArea.style.display = "none";
  }
});

// ➕ ADICIONAR PRODUTO
window.addProduct = function () {
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const link = document.getElementById("link").value.trim();

  if (!name || !price || !link) {
    alert("Preencha todos os campos");
    return;
  }

  produtosRef.add({
    name,
    price,
    link,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("link").value = "";
};

// 📋 LISTAR PRODUTOS
function loadProducts() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  produtosRef.orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      list.innerHTML = "";

      snapshot.forEach(doc => {
        const p = doc.data();

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
          <strong>${p.name}</strong><br>
          ${p.price}<br>
          <a href="${p.link}" target="_blank">Link</a><br><br>
          <button class="delete" onclick="deleteProduct('${doc.id}')">Excluir</button>
        `;

        list.appendChild(div);
      });
    });
}

// 🗑️ EXCLUIR PRODUTO
window.deleteProduct = function (id) {
  if (confirm("Excluir produto?")) {
    produtosRef.doc(id).delete();
  }
};

// 🚪 LOGOUT
window.logoutAdmin = function () {
  auth.signOut();
};
