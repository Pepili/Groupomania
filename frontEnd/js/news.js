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
  if (posts.length == 0) {
    const messageNotPost = document.createElement("p");
    messageNotPost.classList.add("messageNotPost");
    messageNotPost.innerText = "Il n'y a pas encore de publication!";
    notPostDiv.appendChild(messageNotPost);
  }
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("publication");
    postElement.innerHTML = /* html */ `
    <div class="headerPost">
      <h2>${post.User.username}</h2>
      ${
        sessionStorage.getItem("isAdmin") === "true" ||
        post.UserId == sessionStorage.getItem("id")
          ? '<i class="fas fa-times" id="deletePublication' + post.id + '"></i>'
          : ""
      }
    </div>
    ${
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
        (opinion) =>
          opinion.UserId == sessionStorage.getItem("id") &&
          opinion.types === "like"
      )
        ? "liked"
        : ""
    }">
          <i class="fas fa-thumbs-up"></i>
          <span>${
            post.Opinions.filter((opinion) => opinion.types === "like").length
          }</span>
        </div>
        <div id="addDislike${post.id}" class="dislikes ${
      post.Opinions.find(
        (opinion) =>
          opinion.UserId == sessionStorage.getItem("id") &&
          opinion.types === "dislike"
      )
        ? "disliked"
        : ""
    }" >
          <i class="fas fa-thumbs-down"></i>
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
      // add like
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
      // add dislike
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
    if (
      sessionStorage.getItem("isAdmin") === "true" ||
      post.UserId == sessionStorage.getItem("id")
    ) {
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
