const BASE_URL = 'http://localhost:3000';

const button = document.getElementById('loadUsers');
const usersList = document.getElementById('users');
const sourceTag = document.getElementById('sourceTag');

button.addEventListener('click', () => {
  usersList.innerHTML = 'Loading...';

  fetch(`${BASE_URL}/api/users`)
    .then(res => {
      const source = res.headers.get('x-shadowapi-source') || 'unknown';
      sourceTag.textContent = `Source: ${source.toUpperCase()}`;
      sourceTag.className = source === 'real' ? 'badge-real' : 'badge-mock';
      return res.json();
    })
    .then(json => {
      const users = json.data?.users || json.users || [];
      usersList.innerHTML = '';
      users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.id} — ${user.name}`;
        usersList.appendChild(li);
      });
    })
    .catch(err => {
      usersList.innerHTML = 'Error: ' + err.message;
    });
});
