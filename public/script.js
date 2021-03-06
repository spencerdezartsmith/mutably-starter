const baseURL = 'http://mutably.herokuapp.com'

// Functions for updating the view
const addListItem = (book) => {
  $('.list-group').append(`
    <li class='list-group-item' id=${book._id}>
      <p class='list-title'>${book.title}</p>
      <div class='list-btns'>
        <button type='button' class='btn btn-default view-btn'>View</button>
        <button type='button' class='btn btn-default edit-btn'>Edit</button>
        <button type='button' class='btn btn-default delete-btn'>Delete</button>
      </div>
    </li>
  `)
}

// Create a new list element for each book
const populateList = (books) => {
  books.forEach((book) => {
    addListItem(book)
  })
}

// Dynamically add a view card for the fetched book
const addViewBookCard = (book) => {
  $(document).find(`#${book._id}`).after(`
    <div class='show-card'>
      <div class='row'>
        <div class='col-sm-3 image-box'>
          <img class='thumbnail' src=${book.image} alt='Book Cover Image' height='230px' width='160px'>
        </div>
        <div class='col-sm-9 details-box'>
          <div class=card-block>
            <h2 class='card-title'>${book.title}</h2>
            <p class='card-text'>Author: ${book.author}</p>
            <p class='card-text'>Release Date: ${book.releaseDate}</p>
            <button class='btn btn-primary close-btn'>Close</button>
          </div>
        </div>
      </div>
    </div>
  `)
}

// Dynamically add an edit card for a fetched book
const addEditBookCard = (book) => {
  $(document).find(`#${book._id}`).after(`
    <div class='edit-card'>
      <div class='row'>
        <div class='col-sm-3 image-box'>
          <img class='thumbnail' src=${book.image} alt='Card image cap' height='230px' width='160px'>
        </div>
        <div class='col-sm-9'>
          <h2>Edit book details</h2>
          <form class='edit-form'>
            <div class='input-section'>
              <label for='title' class='col-sm-3 col-form-label'>Title</label>
              <div class='form-input col-sm-9'>
                <input type='text' class='form-control' id='title' value="${book.title}"'>
              </div>
             </div>
            <div class='input-section'>
              <label for='author' class='col-sm-3 col-form-label'>Author</label>
              <div class='form-input col-sm-9'>
                <input type='text' class='form-control' id='author' value="${book.author}"'>
              </div>
             </div>
            <div class='input-section'>
              <label for='edit-date' class='col-sm-3 col-form-label'>Release Date</label>
              <div class='form-input col-sm-9'>
                <input type='text' class='form-control' id='date' value="${book.releaseDate}"'>
              </div>
            </div>
            <div class='edit-btns'>
              <div class='input-section'>
                <input type='hidden' name='book-image' role='uploadcare-uploader' id='image-'></input>
              </div>
              <button type='submit' class='btn btn-primary form-btn submit-edit-btn'>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `)
}

// Update book title and ID with the new values
const updateSingleListElement = (bookId, updatedBook) => {
  $(document).find(`#${bookId}`).html(`
    <p class='list-title'>${updatedBook.title}</p>
    <div class='list-btns'>
      <button type='button' class='btn btn-default view-btn'>View</button>
      <button type='button' class='btn btn-default edit-btn'>Edit</button>
      <button type='button' class='btn btn-default delete-btn'>Delete</button>
    </div>
  `).attr(updatedBook._id)
}

// Remove element upon delete
const removeBookElement = (bookId) => {
  $(`#${bookId}`).hide('slow', function () {
    $(this).remove()
  })
}

// Functions for interacting with the API
// Grab all books from api
const getAllBooks = () => {
  $.ajax({
    url: `${baseURL}/books`,
    contentType: 'application/json',
    method: 'get',
  })
    .done((response) => {
      populateList(response.books)
    })
    .catch((error) => {
      alert('Oh no! Something went wrong. Please try again.')
    })
}

// Grab one book from api
const getOneBook = (btn, bookId) => {
  $.ajax({
    url: `${baseURL}/books/${bookId}`,
    contentType: 'application/json',
    method: 'get',
  })
    .done((book) => {
      if (btn === 'view') {
        addViewBookCard(book)
      } else {
        addEditBookCard(book)
      }
    })
}

// Delete book entry from the page
const deleteOneBook = (bookId) => {
  $.ajax({
    url: `${baseURL}/books/${bookId}`,
    contentType: 'application/json',
    method: 'delete',
  })
    .done(() => {
      removeBookElement(bookId)
    })
    .catch((error) => {
      console.error('Error: ', error)
      alert('Oh no! Something when wrong. Please try again.')
    })
}

// Edit book details
const updateBookDetails = (bookId, updatedDetails) => {
  $.ajax({
    url: `${baseURL}/books/${bookId}`,
    contentType: 'application/json',
    method: 'put',
    data: JSON.stringify(updatedDetails),
  })
    .done((updatedBook) => {
      alert('Book updated successfully!')
      updateSingleListElement(bookId, updatedBook)
    })
    .catch((error) => {
      console.error('Error: ', error)
      alert('Oh no! Something when wrong. Please try again.')
    })
}

// Add a new book
const addNewBook = (bookDetails) => {
  $.ajax({
    url: `${baseURL}/books`,
    contentType: 'application/json',
    method: 'post',
    data: JSON.stringify(bookDetails),
  })
    .done((savedBook) => {
      addListItem(savedBook)
      $('#myModal').modal('hide')
    })
    .catch((error) => {
      console.error('Error: ', error)
      alert('Oh no! Something when wrong. Please try again.')
    })
}

// Controllers

$(document).ready(() => {
  getAllBooks(baseURL)

  $(document).on('click', '.view-btn', function () {
    const bookId = $(this).closest('li').attr('id')
    if ($('.show-card').length) {
      $('.show-card').remove()
    } else {
      getOneBook('view', bookId)
    }
  })

  $(document).on('click', '.close-btn', function () {
    $(this).closest('div.show-card').remove()
  })

  $(document).on('click', '.delete-btn', function () {
    const bookId = $(this).closest('li').attr('id')
    $(document).find('.edit-card').remove()
    $(document).find('.show-card').remove()
    deleteOneBook(bookId)
  })

  $(document).on('click', '.edit-btn', function () {
    const bookId = $(this).closest('li').attr('id')
    if ($('.edit-card').length) {
      $('.edit-card').remove()
    } else {
      getOneBook('edit', bookId)
    }
  })

  $(document).on('click', '.submit-edit-btn', function (event) {
    event.preventDefault()
    const bookId = $(this).closest('div.edit-card').prev().attr('id')
    const image = $(this).closest('div.edit-card').children().children('.image-holder').children().attr('src')
    const title = $(this).parent().parent().find('input#title').val()
    const author = $(this).parent().parent().find('input#author').val()
    const releaseDate = $(this).parent().parent().find('input#date').val()
    const details = {
      title,
      author,
      releaseDate,
      image,
    }
    updateBookDetails(bookId, details)
    $(document).find('div.edit-card').remove()
  })

  $(document).on('click', '.add-btn', () => {
    $('#myModal').modal('show')
  })

  $(document).on('click', '.add-new-submit', function (event) {
    event.preventDefault()
    const image = $(this).parent().prev().find('input#image').val()
    const title = $(this).parent().prev().find('input#title').val()
    const author = $(this).parent().prev().find('input#author').val()
    const releaseDate = $(this).parent().prev().find('input#date').val()
    const details = {
      title,
      author,
      releaseDate,
      image,
    }
    addNewBook(details)
  })
})
