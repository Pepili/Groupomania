// vérification du compte
document
  .getElementById("formSettings")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // on récupère en type string les values rentrées par l'utilisateur
    let data = JSON.stringify({
      username: this.username.value.trim(),
      response: this.response.value.trim().toLowerCase(),
    });
    // On envoie les values au backend
    const response = await fetch("http://localhost:3000/api/user/response", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: data,
    });
    let apiData = await response.json();
    // On enregistre les données de la response dans le localStorage
    if (response.status == 200) {
      sessionStorage.setItem("id", apiData.UserId);
      const UserId = sessionStorage.getItem("id");
      window.location = "./changePassword.html?id=" + UserId;
    } else {
      alert("Erreur" + response.status + ". Utilisateur introuvable");
    }
  });
