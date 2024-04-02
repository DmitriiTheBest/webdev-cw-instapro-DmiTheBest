import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

let imageUrl = "";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      
      <div class="add-form">
      <h2 class="add-form__title">Add a new post</h2>
      <div class="upload-image-container"></div>
      
      <label>
      Describe a photo:
      <br>
      <textarea class="add-form__text" type="textarea" rows="7"></textarea>
      </label>

      <button class="button" id="add-button">Add</button></div>
    
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {
      if (!imageUrl) {
        alert("Choose an image, please!");
        return;
      }
      if (!(document.querySelector(".add-form__text").value)) {
        alert("Photo description is not completed!");
        return;
      }

      onAddPostClick({
        description: document.querySelector(".add-form__text").value
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;"),
        imageUrl: imageUrl,
      });
        });
  };

  render();
}
