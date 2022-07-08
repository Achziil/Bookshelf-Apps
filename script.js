// {
//       id: string | number,
//       title: string,
//       author: string,
//       year: number,
//       isComplete: boolean,
// }

// event for load fully our display
document.addEventListener("DOMContentLoaded", function () {
 
      const submitForm = document.getElementById("inputBook");
      submitForm.addEventListener("submit", function (event) {
          event.preventDefault();
          addBook();
      });

      if(isStorageExist()){
        loadDataFromStorage();
    }
  });

  function generateId() {
    return +new Date();
}
 
// function for generate Objek "Book"
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

// function for get book value and generate id for temp save it and push it too object
  function addBook() {
      const titleBook = document.getElementById("inputBookTitle").value;
      const authorBook = document.getElementById("inputBookAuthor").value;
      const yearBook = document.getElementById("inputBookYear").value;
      const compBook = document.getElementById("inputBookIsComplete").checked;
      
    
      const generatedID = generateId();
      const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, compBook);
      books.push(bookObject);

      
     
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
   }
   //for make some custom event
   const books = [];
   const RENDER_EVENT = "render-book";

   //display all bookElement that we create for each shelf
   document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById("incompleteBookshelfList");
    uncompletedBookList.innerHTML = "";
 
    const completedBookList = document.getElementById("completeBookshelfList");
    completedBookList.innerHTML = "";
    for(bookItem of books){
        const bookElement = makeBookStatus(bookItem);
     
        if(bookItem.isCompleted == false)
            uncompletedBookList.append(bookElement);
        else
            completedBookList.append(bookElement);
    }
    
 });
// event menggangti text content submit
 const checkbox = document.getElementById("inputBookIsComplete");
 const spanobject = document.getElementById("submitbuttonspan");
 checkbox.addEventListener("change", function () {
   if (checkbox.checked == true){
     spanobject.textContent = "Selesai dibaca"
   }
   else {
     spanobject.textContent = "Belum selesai dibaca"
   }
 })

// main function that will make whole book status and button inside it
 function makeBookStatus(unCompleteBook) {
 
    const textTitle = document.createElement("h3");
    textTitle.innerText = unCompleteBook.title;
  
    const textAuthor = document.createElement("p");
    textAuthor.innerText = `Penulis : ${unCompleteBook.author}`;
    
    const textYear = document.createElement("p");
    textYear.innerText = `Tahun : ${unCompleteBook.year}`;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action")

    const container = document.createElement("article");
    container.classList.add("book_item")
    container.append(textTitle,textAuthor,textYear,buttonContainer);
    container.setAttribute("id", `bookID-${unCompleteBook.id}`);

    //filtersearchbyname
    const searchbar = document.getElementById('searchSubmit')
    searchbar.addEventListener("click", function (event){
      event.preventDefault();
      const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
      const bookList = document.querySelectorAll('.book_item > h3');
          for (book of bookList) {
        if (searchBook !== book.innerText.toLowerCase()) {
          book.parentElement.style.display = "none";
        } else {
          book.parentElement.style.display = "block";
        }
      }
  })

    // if for display button
    if(unCompleteBook.isCompleted){
 
        const unreadButton = document.createElement("button");
        unreadButton.classList.add("blue");
        unreadButton.innerText = "Belum selesai di Baca";
        unreadButton.addEventListener("click", function () {
            bookUncompletedRead(unCompleteBook.id);
        });
   
        const trashButton = document.createElement("button");
        trashButton.classList.add("red");
        trashButton.innerText = "Hapus buku";
        trashButton.addEventListener("click", function () {
            confirmAction(unCompleteBook.id);
        });
   
        buttonContainer.append(unreadButton, trashButton);
        } 

        else {
        const checkButton = document.createElement("button");
        checkButton.classList.add("green");
        checkButton.innerText = "Selesai dibaca";
        checkButton.addEventListener("click", function () {
            addBookToCompleted(unCompleteBook.id);
        })
        const trashButton = document.createElement("button");
        trashButton.classList.add("red");
        trashButton.innerText = "Hapus buku";
        trashButton.addEventListener("click", function () {
            confirmAction(unCompleteBook.id);
        });;
   
        buttonContainer.append(checkButton, trashButton);
    }

    return container;
 }

 //dialog box for delete book
 function confirmAction(bookElement) {
  const bookTarget = findBook(bookElement);
  let confirmAction = confirm(`are you sure to delete book with title " ${bookTarget.title} " ?`);
  if (confirmAction) {
    removeBookFromUncompleted(bookElement);
    removeBookFromCompleted(bookElement);
    alert(`book with title " ${bookTarget.title} " successfully deleted`);
  } else {
    alert("delete action canceled");
  }
}

//findbook by id
function findBook(bookId){
  for(bookItem of books){
      if(bookItem.id === bookId){
          return bookItem
      }
  }
  return null
}

//findbook with index
  function findBookIndex(bookId) {
    for(index in books){
        if(books[index].id === bookId){
            return index
        }
    }
    return -1
 }
// all other function that inside the main function
 function addBookToCompleted(bookId) {
 
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
  
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
 }

  function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;
    books.splice(bookTarget, 1);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function removeBookFromUncompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;
    books.splice(bookTarget, 1);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function bookUncompletedRead(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
   
   
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  //function for save data
  function saveData() {
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }
  const SAVED_EVENT = "saved-book";
  const STORAGE_KEY = "Bookshelf_Apps";

function isStorageExist() /* boolean */ {
  if(typeof(Storage) === undefined){
      alert("Browser kamu tidak mendukung local storage");
      return false
  }
  return true;
}
// function for load data
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
 
  let data = JSON.parse(serializedData);
 
  if(data !== null){
      for(book of data){
          books.push(book);
      }
  }
 
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}