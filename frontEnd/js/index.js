// Se connecter
// On créer un listener sur le bouton submit
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  // on récupère en type string les values rentrées par l'utilisateur
  let data = JSON.stringify({
    email: this.email.value,
    password: this.password.value,
  });
  // On envoie les values au backend
  const response = await fetch("http://localhost:3000/api/user/login", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: data,
  });
  let apiData = await response.json();
  // On enregistre les données de la response dans le localStorage
  if (response.status == 200) {
    sessionStorage.setItem("token", apiData.token);
    sessionStorage.setItem("id", apiData.UserId);
    sessionStorage.setItem("isAdmin", apiData.isAdmin);
    console.log(apiData);
    const UserId = sessionStorage.getItem("id");
    window.location = "./assets/html/profil.html?id=" + UserId;
  } else {
    alert("Erreur" + response.status + ". Utilisateur introuvable");
  }
});
