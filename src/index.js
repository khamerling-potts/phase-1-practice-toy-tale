let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//display all toys on initial load
document.addEventListener("DOMContentLoaded", fetchAllToys);

function fetchAllToys() {
  fetch("http://localhost:3000/toys")
    .then((res) => res.json())
    .then((toys) => {
      toys.forEach((toy) => addCard(toy));
    });
}

//add a card for a given toy to the screen
function addCard(toy) {
  const card = document.createElement("div");
  card.className = "card";
  const name = document.createElement("h2");
  name.innerText = toy.name;
  const avatar = document.createElement("img");
  avatar.src = toy.image;
  avatar.className = "toy-avatar";
  const likes = document.createElement("p");
  likes.innerText = toy.likes;
  const likeBtn = document.createElement("button");
  likeBtn.className = "like-btn";
  likeBtn.id = toy.id;
  likeBtn.innerText = "Like ❤️";
  //passing in the likes element so it can be updated in the DOM when the heart is clicked
  likeBtn.addEventListener("click", () => {
    likeAToy(likes, toy.id);
  });
  card.append(name, avatar, likes, likeBtn);
  document.getElementById("toy-collection").appendChild(card);
}

//submit a new toy and update server
function submitToy(event) {
  event.preventDefault();
  const toyName = event.target.querySelector("[name='name']").value;
  const imgURL = event.target.querySelector("[name='image']").value;
  const configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: toyName,
      image: imgURL,
      likes: 0,
    }),
  };
  fetch("http://localhost:3000/toys", configObj)
    .then((res) => res.json())
    .then((toy) => addCard(toy));
}

document
  .querySelector(".add-toy-form")
  .addEventListener("submit", (event) => submitToy(event));

//click like button on a toy and increase its like count in the DOM and server
function likeAToy(likes, id) {
  const configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      likes: parseInt(likes.innerText, 10) + 1,
    }),
  };
  fetch(`http://localhost:3000/toys/${id}`, configObj)
    .then((res) => res.json())
    .then((data) => ++likes.innerText);
}
