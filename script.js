const container = document.querySelector(".container");
const commentBox = document.querySelector(".addComment");
const send = document.querySelector(".send");

//Fetching data from JSON

async function getData() {
  const res = await fetch("data.json");
  const data = await res.json();
  localStorage.setItem("comment", JSON.stringify(data));
  // console.log(data);
  return data;
}
function commentsHTML(comment, row) {
  const html = `  <div class="${row}" data-value=${comment.id}>
  <div class="vote">
    <div class="incr">+</div>
    <div class="val">${comment.score}</div>
    <div class="decr">-</div>
  </div>
  <div class="details">
    <div class="one">
      <div class="personal">
        <img
          src="${comment.user.image.png}"
          alt=""
          class="dp"
        />
        <div class="name">${comment.user.username}</div>
        <div class="time">${comment.createdAt}</div>
      </div>
      <div class="reply">
        <img src="images/icon-reply.svg" alt="" /> Reply
      </div>
    </div>
    <div class="two">
      ${comment.content}
    </div>
  </div>
</div>`;
  return html;
}

function commentMe(inners, row) {
  const innerHTML = `<div class="${row} me"data-value=${inners.id} me">
  <div class="vote">
    <div class="incr">+</div>
    <div class="val">${inners.score}</div>
    <div class="decr">-</div>
  </div>
  <div class="details">
    <div class="one">
      <div class="personal">
        <img
          src="${inners.user.image.png}"
          alt=""
          class="dp"
        />
        <div class="name">${inners.user.username}</div>
        <div class="you">you</div>
        <div class="time">${inners.createdAt}</div>
      </div>
      <div class="reply">
        <div class="delete"><img src="images/icon-delete.svg" alt="">  Delete</div>
        <div class="edit"><img src="images/icon-edit.svg" alt="">Edit</div>
      </div>
    </div>
    <div class="two">
    ${inners.content}
    </div>
  </div>
</div>`;
  return innerHTML;
}
async function addRow() {
  container.innerHTML = "";
  const prevComment = JSON.parse(localStorage.getItem("comment")) || [];
  // const prevComment = await getData();

  const comment = prevComment.comments;
  // console.log(comment);
  for (let i = 0; i < comment.length; i++) {
    if (comment[i].user.username !== prevComment.currentUser.username) {
      container.insertAdjacentHTML(
        "beforeend",
        commentsHTML(comment[i], "row")
      );
    } else {
      container.insertAdjacentHTML("beforeend", commentMe(comment[i], "row"));
    }

    const innerContainer = document.createElement("div");
    innerContainer.classList.add("innerContainer");
    container.appendChild(innerContainer);
    // console.log(innerContainer);
    console.log(comment[i].replies);
    if (comment[i].replies.length !== 0) {
      const inners = comment[i].replies;
      // console.log(inners);
      for (let i = 0; i < inners.length; i++) {
        if (inners[i].user.username !== prevComment.currentUser.username) {
          innerContainer.insertAdjacentHTML(
            "beforeend",
            commentsHTML(inners[i], "innerRow")
          );
        } else {
          innerContainer.insertAdjacentHTML(
            "beforeend",
            commentMe(inners[i], "innerRow")
          );
        }
      }
    }
  }
}
send.addEventListener("click", () => {
  const prevComment = JSON.parse(localStorage.getItem("comment")) || [];
  const comment = commentBox.value;
  console.log(comment);
  jsonObj = {
    id: Math.floor(Math.random() * (100 - 5)) + 5,
    content: comment,
    createdAt: "hey",
    score: 0,
    user: {
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "juliusomo",
    },
    replies: [],
  };
  prevComment.comments.push(jsonObj);
  localStorage.setItem("comment", JSON.stringify(prevComment));
  commentBox.value = "";
  addRow();
});

window.addEventListener("load", addRow);

// addRow();
