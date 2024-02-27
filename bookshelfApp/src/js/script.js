/** Isi Array
 * [
 *   {
 * id: string | number,
 * title: string,
 * author: string,
 * year: number,
 * isComplete: boolean,
 *}
 * ]
 */

const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "save-event";
const STORAGE_KEY = "BOOK-KEY";

function isStorageExist() {
  if (typeof Storage === "undifined") {
    alert("Sayang sekali, Browser Anda tidak mendukung Web Storage :( ");
    return false;
  }
  return true;
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }
  return -1;
}

function makeBook(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;

  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear);
  container.setAttribute("id", `book-${bookObject.id}`);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action");

  if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.innerText = "Belum selesai di Baca";
    undoButton.classList.add("green");
    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus buku";
    trashButton.addEventListener("click", function () {
      removeBookToCompleted(bookObject.id);
    });

    actionContainer.append(undoButton, trashButton);
    container.append(actionContainer);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = "Selesai di Baca";
    checkButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus buku";
    trashButton.addEventListener("click", function () {
      removeBookToCompleted(bookObject.id);
    });

    actionContainer.append(checkButton, trashButton);
    container.append(actionContainer);
  }

  return container;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const checkbox = document.getElementById("inputBookIsComplete");
  const isComplete = checkbox.checked;

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    bookTitle,
    bookAuthor,
    bookYear,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  alert(`Buku "${bookTitle}" Telah ditambahkan`);
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookToCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  const deleteConfirmation = confirm(
    "Apakah anda yakin mau menghapus buku ini?"
  );

  if (deleteConfirmation) {
    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  // console.log(books)

  const uncompleteBooklist = document.getElementById("incompleteBookshelfList");
  uncompleteBooklist.innerHTML = " ";

  const completeBooklist = document.getElementById("completeBookshelfList");
  completeBooklist.innerHTML = " ";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);

    if (!bookItem.isCompleted) uncompleteBooklist.append(bookElement);
    else completeBooklist.append(bookElement);
  }
});

document.addEventListener(SAVED_EVENT, function () {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  // console.log(data);
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// search feature
const searchBook = document.getElementById("searchBook");
searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.trim()
    .toLowerCase();

  const uncompleteBooklist = document.getElementById("incompleteBookshelfList");
  const completeBooklist = document.getElementById("completeBookshelfList");

  uncompleteBooklist.innerHTML = "";
  completeBooklist.innerHTML = "";

  for (const bookItem of books) {
    if (bookItem.title.trim().toLowerCase().includes(searchTitle)) {
      const bookElement = makeBook(bookItem);

      if (!bookItem.isCompleted) {
        uncompleteBooklist.append(bookElement);
      } else {
        completeBooklist.append(bookElement);
      }
    }
  }
});
