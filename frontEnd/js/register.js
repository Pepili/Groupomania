document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  let data = JSON.stringify({
    username: this.userName.value.trim(),
    password: this.password.value.trim(),
    email: this.email.value.trim(),
    question: this.answer_select.value.trim(),
    response: this.response.value.trim().toLowerCase(),
  });
  fetch("http://localhost:3000/api/user/signup", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: data,
  })
    .then((response) => {
      console.log(response);
      window.location = "/index.html";
    })
    .catch((error) => console.log(error));
});
