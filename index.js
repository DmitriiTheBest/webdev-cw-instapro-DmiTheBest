import { getPosts, postPosts, deletePost, fetchPostsUser, addLike, removeLike } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

// объявление функции logout
export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Turns the application page on - включает приложение
 */

// # Написать функцию getApi
// # которая будет делать запросы к API на получение постов

// объявление функции getApi
// export const getApi = () => {
//   getPosts({ token: getToken() }).then((data) => {
//     posts = data;
//     goToPage(POSTS_PAGE);
//   });
// }

function getAPI() {
  return getPosts({ token: getToken() })
    .then((newPosts) => {
      page = POSTS_PAGE;
      posts = newPosts;
      renderApp();
    })
    .catch((error) => {
      console.error(error);
      goToPage(POSTS_PAGE);
    });
}

// объявление функции goToPage
// принимает параметрами переменную newPage и данные (data)
// newPage должна быть одной из переменных
// либо POSTS_PAGE, либо AUTH_PAGE, либо ADD_POSTS_PAGE, либо USER_POSTS_PAGE, либо LOADING_PAGE
// все эти константы (переменные) хранятся в файле routes и импортятся из файла routes.js
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE, // страница постов
      AUTH_PAGE, // страница авторизации
      ADD_POSTS_PAGE, // страница добавления поста
      USER_POSTS_PAGE, // страница постов пользователя (юзера)
      LOADING_PAGE, // страница загрузки
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
      // проверяем если юзер указан, то в переменную page записываем ADD_POSTS_PAGE, иначе AUTH_PAGE
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      // TODO: реализовать получение постов юзера из API
      console.log("Открываю страницу пользователя: ", data.userId);
      page = USER_POSTS_PAGE;
      // posts = [];
      renderApp();

      return fetchPostsUser({id: data.userId, token: getToken() })
        .then((newPosts) => {
          page = USER_POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
        });
    }
    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

// объявление функции renderApp
const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        // TODO: реализовать добавление поста в API
        console.log("Добавляю пост...", { description, imageUrl });
        // goToPage(POSTS_PAGE)
        postPosts({ token: getToken(), description, imageUrl })
          .then(() => {
            goToPage(POSTS_PAGE);
          })
          .catch((error) => {
            // в объекте error есть свойство message, которое содержит текст ошибки
            // Если сервер сломался, то просим пользователя попробовать позже ещё раз
            if (error.message === "Server is broken") {
              alert("Server is broken. Try again later.");
              postPosts({ token: getToken(), description, imageUrl });
            } else {
              alert(
                "Seems your internet connection is broken. Try again later."
              );
              console.log(error);
            }
          });
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {
    // TODO: реализовать страницу фотографию пользвателя
    appEl.innerHTML = "Здесь будет страница фотографий пользователя";
    return renderPostsPageComponent({ appEl });
  }
};

// функция gotopage - в нее передается переменная postpage,
// которая в свою очередь импортируется из routes.js
// сама функция gotopage объявлена чуть выше,
// и она же является точкой входа в приложение

goToPage(POSTS_PAGE); // включает страницу приложения
// goToPage(LOADING_PAGE); // появится страница с загрузкой
// goToPage(AUTH_PAGE); // открывается страница входа и авторизации

export function deleteFetch(id) {
  if (user) {
    deletePost(id, { token: getToken() }).then((newPosts) => {
      posts = newPosts;
      getAPI();
    });
  }
}

export function putLikes(id) {
  addLike(id, { token: getToken() })
    .then(() => {
      getAPI();
    })
    .catch((error) => {
      alert(error.message);
      goToPage(AUTH_PAGE);
    });
}

export function deleteLikes(id) {
  removeLike(id, { token: getToken() })
    .then(() => {
      getAPI();
    })
    .catch((error) => {
      alert(error.message);
      goToPage(AUTH_PAGE);
    });
}

/**
 * Что есть и Порядок действий:
 *
 * что есть:
 *  1. Главная страница (посты) Есть верстка для списка постов. Хардкодная, с API не интегрирована.
 *  2. Страница авторизации.
 *  3. Страница добавления поста. Не реализована страница добавления поста
 *  4. Лайки не работают.
 */

// Начинать с Post page component (она главная) - интегрировать

// Работа со страницей постов пользователя
// создать компонент userPagePostComponent - рендер шапки, разметка (шаблон)
// создать GET запрос на апи для получения постов пользователя (он будет в api.js)
// айдишник пользователя лежит в шапке поста в дата атрибуте. (data-user-id="642d00329b190443860c2f31">)
// запрос вызывается в индекс js.
//
//
// Сделать лайки. (функция)
// дизлайки
//
// Страница добавления поста
// создать запрос на добавление поста (в апи джи эс)
// Компонент загрузки изображений
//
// Добавить textArea для того, чтоб добавлять описание картинки (в add post page component)
// Сделать запрос
// Валидация при отправке

//
