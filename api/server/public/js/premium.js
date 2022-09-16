const url = "http://localhost:4000";
const token = localStorage.getItem("token");
const thirty = document.getElementById("30");
const threeSixFive = document.getElementById("365");

///////////////////////////////////////////////
// package selection
///////////////////////////////////////////////

thirty.addEventListener("click", async function () {
  await axios
    .post(
      `${url}/order`,
      { amount: 100 },
      {
        headers: { authorization: token },
      }
    )
    .then((result) => {
      alert("order created!");

      const payment_buttons = document.getElementById("payment_buttons");
      payment_buttons.style.display = "none";

      const checkoutSection = document.getElementById("checkoutSection");
      checkoutSection.style.display = "block";

      const rzp_text = document.getElementById("checkoutOrderId");
      rzp_text.value = result.data.order.id;
    });
});

threeSixFive.addEventListener("click", async function () {
  await axios
    .post(
      `${url}/order`,
      { amount: 1000 },
      {
        headers: { authorization: token },
      }
    )
    .then(() => {
      alert("order created!");
      const payment_buttons = document.getElementById("payment_buttons");
      payment_buttons.style.display = "none";

      const checkoutSection = document.getElementById("checkoutSection");
      checkoutSection.style.display = "block";

      const rzp_text = document.getElementById("checkoutOrderId");
      rzp_text.value = result.data.order.id;
    });
});

///////////////////////////////////////////////
// checkout section
///////////////////////////////////////////////

function createe() {
  var options = {
    key: "", // razorpay key
    currency: "INR",
    name: "Razor Tutorial",
    description: "Razor Test Transaction",
    image:
      "https://previews.123rf.com/images/subhanbaghirov/subhanbaghirov1605/subhanbaghirov160500087/56875269-vector-light-bulb-icon-with-concept-of-idea-brainstorming-idea-illustration-.jpg",

    order_id: document.getElementById("checkoutOrderId").value,

    handler: function (response) {
      document.getElementById("order-pay-id").value =
        response.razorpay_payment_id;
      document.getElementById("order-id").value = response.razorpay_order_id;
      document.getElementById("order-sig").value = response.razorpay_signature;
    },
    theme: {
      color: "#227254",
    },
  };
  return options;
}

// call event after clicking on checkout

document.getElementById("checkoutButton").onclick = function async(e) {
  var razorpayObject = new Razorpay(createe());

  razorpayObject.on("payment.failed", function (response) {
    alert("This step of Payment Failed");
  });

  razorpayObject.open();
  e.preventDefault();

  const checkoutSection = document.getElementById("checkoutSection");
  checkoutSection.style.display = "none";

  const verifySection = document.getElementById("verifySection");
  verifySection.style.display = "block";
};

///////////////////////////////////////////////
// verify section
///////////////////////////////////////////////

async function verify(event) {
  event.preventDefault();
  const form = new FormData(event.target);

  const verifyData = {
    orderPayId: form.get("order-pay-id"),
    orderId: form.get("order-id"),
    signature: form.get("order-sig"),
  };

  let log = await axios
    .post(`${url}/verify`, verifyData, {
      headers: { authorization: token },
    })
    .then(() => {
      localStorage.setItem("premium", true);
      alert("Enjoy Expense-Tracker Premium ");
    })
    .catch((err) => {
      console.log(err, "unsuccessfull payment");
    });
}
