'use strict'

const STORAGE_KEY = 'booksDB'
const PAGE_SIZE = 5

var gBooksNames = ['Harry Potter','Percy Jackson','Hamosad','puki','5 Baloons','The Maze','Hanger games',
                'The Bible','it','I am So Glad You Were Born',
                'Busy Betty','Stephen King','The Boys from Biloxi','Cooking from the Spirit']

var gBooks
var gCurrBooksLen
var gPageIdx = 0
var gFilterBy = {
    maxPrice: Infinity,
    minRate: 0,
    txt: ''
}

_createBooks()

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        books = gBooksNames
        books = books.map(name => _createBook(name, getRandomIntInclusive(50, 500)))
    }
    gBooks = books
    _saveBooksToStorage()
}

function addBook(name, price) {
    const book = _createBook(name, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
}

function _createBook(name, price,id = makeId()) {
    return {
        id: id ,
        name,
        price: price,
        imgUrl: '',
        rate: 0
    }
}

function getBooksForDisplay() {
    const startIdx = gPageIdx * PAGE_SIZE
    var books = gBooks
    books = books.filter(book => {
        return book.name.toLowerCase().includes(gFilterBy.txt.toLowerCase())
    })
    books = books.filter(book => {
        return book.price <= gFilterBy.maxPrice && book.rate >= gFilterBy.minRate})
    gCurrBooksLen = books.length
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function updateBook(bookId, newPrice) {
    const book = _getBookById(bookId)
    book.price = newPrice
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function getBookName(bookId) {
    const bookName = _getBookById(bookId).name
    return getTrans(bookName)
}

function decreaseBookRate(bookId) {
    const book = _getBookById(bookId)
    book.rate--
    _saveBooksToStorage()
}

function addBookRate(bookId) {
    const book = _getBookById(bookId)
    book.rate++
    _saveBooksToStorage()
}

function _getBookById(bookId){
    return gBooks.find(book => book.id === bookId)
}

function getBookRate(bookId){
    const book = _getBookById(bookId)
    return book.rate
}

function setFilterStatus(filter,value){
    gFilterBy[filter] = value
}

function setFilterValue(value){
    gFilterBy.txt = value
}

function setFullFilter(filter){
    gFilterBy = filter
}

function getBooksFilter() {
    return gFilterBy
}

function setBookSort(sortBy = {}){
    if (sortBy.price !== undefined) {
        gBooks.sort((c1, c2) => (c1.price - c2.price) * sortBy.price)
    } else if (sortBy.name !== undefined) {
        gBooks.sort((c1, c2) => c1.name.localeCompare(c2.name) * sortBy.name)
    }
}

function changePage(change){
    switch(change) {
        case 'next':
            if (isLastPage(gPageIdx + 1)) {
                gPageIdx = 0
                break;
            }
            gPageIdx++
          break;
        case 'prev':
            
            gPageIdx--
            if (gPageIdx < 0){
                gPageIdx = Math.ceil(gCurrBooksLen / 5) - 1
            }
          break;
        default:
            if (gPageIdx < 2){
                gPageIdx = +change
            } else if (change === 0){
                gPageIdx--
            }else gPageIdx++
      }    
}

function getPageNum(){
    return gPageIdx + 1
}

function isLastPage(page){
    return ((page) === Math.ceil(gCurrBooksLen / 5) )
}

function setUserMode(mode){
    saveToStorage('favLayout',mode)
}

function getUserMode(){
    return loadFromStorage('favLayout')
}

function getEmptyBook(){
    return _createBook('', '','')
}