// changement de mot de passe

document
  .getElementById("formSettings")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // on récupère en type string les values rentrées par l'utilisateur
    const data = JSON.stringify({
      password: this.password.value.trim(),
    });
    // On envoie les values au backend
    const response = await fetch(
      "http://localhost:3000/api/user/" +
        sessionStorage.getItem("id") +
        "/password",
      {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
        },
        body: data,
      }
    );
    // On enregistre les données de la response dans le localStorage
    if (response.status == 200) {
      sessionStorage.clear();
      alert("Votre mot de passe a bien été modifié!");
      window.location = "/index.html";
    } else {
      alert(
        "Erreur" + response.status + ". Changement de mot de passe impossible"
      );
    }
  });
