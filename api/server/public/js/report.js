const token = localStorage.getItem("token");

const url = "http://localhost:4000";

// window.addEventListener("DOMContentLoaded", async () => {
//   await axios
//     .get(`${url}/report`, {
//       headers: { authorization: token },
//     })
//     .then((result) => {
//       console.log(result.data);
//     });
// });

function addURL(URL) {
  const link = document.getElementById("link");

  var anchorTag = document.createElement("a");
  anchorTag.id = "dlink";
  anchorTag.href = URL;
  anchorTag.innerHTML = "Click on link to download the file";
  link.appendChild(anchorTag);
}

async function downloadbtn() {
  const done = await axios
    .get(`${url}/download`, {
      headers: { authorization: token },
    })
    .then((response) => {
      if (response.status === 200) {
        addURL(response.data.fileUrl);
      } else {
        console.log("response.data.message");
      }
    })
    .catch((err) => {
      console.log("errrr:", err.status);
    });
}

async function downloadLink() {
  const anchorTag = document.getElementById("dlink");
  const fileURL = anchorTag.href;
  console.log(fileURL);
  await axios
    .post(
      `${url}/postFile`,
      { fileURL: fileURL },
      {
        headers: { authorization: token },
      }
    )
    .then((result) => {
      console.log("done", result);
    });
}

window.addEventListener("DOMContentLoaded", async () => {
  await axios
    .get(`${url}/getFile`, {
      headers: { authorization: token },
    })
    .then((records) => {
      console.log(records.data.records[0]);
      const record = document.getElementById("file-records");
      record.innerHTML = `file URL: ${records.data.records[0].fileUrl} and created on :${records.data.records[0].createdAt}`;
    });
});
