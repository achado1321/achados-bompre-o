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
    if (cat === 'all' || card.dataset.category === cat) {
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
    title.innerText = '🎒 Volta às Aulas';
  } else if(cat === 'cozinha'){
    title.innerText = '🥘 Cozinha';
  } else if(cat === 'beleza'){
    title.innerText = '🧼 Beleza e Cuidados Pessoais';
  } else if(cat === 'casa'){
    title.innerText = '🏠 Casa e Utilidades Domésticas';
  } else if(cat === 'moda'){
    title.innerText = '👕 Moda / Vestuário';
  } else if(cat === 'tecno'){
    title.innerText = '💻 Eletrônicos / Tecnologia';
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
}

/* ================= MODAL ================= */

let currentImages = [];
let currentIndex = 0;
let startX = 0;
let isSwiping = false;

function openModal(title, desc, price, link, images, store = 'shopee'){
  currentImages = images || [];
  currentIndex = 0;

  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalDesc').innerText = desc;
  document.getElementById('modalPrice').innerText = price;

  const buyBtn = document.getElementById('modalLink');
  buyBtn.href = link;

  if(store === 'shein'){
    buyBtn.innerText = 'Comprar na SHEIN 🖤';
    buyBtn.style.background = '#000';
  } else {
    buyBtn.innerText = 'Comprar na Shopee 🧡';
    buyBtn.style.background = 'var(--laranja)';
  }

  const thumbs = document.getElementById('thumbs');
  thumbs.innerHTML = '';

  if(currentImages.length){
    changeImageWithFade(currentImages[0]);

    currentImages.forEach((img, index)=>{
      const t = document.createElement('img');
      t.src = img;
      if(index === 0) t.classList.add('active');

      t.onclick = ()=>{
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

function closeModal(){
  document.getElementById('modal').style.display = 'none';
}

function nextImage(){
  if(!currentImages.length) return;
  currentIndex = (currentIndex + 1) % currentImages.length;
  changeImageWithFade(currentImages[currentIndex]);
  updateActiveThumb();
}

function prevImage(){
  if(!currentImages.length) return;
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  changeImageWithFade(currentImages[currentIndex]);
  updateActiveThumb();
}

function changeImageWithFade(src){
  const img = document.getElementById('mainImg');
  if(!img) return;

  img.style.opacity = 0;
  setTimeout(()=>{
    img.src = src;
    img.style.opacity = 1;
  },150);
}

function updateActiveThumb(){
  document.querySelectorAll('.thumbs img').forEach((thumb, i)=>{
    thumb.classList.toggle('active', i === currentIndex);
  });
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

  openModal(name, desc, price, link, images, store);
});

/* ================= MOBILE CATEGORIAS ================= */

function toggleCategories(){
  document.querySelector('.sidebar')?.classList.toggle('active');
}
