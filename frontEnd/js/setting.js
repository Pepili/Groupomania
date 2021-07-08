// Récupération du token de l'utilisateur
const token = "Bearer " + sessionStorage.getItem("token");

const arrowProfil = document.getElementById("arrow");
arrowProfil.href += sessionStorage.getItem("id");

// modification du compte
document
  .getElementById("formSettings")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const imageUrl = document.getElementById("imageUrl").files[0];
    const userObject = JSON.stringify({
      username: document.getElementById("userName").value || undefined,
      email: document.getElementById("email").value || undefined,
      presentation:
        document.getElementById("presentationModify").value || undefined,
    });
    let data = null;
    let headers = {
      Accept: "application/json",
      Authorization: token,
    };
    if (imageUrl) {
      const formData = new FormData();
      formData.append("image", imageUrl);
      formData.append("user", userObject);
      data = formData;
    } else {
      data = userObject;
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(
      "http://localhost:3000/api/user/" + sessionStorage.getItem("id"),
      {
        method: "PUT",
        headers,
        body: data,
      }
    );
    if (response.status == 200) {
      alert("Modification sauvegardé!");
    } else {
      alert("Erreur " + response.status + " Veuillez réessayer");
    }
  });

// suppression de compte
document.getElementById("delete").addEventListener("click", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const response = await fetch(
    "http://localhost:3000/api/user/" + sessionStorage.getItem("id"),
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    }
  );
  if (response.status == 200) {
    sessionStorage.clear();
    alert("Votre compte a bien été supprimé!");
    window.location = "/index.html";
  } else {
    alert("Erreur" + response.status + "Veuillez réessayer");
  }
});

// déconnexion
const logOut = document.getElementById("logOut");
logOut.addEventListener("click", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  sessionStorage.removeItem("token");
  alert("Vous vous êtes déconnecté!");
  window.location = "/index.html";
});
