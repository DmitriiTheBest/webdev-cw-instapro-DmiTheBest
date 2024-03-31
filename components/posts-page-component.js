import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { deleteFetch, deleteLikes, putLikes } from "../index.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  //const postsHTML = posts.map((post, index) => getListPosts(post, index)).join("");
  let postsHTML = posts
    .map((post) => {
      return `<li class="post">
  <div class="post-header" data-user-id=${post.user.id}>
      <img src=${post.user.imageUrl} class="post-header__user-image">
      <p class="post-header__user-name">${post.user.name}</p>
  </div>
  <div class="post-image-container">
    <img class="post-image" src=${post.imageUrl}>
  </div>
  <div class="post-likes">
    <button data-id=${post.id} data-liked="${post.isLiked}" class="like-button">

    ${
      post.isLiked
        ? `<img src="./assets/images/like-active.svg"></img>`
        : `<img src="./assets/images/like-not-active.svg"></img>`
    }
      
    </button>
    <p class="post-likes-text">
      Нравится: <strong>
     
      ${
        post.likes.length === 0
          ? 0
          : post.likes.length === 1
          ? post.likes[0].name
          : post.likes[post.likes.length - 1].name +
            " и еще " +
            (post.likes.length - 1)
      }    

     
      </strong>
    </p>
  </div>
  <div class="post-block">
  <div>
  <p class="post-text">
    <span class="user-name">${post.user.name}</span>
    ${post.description}
  </p>
  <p class="post-date">
  ${formatDistanceToNow(new Date(post.createdAt), { locale: ru })} back
  </p>
  </div>
  <button data-id=${post.id}  class="button delete-button">Delete</button>
  </div>
  
</li>`;
    })
    .join("");

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                ${postsHTML}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  //удаление записи
  const deleteButtons = document.querySelectorAll(".delete-button");

  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = deleteButton.dataset.id;
      deleteFetch(id);
    });
  }

  //счетчик лайков у каждого комментария
  function getLikePost() {
    const likesButton = document.querySelectorAll(".like-button");
    for (const like of likesButton) {
      like.addEventListener("click", (event) => {
        event.stopPropagation();
        const id = like.dataset.id;
        const liked = like.dataset.liked;

        if (liked == "false") {
          putLikes(id);
        } else {
          deleteLikes(id);
        }
      });
    }
  }
  getLikePost();
}
