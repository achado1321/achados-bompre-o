// ✅ admin.js – versão limpa e segura

console.log("admin.js carregado corretamente");

// 🔥 CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyB2hYymrzOG__95wxyrG3soEjinVD9ONvM",
  authDomain: "achadosebompre.firebaseapp.com",
  projectId: "achadosebompre",
  storageBucket: "achadosebompre.firebasestorage.app",
  messagingSenderId: "885306134293",
  appId: "1:885306134293:web:a167546fe9c8a7662e231c"
};
let editingProductId = null;

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const produtosRef = db.collection("produtos");

// 🔐 ELEMENTOS
const loginForm = document.getElementById("loginForm");
const adminArea = document.getElementById("adminArea");

// 🔒 LOGIN
loginForm.addEventListener("submit", e => {
  e.preventDefault();

  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .catch(() => alert("Login inválido"));
});

// 🔓 CONTROLE DE SESSÃO
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
window.editProduct = function (id) {
  produtosRef.doc(id).get().then(doc => {
    if (!doc.exists) return;

    const p = doc.data();
    editingProductId = id;

    document.getElementById("name").value = p.name || "";
    document.getElementById("desc").value = p.desc || "";
    document.getElementById("price").value = p.price || "";
    document.getElementById("store").value = p.store || "";
    document.getElementById("category").value = p.category || "";
    document.getElementById("subcategory").value = p.subcategory || "";
    document.getElementById("mainImg").value = p.images?.main || "";
    document.getElementById("hoverImg").value = p.images?.hover || "";
    document.getElementById("modalImgs").value =
      (p.images?.modal || []).join("\n");
    document.getElementById("link").value = p.link || "";

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

// ➕ ADICIONAR PRODUTO
window.addProduct = function () {
  const name = document.getElementById("name").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const price = document.getElementById("price").value.trim();
  const store = document.getElementById("store").value;
  const category = document.getElementById("category").value.trim();
  const subcategory = document.getElementById("subcategory").value.trim();
  const mainImg = document.getElementById("mainImg").value.trim();
  const hoverImg = document.getElementById("hoverImg").value.trim();
  const modalImgsRaw = document.getElementById("modalImgs").value.trim();
  const link = document.getElementById("link").value.trim();

  if (!name || !price || !link || !mainImg) {
    alert("Preencha os campos obrigatórios");
    return;
  }

  const modalImages = modalImgsRaw
    ? modalImgsRaw.split("\n").map(i => i.trim()).filter(Boolean)
    : [];

  const productData = {
  name,
  desc,
  price,
  store,
  category,
  subcategory,
  images: {
    main: mainImg,
    hover: hoverImg,
    modal: modalImages
  },
  link
};

if (editingProductId) {
  // ✏️ EDITAR PRODUTO
  produtosRef.doc(editingProductId).update(productData);
  editingProductId = null;
  alert("Produto atualizado com sucesso!");
} else {
  // ➕ ADICIONAR PRODUTO
  produtosRef.add({
    ...productData,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  alert("Produto adicionado com sucesso!");
}
  
  // limpa formulário
  document.querySelectorAll("#adminArea input, #adminArea textarea")
    .forEach(el => el.value = "");
};

editingProductId = null;

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

  <button onclick="editProduct('${doc.id}')">Editar</button>
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


window.toggleDark = function(){
  document.body.classList.toggle('dark');
  localStorage.setItem(
    'adminDark',
    document.body.classList.contains('dark')
  );
};

if(localStorage.getItem('adminDark') === 'true'){
  document.body.classList.add('dark');
}

