
const API_URL = "https://dummyjson.com/products";

const productList = document.getElementById("productList");
const productStatus = document.getElementById("productStatus");
const searchInput = document.getElementById("searchProduk");
const btnReload = document.getElementById("btnReload");

let allProducts = []; 


function setStatus(message, type = "") {
  productStatus.textContent = message;
  productStatus.className = "status " + type;
}


function formatPrice(value) {
  return "$" + Number(value).toFixed(2);
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const img = document.createElement("img");
  img.src = product.thumbnail;
  img.alt = product.title;
  img.loading = "lazy";

  const title = document.createElement("h3");
  title.textContent = product.title;

  const price = document.createElement("p");
  price.className = "price";
  price.textContent = formatPrice(product.price);

  const category = document.createElement("p");
  category.className = "category";
  category.textContent = product.category;

  card.append(img, title, price, category);
  return card;
}


function renderProducts(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
    setStatus("Produk tidak ditemukan.", "error");
    return;
  }

  setStatus(`Menampilkan ${products.length} produk.`);
  const fragment = document.createDocumentFragment();
  products.forEach((product) => fragment.appendChild(createProductCard(product)));
  productList.appendChild(fragment);
}


async function fetchProducts() {
  setStatus("Memuat data produk...", "loading");
  productList.innerHTML = "";
  searchInput.disabled = true;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server merespons dengan status ${response.status}`);
    }

    const data = await response.json(); // { products: [...], total, skip, limit }
    allProducts = data.products;

    renderProducts(allProducts);
    searchInput.disabled = false;
  } catch (error) {
    console.error("Gagal memuat produk:", error);
    setStatus(`Gagal memuat data: ${error.message}. Periksa koneksi lalu klik "Muat Ulang".`, "error");
  }
}


searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = allProducts.filter((p) => p.title.toLowerCase().includes(keyword));
  renderProducts(filtered);
});


btnReload.addEventListener("click", () => {
  searchInput.value = "";
  fetchProducts();
});


fetchProducts();
