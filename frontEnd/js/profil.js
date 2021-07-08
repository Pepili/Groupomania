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
    const url = new URLSearchParams(document.location.search);
    const id = url.get("id");
    const profile = await getProfil(id);
    const linkSetting = document.getElementById("linkSetting");
    linkSetting.href += id;
    const createPublication = document.getElementById("createPublication");
    createPublication.href += id;
    const userProfile = document.getElementById("profilInformation");
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
