const token = localStorage.getItem("token");
if (token) {
  window.location.href = "http://localhost:4000/add-expense.html";
}

async function saveuser(event) {
  event.preventDefault();
  const form = new FormData(event.target);

  const Signup = {
    name: form.get("name"),
    email: form.get("email"),
    phone_number: form.get("ph_num"),
    password: form.get("password"),
  };

  await axios.post("http://localhost:4000/signup", Signup).then(() => {
    alert("signup successfully");
    Window.location.href = "http://localhost:4000/login.html";
  });
}
