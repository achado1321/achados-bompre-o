/* ================= VARIÁVEIS GLOBAIS ================= */

let currentCategory = 'all';
let currentSubcategory = '';
let defaultTitle = document.getElementById('categoryTitle')?.innerText || '';

/* ================= CATEGORIAS ================= */

function filterCategory(cat){
  currentCategory = cat;
  currentSubcategory = '';

  const cards = document.querySelectorAll('.card');
  const title = document.getElementById('categoryTitle'); // ✅ CORREÇÃO
  let found = false;

  cards.forEach(card => {
    if (
  cat === 'all' ||
  (card.dataset.category === cat && !currentSubcategory)
) {
      card.style.display = 'block';
      found = true;
    } else {
      card.style.display = 'none';
    }
  });

  // TÍTULO
  if(cat === 'all'){
    title.innerText = '🔥 Achados em Destaque';
  } else if(cat === 'volta-aulas'){
    title.innerText = '✏️ Papelaria';
  } else if(cat === 'beleza'){
    title.innerText = '🧼 Beleza e Cuidados Pessoais';
  } else if(cat === 'casa'){
    title.innerText = '🏠 Casa e Utilidades Domésticas';
 } else if(cat === 'pet'){
    title.innerText = '🐾 Pet Shop';
  } else if(cat === 'moda'){
    title.innerText = '👕 Moda / Vestuário';
  } else if(cat === 'tecno'){
    title.innerText = '💻 Eletrônicos / Tecnologia';
  } else if(cat === 'kids'){
    title.innerText = ' 🧸 Kids / Infantil';
  }

  document.getElementById('noResults').style.display = found ? 'none' : 'block';
}

/* ================= SUBCATEGORIAS ================= */

function filterSubcategory(sub){
  currentSubcategory = sub;

  const cards = document.querySelectorAll('.card');
  const title = document.getElementById('categoryTitle');
  let found = false;

  cards.forEach(card => {
    const subs = card.dataset.subcategory || '';

    if (
      card.dataset.category === currentCategory &&
      subs.includes(sub)
    ){
      card.style.display = 'block';
      found = true;
    } else {
      card.style.display = 'none';
    }
  });

  title.innerText =
    title.innerText.split(' • ')[0] + ' • ' +
    sub.charAt(0).toUpperCase() + sub.slice(1);

  document.getElementById('noResults').style.display = found ? 'none' : 'block';
}

function toggleSubcats(cat){
  document.querySelectorAll('.subcats').forEach(sc=>{
    sc.style.display = sc.id === 'subcats-' + cat
      ? (sc.style.display === 'block' ? 'none' : 'block')
      : 'none';
  });
}

/* ================= BUSCA ================= */

function searchProduct(){
  const v = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.card');
  const noResults = document.getElementById('noResults');
  const title = document.getElementById('categoryTitle');

  let found = false;

  cards.forEach(c=>{
    if(c.dataset.name?.toLowerCase().includes(v)){
      c.style.display = 'block';
      found = true;
    } else {
      c.style.display = 'none';
    }
  });

  title.innerText = v.length ? '🔍 Resultados da busca' : defaultTitle;
  noResults.style.display = found ? 'none' : 'block';
}

/* ================= DARK MODE ================= */

function toggleDarkMode(){
  document.body.classList.toggle('dark');
  document.getElementById('darkBtn').innerText =
    document.body.classList.contains('dark') ? '🌙' : '☀️';

  // ✅ reaplica tema ao trocar modo
  applyTheme();
}
/* ================= THEME FIREBASE (PERSONALIZAÇÃO) ================= */

let themeConfig = null;

// usa o mesmo firestore do produtos.js (Firebase SDK compat)
const themeDb = firebase.firestore();

themeDb.collection("config").doc("theme").onSnapshot(doc => {
  themeConfig = doc.data();
  applyTheme();
});

function applyTheme(){
  if(!themeConfig) return;

  const isDark = document.body.classList.contains("dark");
  const t = isDark ? themeConfig.dark : themeConfig.light;
  if(!t) return;

  document.documentElement.style.setProperty("--roxo", t.primary || "#6a0dad");
  document.documentElement.style.setProperty("--laranja", t.accent || "#ff7a00");
  document.documentElement.style.setProperty("--cinza", t.bg || "#f4f4f4");
}


/* ================= MODAL ================= */

function openModal(title, desc, price, link, images, store = 'shopee', video = '') {
  currentImages = images || [];
  currentIndex = 0;

  // textos
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalDesc').innerText = desc;
  document.getElementById('modalPrice').innerText = price;

  // botão comprar
  const buyBtn = document.getElementById('modalLink');
  buyBtn.href = link;

  if (store === 'shein') {
    buyBtn.innerText = 'Comprar na SHEIN 🖤';
    buyBtn.style.background = '#000';
  } else {
    buyBtn.innerText = 'Comprar na Shopee 🧡';
    buyBtn.style.background = 'var(--laranja)';
  }

  // ✅ RESET VIDEO/IMG
  const videoBox = document.getElementById("videoBox");
  const mainImg = document.getElementById("mainImg");

  if (videoBox) {
    videoBox.innerHTML = "";
    videoBox.style.display = "none";
  }
  if (mainImg) {
    mainImg.style.display = "block";
  }

  // ✅ se tiver vídeo, mostra vídeo
  if (video && videoBox) {
    // ⚠️ TEM QUE SER URL DIRETA .mp4 (res.cloudinary.com)
    videoBox.innerHTML = `
      <video controls playsinline style="width:100%; border-radius:16px;">
        <source src="${video}" type="video/mp4">
      </video>
    `;
    videoBox.style.display = "block";

    if (mainImg) {
      mainImg.style.display = "none";
    }
  }

  // thumbs
  const thumbs = document.getElementById('thumbs');
  thumbs.innerHTML = '';

  // ✅ garante que images é só imagem
  currentImages = currentImages.filter(url => {
    if (!url) return false;
    url = url.toLowerCase();
    return (
      url.includes(".png") ||
      url.includes(".jpg") ||
      url.includes(".jpeg") ||
      url.includes(".webp")
    );
  });

  if (currentImages.length) {
    changeImageWithFade(currentImages[0]);

    currentImages.forEach((img, index) => {
      const t = document.createElement('img');
      t.src = img;

      if(index === 0) t.classList.add('active');

      t.onclick = () => {
        currentIndex = index;
        changeImageWithFade(img);
        updateActiveThumb();
      };

      thumbs.appendChild(t);
    });
  }

  document.getElementById('modal').style.display = 'flex';
  enableSwipe();
}
/* ================= SWIPE MOBILE ================= */

function enableSwipe(){
  const img = document.getElementById('mainImg');
  if(!img) return;

  img.ontouchstart = e => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  };

  img.ontouchend = e => {
    if(!isSwiping) return;
    const diff = startX - e.changedTouches[0].clientX;
    if(diff > 50) nextImage();
    if(diff < -50) prevImage();
    isSwiping = false;
  };
}

/* ================= FECHAR MODAL ================= */

document.getElementById('modal')?.addEventListener('click', e=>{
  if(e.target.id === 'modal') closeModal();
});

document.addEventListener('keydown', e=>{
  if(e.key === 'Escape') closeModal();
});

/* ================= CLICK NOS CARDS (GLOBAL) ================= */

// ✅ MODAL FUNCIONA PARA TODOS OS PRODUTOS (HTML + ADMIN)
document.addEventListener('click', function (e) {
  const card = e.target.closest('.card');
  if (!card) return;

  const name  = card.dataset.name  || '';
  const desc  = card.dataset.desc  || '';
  const price = card.dataset.price || '';
  const link  = card.dataset.link  || '#';
  const store = card.dataset.store || 'shopee';
  const video = card.dataset.video || '';


  let images = [];

  // imagens vindas do admin (Firebase)
  if (card.dataset.images) {
    try {
      images = JSON.parse(card.dataset.images);
    } catch (err) {
      images = [];
    }
  }

  // fallback se não tiver images
  if (!images.length) {
    const mainImg = card.querySelector('img.main');
    if (mainImg) images = [mainImg.src];
  }

  openModal(name, desc, price, link, images, store, video);
});

/* ================= MOBILE CATEGORIAS ================= */

function toggleCategories(){
  document.querySelector('.sidebar')?.classList.toggle('active');
}
function renderFirebaseProduct(produto){
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const card = document.createElement('div');
  card.className = 'card';

  // datasets (modal, filtro, busca)
  card.dataset.name = produto.name || '';
  card.dataset.desc = produto.desc || '';
  card.dataset.price = produto.price || '';
  card.dataset.link = produto.link || '#';
  card.dataset.store = produto.store || 'shopee';
  card.dataset.category = produto.category || '';
  card.dataset.subcategory = produto.subcategory || '';
  card.dataset.images = JSON.stringify(produto.images || []);

  // HTML interno (IGUAL aos cards antigos)
  card.innerHTML = `
    <img class="main" src="${produto.images?.[0] || ''}">
    <img class="hover" src="${produto.images?.[1] || produto.images?.[0] || ''}">
    <div class="info">
      <h3>${produto.name}</h3>
      <div class="price">${produto.price}</div>
    </div>
  `;

  grid.appendChild(card);
}


