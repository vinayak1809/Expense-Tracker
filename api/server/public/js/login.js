const token = localStorage.getItem("token");

if (token) {
  window.location.href = "http://localhost:4000/add-expense.html";
}

async function loginuser(event) {
  event.preventDefault();
  const form = new FormData(event.target);

  const loginDetails = {
    email: form.get("email"),
    password: form.get("password"),
  };

  let log = await axios.post("http://localhost:4000/login", loginDetails);

  if (log.data.success == true) {
    alert(log.data.message);
    localStorage.setItem("token", log.data.token);
    localStorage.setItem("NumberOfExpense", 3);
    window.location.href = "http://localhost:4000/add-expense.html";
  }
  if (log.data.success == false) {
    window.alert(log.data.message);
  }
}
