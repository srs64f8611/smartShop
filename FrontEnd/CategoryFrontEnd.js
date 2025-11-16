const categoriesContainer = document.getElementById('categoriesContainer');

// CREATE CATEGORY FORM
const categoryForm = document.createElement('div');
categoryForm.style.marginTop = '20px';
categoryForm.innerHTML = `
  <h3>Create New Category</h3>
  <input type="text" placeholder="Name" id="newCatName" style="margin:5px;">
  <input type="text" placeholder="Description" id="newCatDesc" style="margin:5px;">
  <button id="createCategoryBtn">Create Category</button>
`;
categoriesContainer.appendChild(categoryForm);

// CREATE CATEGORY BUTTON
document.getElementById('createCategoryBtn').addEventListener('click', () => {
  const name = document.getElementById('newCatName').value.trim();
  const description = document.getElementById('newCatDesc').value.trim();

  if (!name) return alert("Category name is required");

  addCategory({ name, description });
});

// LOAD CATEGORIES
function loadCategories() {
  fetch('/categories')
    .then(res => res.json())
    .then(categories => {

      // Remove old UI
      categoriesContainer.querySelectorAll('.catSelect, .catDetails, .catDeleteBtn')
        .forEach(el => el.remove());

      // CATEGORY DROPDOWN
      const select = document.createElement('select');
      select.classList.add('catSelect');

      const defaultOption = document.createElement('option');
      defaultOption.textContent = 'Select a category';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);

      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat._id;
        option.textContent = cat.name;
        select.appendChild(option);
      });

      categoriesContainer.insertBefore(select, categoryForm);

      // CATEGORY DETAILS
      const details = document.createElement('div');
      details.classList.add('catDetails');
      details.style.marginTop = '10px';
      categoriesContainer.insertBefore(details, categoryForm);

      select.addEventListener('change', () => {
        const c = categories.find(x => x._id === select.value);
        details.innerHTML = `
          <p><strong>ID:</strong> ${c._id}</p>
          <p><strong>Name:</strong> ${c.name}</p>
          <p><strong>Description:</strong> ${c.description || 'No description'}</p>
        `;
      });

      // DELETE BUTTON
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete Selected Category';
      deleteBtn.classList.add('catDeleteBtn');
      deleteBtn.style.marginLeft = '10px';
      deleteBtn.addEventListener('click', () => {
        if (select.value) deleteCategory(select.value);
      });

      categoriesContainer.insertBefore(deleteBtn, categoryForm);
    });
}

// ADD CATEGORY
function addCategory(data) {
  fetch('/categories')
    .then(res => res.json())
    .then(existing => {
      if (existing.some(c => c.name.toLowerCase() === data.name.toLowerCase())) {
        return alert("Category already exists!");
      }

      fetch('/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(() => {
          document.getElementById('newCatName').value = '';
          document.getElementById('newCatDesc').value = '';
          loadCategories();
        });
    });
}

// UPDATE USER (FOR REFERENCE)
function updateUser(id, data) {
  fetch(`/users/${id}`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(updated => {
      alert("User updated successfully!");
      loadUsers(); // refresh UI
    })
    .catch(err => console.error(err));
}

// INITIAL LOAD
loadCategories();
