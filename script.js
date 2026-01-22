function filterCategory(cat){
  currentCategory = cat;
  currentSubcategory = '';

 document.addEventListener('click', function (e) {
  const card = e.target.closest('.card');
  if (!card) return;

  // ⛔ Se o card já usa onclick antigo, NÃO interfere
  if (card.hasAttribute('onclick')) return;

  const name  = card.dataset.name  || '';
  const desc  = card.dataset.desc  || '';
  const price = card.dataset.price || '';
  const link  = card.dataset.link  || '#';
  const store = card.dataset.store || 'shopee';

  let images = [];

  if (card.dataset.images) {
    try {
      images = JSON.parse(card.dataset.images);
    } catch {
      images = [];
    }
  }

  if (!images.length) {
    const mainImg = card.querySelector('img.main');
    if (mainImg) images.push(mainImg.src);
  }

  openModal(name, desc, price, link, images, store);
});

  // título da categoria
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
  }else if(cat === 'moda'){
    title.innerText = '👕 Moda / Vestuário';
  }else if(cat === 'tecno'){
    title.innerText = '💻 Eletrônicos / Tecnologia';
    }

  document.getElementById('noResults').style.display = found ? 'none' : 'block';
}

function searchProduct(){
  const v = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.card');
  const noResults = document.getElementById('noResults');
  const title = document.getElementById('categoryTitle');

  let found = false;

  cards.forEach(c=>{
    if(c.dataset.name.toLowerCase().includes(v)){
      c.style.display = 'block';
      found = true;
    } else {
      c.style.display = 'none';
    }
  });

  // muda título durante a busca
  if(v.length > 0){
    title.innerText = '🔍 Resultados da busca';
  } else {
    title.innerText = defaultTitle;
  }

  noResults.style.display = found ? 'none' : 'block';
}

function toggleDarkMode(){
  document.body.classList.toggle('dark');
  document.getElementById('darkBtn').innerText =
    document.body.classList.contains('dark') ? '🌙' : '☀️';
}
/* ===== MODAL FUNCTIONS ===== */

let currentImages = [];
let currentIndex = 0;
let startX = 0;
let isSwiping = false;

function openModal(title, desc, price, link, images, store = 'shopee'){
  currentImages = images;
  currentIndex = 0;

  const modal = document.getElementById('modal');
  const thumbs = document.getElementById('thumbs');
  const buyBtn = document.getElementById('modalLink');

  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalDesc').innerText = desc;
  document.getElementById('modalPrice').innerText = price;

  buyBtn.href = link;

  // 🔥 AQUI DEFINE SHOPEE OU SHEIN
  if(store === 'shein'){
    buyBtn.innerText = 'Comprar na SHEIN 🖤';
    buyBtn.style.background = '#000';
  }else{
    buyBtn.innerText = 'Comprar na Shopee 🧡';
    buyBtn.style.background = 'var(--laranja)';
  }

  changeImageWithFade(images[0]);
  thumbs.innerHTML = '';

  images.forEach((img, index)=>{
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

  modal.style.display = 'flex';
  enableSwipe();
}

function nextImage(){
  currentIndex = (currentIndex + 1) % currentImages.length;
  changeImageWithFade(currentImages[currentIndex]);
  updateActiveThumb();
}
function prevImage(){
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  changeImageWithFade(currentImages[currentIndex]);
  updateActiveThumb();
}
function closeModal(){
  document.getElementById('modal').style.display = 'none';
}

/* ===== SWIPE MOBILE ===== */
function enableSwipe(){
  const mainImg = document.getElementById('mainImg');
  if(!mainImg) return;

  mainImg.ontouchstart = (e)=>{
    startX = e.touches[0].clientX;
    isSwiping = true;
  };

  mainImg.ontouchend = (e)=>{
    if(!isSwiping) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if(diff > 50){
      nextImage();
    }else if(diff < -50){
      prevImage();
    }

    isSwiping = false;
  };
}

/* ===== FADE EFFECT ===== */
function changeImageWithFade(src){
  const img = document.getElementById('mainImg');
  if(!img) return;

  img.style.opacity = 0;

  setTimeout(()=>{
    img.src = src;
    img.style.opacity = 1;
  }, 150);
}
/* ===== FECHAR MODAL AO CLICAR FORA ===== */
document.getElementById('modal').addEventListener('click', function(e){
  if(e.target === this){
    closeModal();
  }
});
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    closeModal();
  }
});
/* 👉 Thumnail Ativa modal */
function updateActiveThumb(){
  document.querySelectorAll('.thumbs img').forEach((thumb, i)=>{
    thumb.classList.toggle('active', i === currentIndex);
  });
}
/* 👉 Botão categoria mobile */
function toggleCategories(){
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('active');
}

let defaultTitle = document.getElementById('categoryTitle').innerText;

function filterSubcategory(sub){
  currentSubcategory = sub;

  const cards = document.querySelectorAll('.card');
  const title = document.getElementById('categoryTitle');
  let found = false;

  cards.forEach(card => {
    const subs = card.dataset.subcategory || '';

    if(
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
    if(sc.id === 'subcats-' + cat){
      sc.style.display =
        sc.style.display === 'block' ? 'none' : 'block';
    } else {
      sc.style.display = 'none';
    }
  });
}
document.querySelectorAll('.card').forEach(card => {

  // ⛔ se já tem onclick antigo, não interfere
  if (card.hasAttribute('onclick')) return;

  card.addEventListener('click', () => {

    const images = card.dataset.images
      ? JSON.parse(card.dataset.images)
      : [card.querySelector('img.main')?.src];

    const store = card.dataset.store || 'shopee';

    openModal(
      card.dataset.name || '',
      card.dataset.desc || '',
      card.dataset.price || '',
      card.dataset.link || '#',
      images,              // ✅ USA A VARIÁVEL
      store
    );
  });
});

function addProductAdmin(){
  const product = {
    name: admName.value,
    price: admPrice.value,
    category: admCategory.value,
    subcategory: admSubcategory.value,
    store: admStore.value || 'shopee',
    link: admLink.value,
    desc: admDesc.value,
    images: admImages.value.split('\n')
  };

  const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  products.push(product);
  localStorage.setItem('adminProducts', JSON.stringify(products));

  renderAdminProducts();
  alert('Produto adicionado!');
}

function renderAdminProducts(){
  const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  const grid = document.querySelector('.grid');
  if (!grid) return;

  products.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'card';

    card.dataset.category = produto.category;
    card.dataset.subcategory = produto.subcategory;
    card.dataset.name = produto.name;
    card.dataset.desc = produto.desc;
    card.dataset.price = produto.price;
    card.dataset.link = produto.link;
    card.dataset.store = produto.store;
    card.dataset.images = JSON.stringify(produto.images);

    card.innerHTML = `
      <img class="main" src="${produto.images[0]}">
      <img class="hover" src="${produto.images[1] || produto.images[0]}">
      <div class="info">
        <h3>${produto.name}</h3>
        <div class="price">${produto.price}</div>
      </div>
    `;

    card.onclick = () => openModal(
      produto.name,
      produto.desc,
      produto.price,
      produto.link,
      produto.images,
      produto.store
    );

    grid.prepend(card);
  });
}

renderAdminProducts();
// ===== PRODUTOS ADMIN =====
let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

function addProduct(){
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const link = document.getElementById('link').value;

  if(!name || !price || !link){
    alert('Preencha tudo');
    return;
  }

  produtos.push({ name, price, link });
  localStorage.setItem('produtos', JSON.stringify(produtos));
  renderAdmin();
}

function deleteProduct(index){
  if(!confirm('Excluir produto?')) return;
  produtos.splice(index,1);
  localStorage.setItem('produtos', JSON.stringify(produtos));
  renderAdmin();
}

function renderAdmin(){
  const list = document.getElementById('list');
  if(!list) return;

  list.innerHTML = '';
  produtos.forEach((p,i)=>{
    list.innerHTML += `
      <div class="card">
        <strong>${p.name}</strong><br>
        ${p.price}<br>
        <button class="delete" onclick="deleteProduct(${i})">Excluir</button>
      </div>
    `;
  });
}

renderAdmin();

