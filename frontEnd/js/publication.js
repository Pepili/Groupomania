const token = "Bearer " + sessionStorage.getItem("token");
const url = "http://localhost:3000/api/publication/";

const arrowProfil = document.getElementById("arrowCreate");
arrowProfil.href += sessionStorage.getItem("id");

// création Publication
document
  .getElementById("formPublication")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const imageUrl = document.getElementById("linkImage").files[0];
    const postObject = JSON.stringify({
      UserId: sessionStorage.getItem("id"),
      text: this.textPublication.value || undefined,
    });
    let data = null;
    let headers = {
      Authorization: token,
      Accept: "application/json",
    };
    if (imageUrl) {
      const formData = new FormData();
      formData.append("image", imageUrl);
      formData.append("text", postObject);
      data = formData;
    } else {
      data = postObject;
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      method: "POST",
      body: data,
      headers,
    });
    if (response.status == 201) {
      alert("publication créée");
      window.location = "./news.html?id=" + sessionStorage.getItem("id");
    } else {
      alert("Erreur " + response.status + " réessayez");
    }
  });
