// 🔥 Firebase config (mesma do admin)
const firebaseConfig = {
  apiKey: "AIzaSyB2hYymrzOG__95wxyrG3soEjinVD9ONvM",
  authDomain: "achadosebompre.firebaseapp.com",
  projectId: "achadosebompre",
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const grid = document.getElementById("productGrid");

// 🔄 CARREGAR PRODUTOS
db.collection("produtos")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {

    grid.innerHTML = "";

    snapshot.forEach(doc => {
      const p = doc.data();

      const card = document.createElement("div");
      card.className = "card";
      card.dataset.category = p.category || "";
      card.dataset.subcategory = p.subcategory || "";
      card.dataset.store = p.store || "shopee";
      card.dataset.video = p.video || "";
      card.dataset.name = p.name;
      card.dataset.desc = p.desc || "";
      card.dataset.price = p.price || "";
      card.dataset.link = p.link || "#";
      card.dataset.images = JSON.stringify([
        p.images?.main,
        ...(p.images?.modal || [])
      ].filter(Boolean));

      card.innerHTML = `
        <img class="main" src="${p.images?.main || ""}">
        <img class="hover" src="${p.images?.hover || p.images?.main || ""}">
        <div class="info">
          <h3>${p.name}</h3>
          <div class="price">${p.price || ""}</div>
        </div>
      `;

      grid.appendChild(card);
    });

  });




 
