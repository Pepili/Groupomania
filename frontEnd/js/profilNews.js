// Récupération des informations de l'utilisateur

async function getUserPost(id) {
  response = await fetch(`http://localhost:3000/api/user/${id}/publications`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return await response.json();
}
async function postProfil() {
  try {
    const url = new URLSearchParams(document.location.search);
    const id = url.get("id");
    const profile = await getUserPost(id);
    const notPostDiv = document.getElementById("notPostDiv");
    if (profile.length == 0) {
      const notPost = document.createElement("p");
      notPost.classList.add("messageNotPost");
      notPost.innerText = "Vous n'avez pas encore publier !";
      notPostDiv.appendChild(notPost);
    }
    profile.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("publication");
      postElement.innerHTML = /* html */ `
          <div class="headerPost">
            <h2>${post.User.username}</h2>
            <div class="deletePost">
            ${
              sessionStorage.getItem("isAdmin") === "true" ||
              post.UserId == sessionStorage.getItem("id")
                ? '<i class="fas fa-times" id="deletePublication' +
                  post.id +
                  '"></i>'
                : ""
            }
          </div>
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
      notPostDiv.appendChild(postElement);
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
      }

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
  } catch (error) {
    console.log("desole, pas d'accés");
    /* window.location = "/index.html"; */
  }
}
postProfil();
