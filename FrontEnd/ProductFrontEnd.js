const productsContainer = document.getElementById('productsContainer');

// CREATE PRODUCT FORM
const productForm = document.createElement('div');
productForm.style.marginTop = '20px';
productForm.innerHTML = `
  <h3>Create New Product</h3>
  <input type="text" placeholder="Name" id="newProdName" style="margin:5px;">
  <input type="text" placeholder="Description" id="newProdDesc" style="margin:5px;">
  <input type="number" placeholder="Price" id="newProdPrice" style="margin:5px;">
  <input type="number" placeholder="Stock" id="newProdStock" style="margin:5px;">
  <select id="newProdCategory" style="margin:5px;"></select>
  <button id="createProductBtn">Create Product</button>
`;
productsContainer.appendChild(productForm);

// LOAD CATEGORIES INTO DROPDOWN
function loadProductCategoryOptions() {
  fetch('/categories')
    .then(res => res.json())
    .then(categories => {
      const catSelect = document.getElementById('newProdCategory');
      catSelect.innerHTML = '';

      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat._id;
        opt.textContent = cat.name;
        catSelect.appendChild(opt);
      });
    });
}

// CREATE PRODUCT BUTTON
document.getElementById('createProductBtn').addEventListener('click', () => {
  const data = {
    name: document.getElementById('newProdName').value.trim(),
    description: document.getElementById('newProdDesc').value.trim(),
    price: Number(document.getElementById('newProdPrice').value),
    stock: Number(document.getElementById('newProdStock').value),
    category: document.getElementById('newProdCategory').value
  };

  if (!data.name || !data.price || !data.category) {
    return alert("Name, price, and category are required");
  }

  addProduct(data);
});

// LOAD PRODUCTS
function loadProducts() {
  fetch('/products')
    .then(res => res.json())
    .then(products => {
      // Remove old UI
      productsContainer.querySelectorAll('.prodSelect, .prodDetails, .prodDeleteBtn')
        .forEach(el => el.remove());

      // PRODUCT DROPDOWN
      const select = document.createElement('select');
      select.classList.add('prodSelect');

      const defaultOption = document.createElement('option');
      defaultOption.textContent = 'Select a product';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);

      products.forEach(prod => {
        const opt = document.createElement('option');
        opt.value = prod._id;
        opt.textContent = prod.name;
        select.appendChild(opt);
      });

      productsContainer.insertBefore(select, productForm);

      // PRODUCT DETAILS BOX
      const details = document.createElement('div');
      details.classList.add('prodDetails');
      details.style.marginTop = '10px';
      productsContainer.insertBefore(details, productForm);

      select.addEventListener('change', () => {
        const p = products.find(x => x._id === select.value);
        details.innerHTML = `
          <p><strong>ID:</strong> ${p._id}</p>
          <p><strong>Name:</strong> ${p.name}</p>
          <p><strong>Description:</strong> ${p.description || "No description"}</p>
          <p><strong>Price:</strong> $${p.price}</p>
          <p><strong>Stock:</strong> ${p.stock}</p>
          <p><strong>Category:</strong> ${p.category?.name || "Unknown"}</p>
        `;
      });

      // DELETE BUTTON
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete Selected Product';
      deleteBtn.classList.add('prodDeleteBtn');
      deleteBtn.style.marginLeft = '10px';

      deleteBtn.addEventListener('click', () => {
        if (select.value) deleteProduct(select.value);
      });

      productsContainer.insertBefore(deleteBtn, productForm);
    });
}

// ADD PRODUCT
function addProduct(data) {
  fetch('/products')
    .then(res => res.json())
    .then(existing => {
      if (existing.some(p => p.name.toLowerCase() === data.name.toLowerCase())) {
        return alert("A product with this name already exists!");
      }

      fetch('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(() => {
          document.getElementById('newProdName').value = '';
          document.getElementById('newProdDesc').value = '';
          document.getElementById('newProdPrice').value = '';
          document.getElementById('newProdStock').value = '';
          loadProducts();
        });
    });
}

// DELETE PRODUCT
function deleteProduct(id) {
  fetch(`/products/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => loadProducts());
}

// INITIAL LOAD
loadProductCategoryOptions();
loadProducts();