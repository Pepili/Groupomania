// Récupération des informations de l'utilisateur
const token = "Bearer " + sessionStorage.getItem("token");

async function getProfil(id) {
  response = await fetch(`http://localhost:3000/api/user/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return await response.json();
}
async function displayProfil() {
  try {
    // Je récupère l'id dans l'url
    const url = new URLSearchParams(document.location.search);
    const id = url.get("id");
    const profile = await getProfil(id);
    // J'ajoute l'id dans les liens
    const linkSetting = document.getElementById("linkSetting");
    linkSetting.href += id;
    const createPublication = document.getElementById("createPublication");
    createPublication.href += id;
    const userProfile = document.getElementById("profilInformation");
    // J'affiche les données users dans le profil
    userProfile.innerHTML = /* html */ `
      <img src="${profile.imageUrl}" alt="Photo de profil" />
      <div class="profilPresentation">
        <h2>${profile.username}</h2>
        <p>${profile.presentation}</p>
      </div>
    `;
  } catch (error) {
    alert("Désolé, vous n'avez pas accès à ce profil");
    window.location = "/index.html";
  }
}
displayProfil();
