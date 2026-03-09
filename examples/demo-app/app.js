const button = document.getElementById("loadUsers");
const usersList = document.getElementById("users");

button.addEventListener("click", () => {

fetch("https://jsonplaceholder.typicode.com/users")
.then(res => res.json())
.then(users => {


  usersList.innerHTML = "";

  users.forEach(user => {

    const li = document.createElement("li");
    li.textContent = user.name;

    usersList.appendChild(li);

  });

})
.catch(err => console.error(err));


});
