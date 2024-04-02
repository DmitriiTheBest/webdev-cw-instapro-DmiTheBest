// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "DmitriiTheBest";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

// функция getPosts делает запросы к API на получение постов
export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("No authorization");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

// функция registerUser делает запросы на регистрацию
// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Such user already exists");
    }
    return response.json();
  });
}

// функция loginUser делает запросы на логин
export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Login or password is incorrect");
    }
    return response.json();
  });
}

// функция uploadImage делает запросы на загрузку картинки в облако
// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

// # написать функцию для отправления новых данных
export const postPosts = ({ token, description, imageUrl }) => {
  return fetch(postsHost, {
    method: "POST",
    body: JSON.stringify({
      description,
      imageUrl,
    }),
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 500) {
      throw new Error("Server is broken");
    } else if (response.status === 400) {
      throw new Error("Bad request");
    } else {
      return response.json();
    }
  });
};

// # написать функцию для удаления поста
export const deletePost = (id, { token }) => {
  return fetch(`${postsHost}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    return response.json();
  });
};

// # получаем посты конкретного пользователя (юзера)
export const fetchPostsUser = ({id, token }) => {
  return fetch(`${postsHost}/user-posts/${id}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
};

// # adding likes
export const addLike = (id, { token }) => {
  return fetch(`${postsHost}/${id}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    throw new Error("Only authorized users can add likes");
  });
};

// # removing likes
export const removeLike = (id, { token }) => {
  return fetch(`${postsHost}/${id}/dislike`, {
    method: "DELETE",
    // method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    throw new Error("Only authorized users can remove likes");
  });
};

// API is ready
