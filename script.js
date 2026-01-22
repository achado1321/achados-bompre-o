/* ===============================
   VARIÁVEIS GLOBAIS
================================ */
let currentCategory = 'all';
let currentSubcategory = '';
let defaultTitle = document.getElementById('categoryTitle')?.innerText || '';

/* ===============================
   FILTRO DE CATEGORIA
================================ */
function filterCategory(cat){
  currentCategory = cat;
  currentSubcategory = '';

  const cards = document.querySelectorAll('.card');
  const title = document.getElementById('categoryTitle');
  let found = false;

  cards.forEach(card => {
    if (cat === 'all' || card.dataset.category === cat) {
      card.style.display = 'block';
      found = true;
    } else {
      card.style.display = 'none';
    }
  });

  if(cat === 'all') title.innerText = '🔥 Achados em Destaque';
  else if(cat === 'volta-aulas') title.innerText = '🎒 Volta às Aulas';
  else if(cat === 'cozinha') title.innerText = '🥘 Cozinha';
  else if(cat === 'beleza') title.innerText = '🧼 Beleza e Cuidados Pessoais';
  else if(cat === 'casa') title.innerText = '🏠 Casa e Utilidades Domésticas';
  else if(cat === 'moda') title.innerText = '👕 Moda / Vestuário';
  else if(cat === 'tecno') title.innerText = '💻 Eletrônicos / Tecnologia';

  document.getElementById('noResults').style.display = found ? 'none' : 'block';
}

/* ===============================
   SUBCATEGORIA
================================ */
function filterSubcategory(sub){
  currentSubcategory = sub;

  const cards = document.querySelectorAll('.card');
  const title = document.getElementById('categoryTitle');
  let found = false;

  cards.forEach(card => {
    const subs = card.dataset.subcategory || '';
    if(card.dataset.category === currentCategory && subs.includes(sub)){
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
    sc.style.display = (sc.id === 'subcats-' + cat)
      ? (sc.style.display === 'block' ? 'none' : 'block')
      : 'none';
  });
}

/* ===============================
   BUSCA
================================ */
function searchProduct(){
  const v = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.card');
  const noResults = document.getElementById('noResults');
  const title = document.getElementById('categoryTitle');
  let found = false;

  cards.forEach(card=>{
    if(card.dataset.name?.toLowerCase().includes(v)){
      card.style.display = 'block';
      found = true;
    } else {
      card.style.display = 'none';
    }
  });

  title.innerText = v.length ? '🔍 Resultados da busca' : defaultTitle;
  noResults.style.display = found ? 'none' : 'block';
}

/* ===============================
   DARK MODE
================================ */
function toggleDarkMode(){
  document.body.classList.toggle('dark');
  document.getElementById('darkBtn').innerText =
    document.body.classList.contains('dark') ? '🌙' : '☀️';
}

/* ===============================
   MODAL
================================ */
let currentImages = [];
let currentIndex = 0;

function openModal(title, desc, price, link, images, store='shopee'){
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
  }else{
    buyBtn.innerText = 'Comprar na Shopee 🧡';
    buyBtn.style.background = 'var(--laranja)';
  }

  renderModalImages();
  document.getElementById('modal').style.display = 'flex';
}

function renderModalImages(){
  const mainImg = document.getElementById('mainImg');
  const thumbs = document.getElementById('thumbs');
  thumbs.innerHTML = '';

  if(!currentImages.length) return;

  mainImg.src = currentImages[0];

  currentImages.forEach((img,i)=>{
    const t = document.createElement('img');
    t.src = img;
    if(i === 0) t.classList.add('active');
    t.onclick = ()=>{
      currentIndex = i;
      mainImg.src = img;
      updateActiveThumb();
    };
    thumbs.appendChild(t);
  });
}

function nextImage(){
  if(!currentImages.length) return;
  currentIndex = (currentIndex + 1) % currentImages.length;
  document.getElementById('mainImg').src = currentImages[currentIndex];
  updateActiveThumb();
}

function prevImage(){
  if(!currentImages.length) return;
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  document.getElementById('mainImg').src = currentImages[currentIndex];
  updateActiveThumb();
}

function closeModal(){
  document.getElementById('modal').style.display = 'none';
}

function updateActiveThumb(){
  document.querySelectorAll('.thumbs img').forEach((t,i)=>{
    t.classList.toggle('active', i === currentIndex);
  });
}

/* ===============================
   FECHAR MODAL
================================ */
document.getElementById('modal')?.addEventListener('click', e=>{
  if(e.target.id === 'modal') closeModal();
});
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape') closeModal();
});

/* ===============================
   CLIQUE GLOBAL NOS CARDS
   (HTML + Firebase)
================================ */
document.addEventListener('click', function(e){
  const card = e.target.closest('.card');
  if(!card) return;

  const images = card.dataset.images
    ? JSON.parse(card.dataset.images)
    : [
        card.querySelector('img.main')?.src
      ];

  openModal(
    card.dataset.name || '',
    card.dataset.desc || '',
    card.dataset.price || '',
    card.dataset.link || '#',
    images,
    card.dataset.store || 'shopee'
  );
});

/* ===============================
   MOBILE CATEGORIAS
================================ */
function toggleCategories(){
  document.querySelector('.sidebar')?.classList.toggle('active');
}
