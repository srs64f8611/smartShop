const usersContainer = document.getElementById('usersContainer');

//CREATE USER FORM
const userForm = document.createElement('div');
userForm.style.marginTop = '20px';

userForm.innerHTML = `
  <h3>Create New User</h3>

  <input type="text" placeholder="Name" id="newName" style="margin:5px;">
  <input type="email" placeholder="Email" id="newEmail" style="margin:5px;">
  <input type="password" placeholder="Password" id="newPassword" style="margin:5px;">

  <select id="newRole" style="margin:5px;">
    <option value="customer" selected>Customer</option>
    <option value="admin">Admin</option>
  </select>

  <button id="createUserBtn">Create User</button>
`;
usersContainer.appendChild(userForm);

//CREATE USER BUTTON
document.getElementById('createUserBtn').addEventListener('click', () => {
  const name = document.getElementById('newName').value.trim();
  const email = document.getElementById('newEmail').value.trim();
  const password = document.getElementById('newPassword').value.trim();
  const role = document.getElementById('newRole').value;

  if (!name || !email || !password || !role) {
    return alert('Please fill all fields');
  }

  addUser({ name, email, password, role });
});


//LOAD USERS
function loadUsers() {
  fetch('/users')
    .then(res => res.json())
    .then(users => {

      // Remove previous UI
      usersContainer
        .querySelectorAll('.userSelect, .userDetails, .userDeleteBtn')
        .forEach(el => el.remove());

      //USER DROPDOWN
      const select = document.createElement('select');
      select.classList.add('userSelect');

      const defaultOption = document.createElement('option');
      defaultOption.textContent = 'Select a user';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);

      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user._id;
        option.textContent = user.name;
        select.appendChild(option);
      });

      usersContainer.insertBefore(select, userForm);

      //USER DETAILS + EDIT FORM
      const userDetails = document.createElement('div');
      userDetails.classList.add('userDetails');
      userDetails.style.marginTop = '10px';
      usersContainer.insertBefore(userDetails, userForm);

      select.addEventListener('change', () => {
        const u = users.find(x => x._id === select.value);
        if (!u) return;

        userDetails.innerHTML = `
          <p><strong>ID:</strong> ${u._id}</p>
          <p><strong>Name:</strong> ${u.name}</p>
          <p><strong>Email:</strong> ${u.email}</p>
          <p><strong>Role:</strong> ${u.role}</p>

          <h4>Edit User</h4>

          <input id="editName" value="${u.name}" style="margin:5px;">
          <input id="editEmail" value="${u.email}" style="margin:5px;">

          <select id="editRole" style="margin:5px;">
            <option value="customer" ${u.role === "customer" ? "selected" : ""}>Customer</option>
            <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option>
          </select>

          <button id="saveUserBtn">Save Changes</button>
        `;

        //SAVE USER CHANGES
        document.getElementById('saveUserBtn').addEventListener('click', () => {
          const name = document.getElementById('editName').value.trim();
          const email = document.getElementById('editEmail').value.trim();
          const role = document.getElementById('editRole').value;

          // Empty check
          if (!name || !email) {
            return alert("Name and Email cannot be empty!");
          }

          // Email format validation
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(email)) {
            return alert("Please enter a valid email address!");
          }

          updateUser(u._id, { name, email, role });
        });
      });

      //DELETE USER BUTTON
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete Selected User';
      deleteBtn.classList.add('userDeleteBtn');
      deleteBtn.style.marginLeft = '10px';

      deleteBtn.addEventListener('click', () => {
        if (select.value) deleteUser(select.value);
      });

      usersContainer.insertBefore(deleteBtn, userForm);
    })
    .catch(err => console.error(err));
}

//DELETE USER
function deleteUser(id) {
  fetch(`/users/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => loadUsers());
}

//ADD USER
function addUser(data) {
  fetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById('newName').value = '';
      document.getElementById('newEmail').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('newRole').value = 'customer';

      loadUsers();
    });
}

//INITIAL LOAD
loadUsers();