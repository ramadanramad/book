const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];

document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");

  bookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
  });

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadBooksFromStorage();
  }
});

// Tambah Buku Baru
function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveBooks();
  renderBooks();
  document.getElementById("bookForm").reset();
}

// Render Buku ke DOM
function renderBooks() {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
}

// Buat Elemen Buku
function makeBookElement(book) {
  const title = document.createElement("h3");
  title.textContent = book.title;
  title.setAttribute("data-testid", "bookItemTitle");

  const author = document.createElement("p");
  author.textContent = `Penulis: ${book.author}`;
  author.setAttribute("data-testid", "bookItemAuthor");

  const year = document.createElement("p");
  year.textContent = `Tahun: ${book.year}`;
  year.setAttribute("data-testid", "bookItemYear");

  const toggleButton = document.createElement("button");
  toggleButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleButton.addEventListener("click", function () {
    toggleBookComplete(book.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Hapus Buku";
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.addEventListener("click", function () {
    deleteBook(book.id);
  });

  const editButton = document.createElement("button");
  editButton.textContent = "Edit Buku";
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.addEventListener("click", function () {
    editBook(book.id);
  });

  const container = document.createElement("div");
  container.setAttribute("data-bookid", book.id);
  container.setAttribute("data-testid", "bookItem");
  container.append(title, author, year, toggleButton, deleteButton, editButton);

  return container;
}

// Toggle status selesai/belum selesai
function toggleBookComplete(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;

  book.isComplete = !book.isComplete;
  saveBooks();
  renderBooks();
}

// Hapus Buku
function deleteBook(bookId) {
  books = books.filter((b) => b.id !== bookId);
  saveBooks();
  renderBooks();
}

// Edit Buku (sederhana, hanya mengisi ulang form)
function editBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;

  document.getElementById("bookFormTitle").value = book.title;
  document.getElementById("bookFormAuthor").value = book.author;
  document.getElementById("bookFormYear").value = book.year;
  document.getElementById("bookFormIsComplete").checked = book.isComplete;

  // Hapus buku lama setelah di-edit, nanti akan ditambahkan ulang saat submit
  books = books.filter((b) => b.id !== bookId);
  saveBooks();
  renderBooks();
}

// Cari Buku berdasarkan Judul
function searchBook() {
  const query = document.getElementById("searchBookTitle").value.toLowerCase();
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of books) {
    if (book.title.toLowerCase().includes(query)) {
      const bookElement = makeBookElement(book);
      if (book.isComplete) {
        completeBookList.append(bookElement);
      } else {
        incompleteBookList.append(bookElement);
      }
    }
  }
}

// Simpan ke localStorage
function saveBooks() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

// Load dari localStorage
function loadBooksFromStorage() {
  const storedBooks = localStorage.getItem(STORAGE_KEY);
  if (storedBooks) {
    books = JSON.parse(storedBooks);
    renderBooks();
  }
}

// Cek apakah localStorage tersedia
function isStorageExist() {
  return typeof Storage !== "undefined";
}
