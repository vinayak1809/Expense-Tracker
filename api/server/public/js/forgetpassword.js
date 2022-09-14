const url = "http://localhost:4000";

async function saveMail(event) {
  event.preventDefault();

  const form = new FormData(event.target);

  const submitMail = {
    mail: form.get("email"),
  };
  document.getElementById("chpass").style.display = "block";
}
