// récupération des publications et affichage
const createPublication = document.getElementById("createPublication");
createPublication.href += sessionStorage.getItem("id");
const photo = document.getElementById("photo");
photo.href += sessionStorage.getItem("id");
const url = "http://localhost:3000/api/publication/";
const token = "Bearer " + sessionStorage.getItem("token");

function request(url, callback) {
  fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((res) => res.json())
    .then((json) => callback(json))
    .catch((error) => console.log(error));
}

async function response(posts) {
  const divPosts = document.getElementById("posts");
  const notPostDiv = document.getElementById("notPostDiv");
  // Si il n'y a pas de publication, on affiche le message suivant
  if (posts.length == 0) {
    const messageNotPost = document.createElement("p");
    messageNotPost.classList.add("messageNotPost");
    messageNotPost.innerText = "Il n'y a pas encore de publication!";
    notPostDiv.appendChild(messageNotPost);
  }
  // Sinon on affiche les publications
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("publication");
    postElement.innerHTML = /* html */ `
    <div class="headerPost">
      <h2>${post.User.username}</h2>
      ${
        // on vérifie l'id de l'user et on affiche ou non la croix
        sessionStorage.getItem("isAdmin") === "true" ||
        post.UserId == sessionStorage.getItem("id")
          ? '<i class="fas fa-times" id="deletePublication' + post.id + '"></i>'
          : ""
      }
    </div>
    ${
      // Si il y a une image, on l'affiche
      post.file
        ? '<div class="files" id="files"><img src="' +
          post.file +
          '" id="imgFile"/></div>'
        : ""
    }
    <p class="textPost">
      ${post.text || ""}
    </p>
    <div class="footer">
      <p class="createdAt">Publiée le : ${post.createdAt}</p>
      <div class="likeDislike">
        <div id="addLike${post.id}" class="likes ${
      post.Opinions.find(
        // Si like existe, on ajoute liked dans la class
        (opinion) =>
          opinion.UserId == sessionStorage.getItem("id") &&
          opinion.types === "like"
      )
        ? "liked"
        : ""
    }">
          <i class="fas fa-thumbs-up"></i>
          <!-- On implémente la quantité de like en number -->
          <span>${
            post.Opinions.filter((opinion) => opinion.types === "like").length
          }</span>
        </div>
        <div id="addDislike${post.id}" class="dislikes ${
      post.Opinions.find(
        // Si dislike existe, on ajoute disliked dans la class
        (opinion) =>
          opinion.UserId == sessionStorage.getItem("id") &&
          opinion.types === "dislike"
      )
        ? "disliked"
        : ""
    }" >
          <i class="fas fa-thumbs-down"></i>
          <!-- On implémente la quantité de dislike en number -->
          <span>${
            post.Opinions.filter((opinion) => opinion.types === "dislike")
              .length
          }</span>
        </div>
      </div>
    </div>
    `;

    divPosts.appendChild(postElement);
    const dislikeBtn = document.getElementById("addDislike" + post.id);
    const likeBtn = document.getElementById("addLike" + post.id);
    // Si like existe dans la db, on supprime au click
    if (
      post.Opinions.find(
        (opinion) =>
          opinion.UserId == sessionStorage.getItem("id") &&
          opinion.types === "like"
      )
    ) {
      // removelike
      likeBtn.addEventListener("click", async () => {
        const response = await fetch(
          "http://localhost:3000/api/publication/" + post.id + "/opinion",
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              Authorization: token,
            },
          }
        );
        if (response.status == 200) {
          window.location.reload();
        } else {
          alert("Erreur" + response.status + "Veuillez réessayer");
        }
      });
    } else if (
      // Si dislike existe dans la db, on le supprime au click
      post.Opinions.find(
        (opinion) =>
          opinion.UserId == sessionStorage.getItem("id") &&
          opinion.types === "dislike"
      )
    ) {
      // removedislike
      dislikeBtn.addEventListener("click", async () => {
        const response = await fetch(
          "http://localhost:3000/api/publication/" + post.id + "/opinion",
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              Authorization: token,
            },
          }
        );
        if (response.status == 200) {
          window.location.reload();
        } else {
          alert("Erreur" + response.status + "Veuillez réessayer");
        }
      });
    } else {
      // Sinon on ajoute like
      likeBtn.addEventListener("click", async () => {
        const response = await fetch(
          "http://localhost:3000/api/publication/" + post.id + "/opinion",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              Authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ types: "like" }),
          }
        );
        if (response.status == 201) {
          window.location.reload();
        } else {
          alert("Erreur" + response.status + "Veuillez réessayer");
        }
      });
      // ou dislike
      dislikeBtn.addEventListener("click", async () => {
        const response = await fetch(
          "http://localhost:3000/api/publication/" + post.id + "/opinion",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              Authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ types: "dislike" }),
          }
        );
        if (response.status == 201) {
          window.location.reload();
        } else {
          alert("Erreur" + response.status + "Veuillez réessayer");
        }
      });
    }
    // Si l'user est le bon ou qu'il a les droits admin
    if (
      sessionStorage.getItem("isAdmin") === "true" ||
      post.UserId == sessionStorage.getItem("id")
    ) {
      // Il peut supprimer la publication
      document
        .getElementById("deletePublication" + post.id)
        .addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const response = await fetch(
            "http://localhost:3000/api/publication/" + post.id,
            {
              method: "DELETE",
              headers: {
                Accept: "application/json",
                Authorization: token,
              },
            }
          );
          if (response.status == 200) {
            alert("Votre publication a bien été supprimé!");
            window.location.reload();
          } else {
            alert("Erreur" + response.status + "Veuillez réessayer");
          }
        });
    }
  });
}
window.onload = () => {
  request(url, response);
};
