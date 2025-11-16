const container = document.getElementById('ordersContainer');

// CREATE NEW ORDER FORM
const form = document.createElement('div');
form.style.marginTop = '20px';
form.innerHTML = `
  <h3>Create New Order</h3>
  <select id="newOrderUser" style="margin:5px;"></select>
  <select id="newOrderProduct" style="margin:5px;"></select>
  <input type="number" placeholder="Quantity" id="newOrderQty" style="margin:5px;" min="1">
  <button id="createOrderBtn">Create Order</button>
`;
container.appendChild(form);

// STORE PRODUCTS FOR STOCK CHECK
let currentProducts = [];

// LOAD USERS & PRODUCTS
async function loadDropdowns() {
  // Load users
  const usersRes = await fetch('/users');
  const users = await usersRes.json();
  const userSelect = document.getElementById('newOrderUser');
  userSelect.innerHTML = '<option disabled selected>Select User</option>';
  users.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u._id;
    opt.textContent = u.name;
    userSelect.appendChild(opt);
  });

  // Load products
  const productsRes = await fetch('/products');
  const products = await productsRes.json();
  currentProducts = products; // save for stock validation
  const prodSelect = document.getElementById('newOrderProduct');
  prodSelect.innerHTML = '<option disabled selected>Select Product</option>';
  products.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p._id;
    opt.textContent = `${p.name} (Stock: ${p.stock})`;
    prodSelect.appendChild(opt);
  });
}

// QUANTITY INPUT CHECK
const qtyInput = document.getElementById('newOrderQty');
const prodSelect = document.getElementById('newOrderProduct');

qtyInput.addEventListener('input', () => {
  const productId = prodSelect.value;
  if (!productId) return;

  const product = currentProducts.find(p => p._id === productId);
  const qty = parseInt(qtyInput.value);

  if (qty > product.stock) {
    alert(`Quantity cannot exceed stock (${product.stock})`);
    qtyInput.value = product.stock;
  } else if (qty < 1) {
    qtyInput.value = 1;
  }
});

// CREATE ORDER BUTTON
document.getElementById('createOrderBtn').addEventListener('click', async () => {
  const userId = document.getElementById('newOrderUser').value;
  const productId = document.getElementById('newOrderProduct').value;
  const quantity = parseInt(document.getElementById('newOrderQty').value);

  if (!userId || !productId || !quantity) {
    alert('Please select user, product and quantity!');
    return;
  }

  const product = currentProducts.find(p => p._id === productId);
  if (quantity > product.stock) {
    alert(`Quantity cannot exceed stock (${product.stock})`);
    return;
  }

  const totalPrice = product.price * quantity;

  addOrder({
    user: userId,
    products: [{ product: productId, quantity }],
    totalPrice
  });
});

// LOAD ORDERS
function loadOrders() {
  fetch('/orders')
    .then(res => res.json())
    .then(orders => {

      // Remove previous elements
      container.querySelectorAll('select.orderSelect, div.orderDetails, button.deleteBtn')
        .forEach(el => el.remove());

      // Dropdown
      const select = document.createElement('select');
      select.classList.add('orderSelect');
      const defaultOption = document.createElement('option');
      defaultOption.textContent = "Select an Order";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);

      orders.forEach(order => {
        const option = document.createElement('option');
        option.value = order._id;
        option.textContent = `Order ${order._id}`;
        select.appendChild(option);
      });
      container.insertBefore(select, form);

      // Order details
      const orderDetails = document.createElement('div');
      orderDetails.classList.add('orderDetails');
      orderDetails.style.marginTop = '10px';
      container.insertBefore(orderDetails, form);

      select.addEventListener('change', () => {
        const o = orders.find(x => x._id === select.value);
        if (!o) return;

        const productsList = o.products
          .map(p => `${p.product?.name || p.product} (x${p.quantity})`)
          .join(', ');

        orderDetails.innerHTML = `
          <p><strong>ID:</strong> ${o._id}</p>
          <p><strong>User:</strong> ${o.user?.name || o.user}</p>
          <p><strong>Products:</strong> ${productsList}</p>
          <p><strong>Total Price:</strong> $${o.totalPrice}</p>
          <p><strong>Status:</strong> ${o.status}</p>
        `;
      });

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = "Delete Selected Order";
      deleteBtn.classList.add('deleteBtn');
      deleteBtn.style.marginLeft = "10px";
      deleteBtn.addEventListener('click', () => {
        const id = select.value;
        if (id) deleteOrder(id);
      });
      container.insertBefore(deleteBtn, form);
    });
}

// DELETE ORDER
function deleteOrder(id) {
  fetch(`/orders/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => loadOrders())
    .catch(err => console.error(err));
}

// ADD ORDER
function addOrder(orderData) {
  fetch('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById('newOrderQty').value = '';
      loadDropdowns();
      loadOrders();
    })
    .catch(err => console.error(err));
}

// INITIAL LOAD
loadDropdowns();
loadOrders();