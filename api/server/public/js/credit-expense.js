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
        result.data.sum[0]["SUM(`creditAmount`)"]
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
            <li>${expense.creditAmount}</li>
            <li id="desc">${expense.description}</li>
        </div>
        <div class="perform">
        <button onclick="getEditCreditExpense(${expense.id})"><span class="material-symbols-outlined">edit</span></button>
        <button onclick="deleteExpense(${expense.id})"><span class="material-symbols-outlined">delete</span></button>
        </div>
    `;

    document.getElementById(
      "sum-of-credit"
    ).innerHTML = `Sum of Expense: ${sum}`;

    expensesList.appendChild(div);
  });
}

////////////////////////////////////////////////////
// edit credit expense
////////////////////////////////////////////////////

async function getEditCreditExpense(id) {
  data = { id: id };

  await axios
    .get(`http://localhost:4000/get-edit-credit-expense/?id=${id}`, {
      headers: { authorization: token },
    })
    .then((result) => {
      const expense = result.data.expense[0];
      console.log(expense, "expense");
      document.getElementById("id").value = expense.id;
      document.getElementById("description").value = expense.description;
      document.getElementById("amount").value = expense.creditAmount;
    })
    .catch((err) => {
      console.log("error in edit expense", err);
    });
}

const newCre = document.getElementById("newCre");
newCre.addEventListener("click", () => {
  document.getElementById("id").value = "";
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
});
