const url = "http://localhost:4000";
async function saveCreditExpense(event) {
  event.preventDefault();
  const form = new FormData(event.target);

  const addCreditExpense = {
    id: form.get("id"),
    description: form.get("description"),
    amount: form.get("amount"),
  };

  if (addCreditExpense.id) {
    const addExp = await axios
      .post(`${url}/edit-credit-expense`, addCreditExpense, {
        headers: { authorization: token },
      })
      .then((result) => {
        alert("credit item edited");
      });
  } else {
    const log = await axios
      .post(`${url}/add-credit-expense`, addCreditExpense, {
        headers: { authorization: token },
      })
      .then((result) => {
        alert("Credit Item added");
        //showExpense([addExpense]);
        // location.href = "http://localhost:4000/add-expense.html";
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await axios
    .get(`${url}/get-credit-expense`, {
      headers: { authorization: token },
    })
    .then((result) => {
      showCreditExpense(
        result.data.creditExpList,
        result.data.sum[0]["SUM(`amount`)"]
      );
    });
});

function showCreditExpense(expenseList, sum) {
  const expensesList = document.getElementById("credit-list");

  expenseList.forEach((expense) => {
    const div = document.createElement("div");
    div.setAttribute("class", "list");
    div.setAttribute("id", `${expense.id}`);

    div.innerHTML = `       
        <div class="show">
            <li>${expense.amount}</li>
            <li id="desc">${expense.description}</li>
        </div>
        <div class="perform">
        <button onclick="getEditExpense(${expense.id})"><span class="material-symbols-outlined">edit</span></button>
        <button onclick="deleteExpense(${expense.id})"><span class="material-symbols-outlined">delete</span></button>
        </div>
    `;

    document.getElementById(
      "sum-of-credit"
    ).innerHTML = `Sum of Expense: ${sum}`;

    expensesList.appendChild(div);
  });
}
