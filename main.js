// Do your work here...
const localStorageBookList = localStorage.getItem("bookList");
const bookList = localStorageBookList ? JSON.parse(localStorageBookList) : [];

function addBook() {
  const id = +new Date();
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id,
    title,
    author,
    year,
    isComplete,
  };
  bookList.push(newBook);
  localStorage.setItem("bookList", JSON.stringify(bookList));
}

function createButton(type, text, id, isComplete) {
  const buttonElement = document.createElement("button");
  buttonElement.innerHTML = text;
  buttonElement.setAttribute("data-testid", id);

  if (type === "complete") {
    buttonElement.classList.add(
      "bg-green-200",
      "text-green-800",
      "px-3",
      "py-1",
      "hover:bg-green-300",
      "cursor-pointer"
    );
    buttonElement.setAttribute("data-testid", "bookItemIsCompleteButton");
    buttonElement.addEventListener("click", function () {
      const bookList = updateIsCompleteBookDataById(id, isComplete);
      displayBookList(bookList);
    });
  } else if (type === "delete") {
    buttonElement.classList.add(
      "bg-red-200",
      "text-red-800",
      "px-3",
      "py-1",
      "hover:bg-red-300",
      "cursor-pointer"
    );
    buttonElement.setAttribute("data-testid", "bookItemDeleteButton");
    buttonElement.addEventListener("click", function () {
      const bookList = deleteBookListById(id);
      displayBookList(bookList);
    });
  }

  return buttonElement;
}

function createButtonGroup(isComplete, id) {
  const containerButton = document.createElement("div");
  containerButton.classList.add("flex", "gap-2", "mt-4", "justify-around");

  const text = isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
  containerButton.append(createButton("complete", text, id, isComplete));
  containerButton.append(createButton("delete", "Hapus", id, isComplete));

  return containerButton;
}

function createBookElement({ id, title, author, year, isComplete }) {
  const titleElement = document.createElement("h3");
  titleElement.setAttribute("data-testid", "bookItemTitle");
  titleElement.innerText = title;

  const authorElement = document.createElement("p");
  authorElement.setAttribute("data-testid", "bookItemAuthor");
  authorElement.innerText = `Penulis: ${author}`;

  const yearElement = document.createElement("p");
  yearElement.setAttribute("data-testid", "bookItemYear");
  yearElement.innerText = `Tahun: ${year}`;

  const contentContainer = document.createElement("div");
  contentContainer.setAttribute("data-testid", "bookItem");
  contentContainer.setAttribute("data-bookid", id);
  contentContainer.append(titleElement, authorElement, yearElement);

  const container = document.createElement("article");
  container.append(contentContainer);

  const containerButton = createButtonGroup(isComplete, id);

  container.append(containerButton);
  return container;
}

function displayBookList(bookList) {
  const listBookIncomplete = document.getElementById("incompleteBookList");
  const listBookComplete = document.getElementById("completeBookList");
  listBookIncomplete.innerHTML = "";
  listBookComplete.innerHTML = "";

  bookList.map((book) => {
    book.isComplete
      ? listBookComplete.appendChild(createBookElement(book))
      : listBookIncomplete.appendChild(createBookElement(book));
  });
}

function deleteBookListById(id) {
  const newBookList = bookList.filter((item) => item.id !== id);
  localStorage.setItem("bookList", JSON.stringify(newBookList));
  bookList.length = 0;
  bookList.push(...newBookList);
  return newBookList;
}

function updateIsCompleteBookDataById(id, isComplete) {
  const newBookList = bookList.map((item) => {
    if (item.id === id) {
      return { ...item, isComplete: !isComplete };
    }
    return item;
  });
  localStorage.setItem("bookList", JSON.stringify(newBookList));
  bookList.length = 0;
  bookList.push(...newBookList);
  return newBookList;
}

document.addEventListener("DOMContentLoaded", function () {
  displayBookList(bookList);

  const submitBookForm = document.getElementById("bookForm");
  submitBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();

    displayBookList(bookList);
  });
});
