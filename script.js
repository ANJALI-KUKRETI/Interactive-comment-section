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
function insertAfter(Node, newNode) {
  Node.parentNode.insertBefore(newNode, Node.nextSibling);
}

// ==================Comments comments===================

function commentsHTML(comment, row) {
  const html = `  <div class="${row} ro com" data-value=${comment.id}>
  <div class="upper">
  <div class="vote">
    <div class="incr">+</div>
    <div class="val">${comment.score}</div>
    <div class="decr">-</div>
  </div>
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
      <div class="upper">
      <div class="reply">
        <img src="images/icon-reply.svg" alt="" /> Reply
      </div>
      </div>
    </div>
    <div class="two">
       ${
         comment.replyingTo
           ? `<span class="replyingTo">@${comment.replyingTo}</span>`
           : ""
       }
      ${comment.content}
    </div>
  </div>
  <div class="footer">
          <div class="lower">
            <div class="vote">
            <div class="decr">-</div>
              <div class="val">${comment.score}</div>
              <div class="incr">+</div>
            </div>
          </div>
          <div class="lower">
            <div class="reply">
              <img src="images/icon-reply.svg" alt="" /> Reply
            </div>
          </div>
  </div>
</div>`;
  return html;
}

// =========================My comments==========================

function commentMe(inners, row) {
  const innerHTML = `<div class="${row} ro com me"data-value=${inners.id} me">
  <div class="upper">
  <div class="vote">
    <div class="incr">+</div>
    <div class="val">${inners.score}</div>
    <div class="decr">-</div>
  </div>
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
      <div class="upper">
      <div class="rep">
        <div class="delete"><img src="images/icon-delete.svg" alt="">  Delete</div>
        <div class="edit"><img src="images/icon-edit.svg" alt="">Edit</div>
      </div>
      </div>
    </div>
    <div class="two">
    ${
      inners.replyingTo
        ? `<span class="replyingTo">@${inners.replyingTo}</span>`
        : ""
    }
    ${inners.content}
    </div>
  </div>
  <div class="footer">
  <div class="lower">
    <div class="vote">
    <div class="decr">-</div>
      <div class="val">${inners.score}</div>
      <div class="incr">+</div>
    </div>
  </div>
  <div class="lower">
  <div class="rep">
  <div class="delete"><img src="images/icon-delete.svg" alt="">  Delete</div>
  <div class="edit"><img src="images/icon-edit.svg" alt="">Edit</div>
   </div>
   </div>
   </div>
</div>`;
  return innerHTML;
}

// ==================================Reply Box==========================

function createReplyBox(row) {
  html = `
   <div class="inputBox ${row}">
  <img
    src="images/avatars/image-juliusomo.png"
    class="dp"
    id="default-dp"
    alt=""
  />
  <textarea
    class="addComment"
    placeholder="Add a comment..."
    required
  ></textarea>
  <button type="submit" class="replyBtn">Reply</button>
</div>`;
  return html;
}

function createEditBox(row) {
  html = `
   <div class="inputBox ${row}">
  <img
    src="images/avatars/image-juliusomo.png"
    class="dp"
    id="default-dp"
    alt=""
  />
  <textarea
    class="addComment addUpdate"
    placeholder="Add a comment..."
    required
  ></textarea>
  <button type="submit" class="editBtn">Update</button>
</div>`;
  return html;
}

// ============================Delete Modal===========================

function createModal() {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  const scrollTop = `${window.pageYOffset}px`;
  overlay.style.top = scrollTop;
  const html = `
     <h2>Delete Comment</h2>
     <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone</p>
     <div class="btns">
       <button class="cancel">NO,CANCEL</button>
       <button class="deleteBtn">YES,DELETE</button>
     </div>
  `;
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.style.top = `${scrollTop}`;
  modal.innerHTML = html;
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  document.body.style.overflowY = "hidden";
}

// ==============================Delete Functions====================

function deleteById(idDel) {
  const prevComment = JSON.parse(localStorage.getItem("comment")) || [];
  const prevs = prevComment.comments;
  prevComment.comments = prevs.filter((comment) => comment.id != idDel);
  prevs.forEach((prev) => {
    if (prev.replies) {
      prev.replies = prev.replies.filter((comment) => comment.id != idDel);
    }
  });
  localStorage.setItem("comment", JSON.stringify(prevComment));
  addRow();
}
function deleteModal(e) {
  const deleteId = e.target.closest(".ro").dataset.value;
  createModal();
  const cancel = document.querySelectorAll(".cancel");
  const overlay = document.querySelectorAll(".overlay");
  const modal = document.querySelectorAll(".modal");
  const deleteInner = document.querySelectorAll(".deleteBtn");

  cancel.forEach((can, i) => {
    can.addEventListener("click", () => {
      overlay[i].style.display = "none";
      modal[i].style.display = "none";
      document.body.style.overflowY = "auto";
    });
  });
  deleteInner.forEach((del, i) => {
    del.addEventListener("click", () => {
      overlay[i].style.display = "none";
      modal[i].style.display = "none";
      document.body.style.overflowY = "auto";
      deleteById(deleteId);
    });
  });
}
// ========================Edit Functions=========================
function editBar(e) {
  const giveout = e.target.closest(".ro");
  const dataid = giveout.dataset.value;
  const para = giveout.children[1].children[1].innerText;
  // console.log(para);
  if (e.target.classList.contains("edit")) {
    const div = document.createElement("div");
    div.dataset.value = dataid;
    const name = para.split(" ")[0].slice(1);
    if (giveout.classList.contains("row")) {
      div.innerHTML = createEditBox("row");
    } else if (giveout.classList.contains("innerRow")) {
      div.innerHTML = createEditBox("innerRow");
    }
    // console.log(div);
    insertAfter(giveout, div);
    giveout.remove();
    const addComment = document.querySelectorAll(".addUpdate");
    addComment.forEach((addC) => {
      if (addC.parentNode.parentNode.dataset.value == dataid) {
        addC.innerText = para;
      }
    });
    const updateBtn = document.querySelectorAll(".editBtn");
    updateBtn.forEach((update, i) => {
      update.addEventListener("click", (e) => {
        const prevComment = JSON.parse(localStorage.getItem("comment")) || [];
        const prevs = prevComment.comments;
        const comment = addComment[i].value.split(" ").slice(1).join(" ");
        const commentOut = addComment[i].value;

        function updated(r) {
          if (r.id == dataid) {
            return {
              id: Math.floor(Math.random() * (100 - 5)) + 5,
              content: comment,
              createdAt: "pending",
              score: 0,
              replyingTo: name,
              user: {
                image: {
                  png: "./images/avatars/image-juliusomo.png",
                  webp: "./images/avatars/image-juliusomo.webp",
                },
                username: "juliusomo",
              },
              replies: [],
            };
          } else {
            return r;
          }
        }
        function updatedOut(r) {
          if (r.id == dataid) {
            console.log(r);
            return {
              id: Math.floor(Math.random() * (100 - 5)) + 5,
              content: commentOut,
              createdAt: "pending",
              score: 0,
              replyingTo: "",
              user: {
                image: {
                  png: "./images/avatars/image-juliusomo.png",
                  webp: "./images/avatars/image-juliusomo.webp",
                },
                username: "juliusomo",
              },
              replies: [],
            };
          } else {
            return r;
          }
        }
        prevComment.comments = prevs.map(updatedOut);
        for (let i = 0; i < prevs.length; i++) {
          prevs[i].replies = prevs[i].replies.map(updated);
        }
        localStorage.setItem("comment", JSON.stringify(prevComment));
        addRow();
      });
    });
  }
}

// ==========================Add comment=======================

function addComment(e) {
  e.preventDefault();
  const prevComment = JSON.parse(localStorage.getItem("comment")) || [];
  const comment = commentBox.value;
  // console.log(comment);
  jsonObj = {
    id: Math.floor(Math.random() * (100 - 5)) + 5,
    content: comment,
    createdAt: "pending",
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
}

// function tellCreatedAt(creationTime) {
//   // console.log(creationTime);
//   const prevComment = JSON.parse(localStorage.getItem("comment")) || [];
//   const prevs = prevComment.comments;
//   prevs.forEach((prev) => {
//     if (prev.username === prevComment.currentUser.username) {
//       console.log(prev.createdAt);
//     }
//   });
//   let today = new Date();
//   let diff = today.getTime() - creationTime.getTime();
//   console.log(diff);
//   let sec = (diff / 1000).toFixed(0);
//   let min = (diff / (1000 * 60)).toFixed(0);
//   let hrs = (diff / (1000 * 60 * 60)).toFixed(0);
//   let days = (diff / (1000 * 60 * 60 * 24)).toFixed(0);
//   let weeks = (diff / (1000 * 60 * 60 * 24 * 7)).toFixed(0);
//   let months = (diff / (1000 * 60 * 60 * 24 * 31)).toFixed(0);
//   let years = (diff / (1000 * 60 * 60 * 24 * 365)).toFixed(0);

//   if (sec < 60) {
//     return "Now";
//   } else if (min < 60) {
//     return min + " min ago";
//   } else if (hrs < 24) {
//     return hrs + " hr ago";
//   } else if (days < 7) {
//     return days + " day ago";
//   } else if (weeks < 4) {
//     return weeks + " week ago";
//   } else if (months < 12) {
//     return months + " month ago";
//   } else {
//     return years + " year ago";
//   }
// }

// ====================Increment/Decrement function======================

function incrDecr(e, task) {
  const prevComment = JSON.parse(localStorage.getItem("comment")) || [];
  const prevs = prevComment.comments;
  const dataid = e.target.closest(".ro").dataset.value;
  let value = e.target.parentNode.children[1].innerText;
  task === "plus" ? value++ : value > 0 ? value-- : value;
  prevs.forEach((prev) => {
    if (prev.id == dataid) {
      prev.score = value;
    }
    const rep = prev.replies;
    rep.forEach((r) => {
      if (r.id == dataid) {
        r.score = value;
      }
    });
  });
  localStorage.setItem("comment", JSON.stringify(prevComment));
  e.target.parentNode.children[1].innerText = value;
}
function repliesFunc(dataid, name, addReply) {
  const prevComment = JSON.parse(localStorage.getItem("comment")) || [];
  const comment = addReply.value;
  // console.log(comment);
  jsonObj = {
    id: Math.floor(Math.random() * (100 - 5)) + 5,
    content: comment,
    createdAt: "pending",
    score: 0,
    replyingTo: name,
    user: {
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "juliusomo",
    },
    replies: [],
  };
  const prevs = prevComment.comments;
  // console.log(prevs);
  prevs.forEach((prev) => {
    if (prev.id == dataid) {
      // console.log(prev);
      prev.replies.push(jsonObj);
    }
    const rep = prev.replies;
    rep.forEach((r) => {
      if (r.id == dataid) {
        prev.replies.push(jsonObj);
      }
    });
  });
  localStorage.setItem("comment", JSON.stringify(prevComment));
  commentBox.value = "";
  addRow();
}
// ==========================main function======================

async function addRow() {
  container.innerHTML = "";
  const prevComment = JSON.parse(localStorage.getItem("comment")) || [];
  // const prevComment = await getData();

  const comment = prevComment.comments;
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
    if (comment[i].replies.length !== 0) {
      const inners = comment[i].replies;
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

  // ===================Reply=================

  const reply = document.querySelectorAll(".reply");
  reply.forEach((rep) => {
    rep.addEventListener("click", (e) => {
      const current = e.currentTarget;

      const name =
        current.closest(".ro").children[1].children[0].children[0].children[1]
          .innerText;
      // console.log(name);
      const giveout = current.closest(".ro");

      if (e.target.classList.contains("reply")) {
        const div = document.createElement("div");
        if (giveout.classList.contains("row")) {
          div.innerHTML = createReplyBox("row");
        } else if (giveout.classList.contains("innerRow")) {
          div.innerHTML = createReplyBox("innerRow");
        }
        insertAfter(giveout, div);
        const rBtns = document.querySelectorAll(".replyBtn");
        const addReply = document.querySelectorAll(".addComment");
        rBtns.forEach((rBtn, i) => {
          rBtn.addEventListener("click", (e) => {
            const dataid = giveout.dataset.value;
            repliesFunc(dataid, name, addReply[i]);
          });
        });
      }
    });
  });

  // =========================Delete====================

  const deleteBtn = document.querySelectorAll(".delete");
  deleteBtn.forEach((del) => {
    del.addEventListener("click", (e) => {
      deleteModal(e);
    });
  });

  // =======================Edit======================
  const editBtn = document.querySelectorAll(".edit");
  editBtn.forEach((edit) => {
    edit.addEventListener("click", (e) => {
      editBar(e);
    });
  });

  // =====================upvote/Downvote================
  const upvote = document.querySelectorAll(".incr");
  upvote.forEach((up) => {
    up.addEventListener("click", function (e) {
      incrDecr(e, "plus");
    });
  });
  const downvote = document.querySelectorAll(".decr");
  downvote.forEach((down) => {
    down.addEventListener("click", function (e) {
      incrDecr(e, "minus");
    });
  });
}

send.addEventListener("click", (e) => {
  addComment(e);
});

window.addEventListener("load", addRow);
