'use strict'

var gIdxBookOpen

function onInit(){
    renderFilterByQueryStringParams()
    setBookSort({price: 1})
    renderMode()
    renderBooks()
    setDirection(getlang())
    doTrans()
    renderReadBook()
}

function renderBooks(){
    var mode = getUserMode() || 'table'
    var books = getBooksForDisplay()
    renderPageBar()
    var strHtmls
    var elSection = document.querySelector('.books-for-shop')
    var elTbody = document.querySelector('tbody')
    var elTable = document.querySelector('table')
    var elMode1 = document.querySelector('#btnradio1')
    var elMode2 = document.querySelector('#btnradio2')
    elTable.style.display = (mode === 'cards') ? 'none' : ''
    if (mode === 'table'){
        elMode1.checked = true
        strHtmls = books.map((book,idx) => {
            return `<tr>
            <th scope="row">${idx + 1}</th>
            <td class="id">${book.id}</td>
            <td data-trans="${book.name}" class="book-title">${book.name}</td>
            <td class="price">${book.price}</td>
            <td class="book-buttons">
            <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                <button onclick="onReadBook('${book.id}')" type="button" class="btn btn-success" data-trans="read" data-bs-toggle="modal" data-bs-target="#exampleModal">Read</button>
                <button onclick="onUpdateBook('${book.id}')" type="button" class="btn btn-warning" data-trans="update">Update</button>
                <button onclick="onRemoveBook('${book.id}')" type="button" class="btn btn-danger" data-trans="delete">Delete</button>
            </div>
            </td>
            </tr>`
        })
        elSection.innerHTML = ''
        if (books.length !== 0){
            for (let i = 0; i < 5 - books.length; i++) {
                strHtmls.push(`<tr>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>
                <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                <button disabled type="button" class="btn btn-success" data-trans="read">Read</button>
                <button disabled type="button" class="btn btn-warning" data-trans="update">Update</button>
                <button disabled type="button" class="btn btn-danger" data-trans="delete">Delete</button>
                </div>
                </td>
            </tr>`)
            }
        }
        elTbody.innerHTML = strHtmls.join('')
    } else{
        elMode2.checked = true
        strHtmls = books.map(book => {
            return `
        <div class="book p-2">
            
            <div class="card books-for-shop" style="width: 18rem; height: 20rem;">
                <img src="..." class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title" data-trans="${book.name}">${book.name}</h5>
                <h6 class="card-title"><span data-trans="price-str">Price</span>: ${book.price}</h6>
                <h6 class="card-title"><span data-trans="id"></span>: ${book.id}</h6>

                <p class="card-text" data-trans="lorem">.</p>
                    <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button onclick="onReadBook('${book.id}')" type="button" class="btn btn-success" data-trans="read" data-bs-toggle="modal" data-bs-target="#exampleModal">Read</button>
                    <button onclick="onUpdateBook('${book.id}')" type="button" class="btn btn-warning" data-trans="update">Update</button>
                    <button onclick="onRemoveBook('${book.id}')" type="button" class="btn btn-danger" data-trans="delete">Delete</button>
                    </div>
                </div>
            </div>
        </div>`
        })
        
        elSection.innerHTML = strHtmls.join('')
        
    }
}

function onAddBook(){
    const bookName = prompt('books name:')
    const bookPrice = prompt('price:')
    addBook(bookName,bookPrice)
    renderBooks()
}

function onReadBook(bookId){
    const elBooksName = document.querySelector('.modal-title')
    elBooksName.innerText = getBookName(bookId)
    const strHtmls = `<button class="btn btn-primary decrease-rate" onclick="decreaseRate('${bookId}')">-</button>
                    <span class="rate">${getBookRate(bookId)}</span>
                    <button class="btn btn-primary add-rate" onclick="addRate('${bookId}')">+</button>`
    const elRate = document.querySelector('.book-rates')
    elRate.innerHTML = strHtmls
    setLocationState(bookId)
}

function closeModal(){
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none';
}

function onUpdateBook(bookId){
    const newPrice = prompt('new price:')
    updateBook(bookId, newPrice)
    onSetSortBy()
    renderBooks()
}

function onRemoveBook(bookId){
    removeBook(bookId)
    renderBooks()
}

function decreaseRate(bookId){
    decreaseBookRate(bookId)
    const elRate = document.querySelector('.rate')
    elRate.innerText = getBookRate(bookId)
}

function addRate(bookId){
    addBookRate(bookId)
    const elRate = document.querySelector('.rate')
    elRate.innerText = getBookRate(bookId)
}

function onSetRateFilter(value){
    const elRate = document.querySelector('.rate-val')
    elRate.innerText = +value
    setFilterStatus('minRate',+value)
    setLocationState()
    renderBooks()
}

function onSetPriceFilter(value){
    const elPrice = document.querySelector('.price-val')
    elPrice.innerText = +value
    setFilterStatus('maxPrice',+value)
    setLocationState()
    renderBooks()
}

function onFilterByTxt(value){
    setFilterValue(value)
    renderBooks()
    setLocationState()
}

function onSetSortBy(){
    const prop = document.querySelector('.sort-books').value
    const isDesc = document.querySelector('.sort-desc').checked

    const sortBy = {
        [prop]: (isDesc) ? -1 : 1
    }

    setBookSort(sortBy)
    renderBooks()
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        txt: queryStringParams.get('text') || '',
        minRate: +queryStringParams.get('minRate') || 0,
        maxPrice: +queryStringParams.get('maxPrice') || Infinity,
    }

    if (!filterBy.txt && !filterBy.minRate && !filterBy.maxPrice) return
    document.querySelector('.text-filter').value = filterBy.txt
    document.querySelector('.min-rate').value = filterBy.minRate
    document.querySelector('.max-price').value = filterBy.maxPrice
    setFullFilter(filterBy)
    onSetRateFilter(filterBy.minRate)
    onSetPriceFilter(filterBy.maxPrice)
}

function setLocationState(bookId = ''){
    var filterBy = getBooksFilter()
    var mode = getUserMode()

    const queryStringParams = `?text=${filterBy.txt}&minRate=${filterBy.minRate}&maxPrice=${filterBy.maxPrice}
    &readBook=${bookId}&mode=${mode}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderReadBook(){
    const queryStringParams = new URLSearchParams(window.location.search)
    const bookToRead = queryStringParams.get('readBook') || ''
    if (bookToRead) onReadBook(bookToRead)
}

function renderMode(){
    const queryStringParams = new URLSearchParams(window.location.search)
    const mode = queryStringParams.get('mode') || ''
    if (!mode) return

    setUserMode(mode)
}

function onChangePage(change){
    changePage(change)
    renderBooks()
    doTrans()
    
}

function renderPageBar(){
    const pageNum = getPageNum()
    const elPage = document.querySelector('.page-num')
    elPage.innerText = pageNum
    const elFirst = document.querySelector('.first')
    const elSecond = document.querySelector('.second')
    const elThird = document.querySelector('.third')
    const elPrevious = document.querySelector('.previous')
    const elNext = document.querySelector('.next')
    elThird.disabled = false
    elPrevious.disabled = false
    elNext.disabled = false
    elFirst.innerText = pageNum - 1
    elSecond.innerText = pageNum
    elThird.innerText = (isLastPage(pageNum))? '' : pageNum + 1
    if (pageNum === 1){
        elFirst.innerText = 1
        elSecond.innerText = 2
        elThird.innerText = (isLastPage(2)) ? '' : 3
    }
    elFirst.disabled =  (pageNum === 1)? true: false
    elSecond.disabled =  (pageNum === 1)? false: true

    if (isLastPage(pageNum)){
        if (pageNum === 1){
            elSecond.disabled = true
            elThird.disabled = true
            elPrevious.disabled = true
            elNext.disabled = true
        }
    }
}

function onChangeMode(mode){
    setUserMode(mode)
    setLocationState()
    renderBooks()
    doTrans()
}

function onSetLang(lang) {
    const elEn = document.querySelector('#lan1')
    const elHe = document.querySelector('#lan2')
    if (lang === 'en') elEn.checked = true
    else elHe.checked = true
    setLang(lang)
    setDirection(lang)
    renderBooks()
    doTrans()
    renderModeChecked()
}

function setDirection(lang) {
    if (lang === 'he') document.body.classList.add('rtl')
    else document.body.classList.remove('rtl')
}

function renderModeChecked(){
    var langBtn = document.querySelectorAll('.btn-group')
    langBtn[1].style.direction = 'ltr'
    langBtn[0].style.direction = 'ltr'
}