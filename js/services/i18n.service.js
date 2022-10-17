const gTrans = {
    'title': {
        en: 'Welcome to my bookshop!',
        es: 'Mis Cosas Por Hacer',
        he: 'ברוך הבא לחנות הספרים!'
    },
    'create': {
        en: 'Create new book',
        es: 'MVC - Modelo-Vista-Controlador',
        he: 'צור ספר חדש',
    },
    'search': {
        en: 'search',
        es: 'Todos',
        he: 'חיפוש',
    },
    'price': {
        en: 'Maximum price',
        es: 'Activo',
        he: 'מחיר מקסימלי'
    },
    'rate': {
        en: 'Minimum rate',
        es: 'Completo',
        he: 'ציון מינימלי'
    },
    'en': {
        en: 'en',
        es: 'Hacer',
        he: 'אנגלית',
    },
    'he': {
        en: 'he',
        es: 'Activo',
        he: 'עברית',
    },
    'sort-by': {
        en: 'Sort-by',
        es: 'Aggregar',
        he: 'מיין לפי-',
    },
    'sort-price': {
        en: 'Books price',
        es: 'Estas Seguru?',
        he: 'מחיר',
    },
    'search-placeholder': {
        en: 'type to search a book..',
        es: 'Que te tienes que hacer?',
        he: 'הקלד על מנת לחפש ספר...'
    },
    'sort-name': {
        en: 'Books name',
        es: 'Estas Seguru?',
        he: 'שם הספר',
    },
    'descending': {
        en: 'Descending',
        es: 'Estas Seguru?',
        he: 'בסדר יורד-',
    },
    'page': {
        en: 'Page ',
        es: 'Estas Seguru?',
        he: 'עמוד ',
    },
    'previous': {
        en: '⏪previous page',
        es: 'Estas Seguru?',
        he: '⏩עמוד הקודם',
    },
    'next': {
        en: 'next page⏩',
        es: 'Estas Seguru?',
        he: '⏪עמוד הבא',
    },
    'price-str': {
        en: 'Price',
        es: 'Estas Seguru?',
        he: 'מחיר',
    },
    'id': {
        en: 'Id',
        es: 'Estas Seguru?',
        he: 'מספר זיהוי',
    },
    'book-name': {
        en: 'Books name',
        es: 'Estas Seguru?',
        he: 'שם הספר',
    },
    'actions': {
        en: 'Actions',
        es: 'Estas Seguru?',
        he: 'פעולות',
    },
    'read': {
        en: 'Read',
        es: 'Estas Seguru?',
        he: 'קריאה',
    },
    'update': {
        en: 'Update',
        es: 'Estas Seguru?',
        he: 'עדכון',
    },
    'delete': {
        en: 'Delete',
        es: 'Estas Seguru?',
        he: 'מחיקה',
    },
    'sort-name': {
        en: 'Books name',
        es: 'Estas Seguru?',
        he: 'שם הספר',
    },
    'rate-in-modal': {
        en: 'Rate:',
        es: 'Estas Seguru?',
        he: 'ציון:',
    },
    'sort-name': {
        en: 'Books name',
        es: 'Estas Seguru?',
        he: 'שם הספר',
    },
    'Harry Potter':{
        en: 'Harry Potter',
        he: 'הארי פוטר'
    },
    'Percy Jackson':{
        en: 'Percy Jackson',
        he: `פרסי ג'קסון`
    },
    'Hamosad':{
        en: 'Hamosad',
        he: 'המוסד'
    },
    'puki':{
        en: 'puki',
        he: 'פוקי'
    },
    '5 Baloons':{
        en: '5 Baloons',
        he: 'חמישה בלונים'
    },
    'The Maze':{
        en: 'The Maze',
        he: 'המבוך'
    },
    'Hanger games':{
        en: 'Hanger games',
        he: 'משחקי הרעב'
    },
    'The Bible':{
        en: 'The Bible',
        he: `התנ"ך`
    },
    'it':{
        en: 'it',
        he: 'ה-זה'
    },
    'I am So Glad You Were Born':{
        en: 'I am So Glad You Were Born',
        he: 'אני כך כך שמח שנולדת'
    },
    'Busy Betty':{
        en: 'Busy Betty',
        he: 'בטי העסוקה'
    },
    'Stephen King':{
        en: 'Stephen King',
        he: 'המלך סטפן'
    },
    'The Boys from Biloxi':{
        en: 'The Boys from Biloxi',
        he: 'הילד מבילוקסי'
    },
    'Cooking from the Spirit':{
        en: 'Cooking from the Spirit',
        he: 'מבשלים מהשראה'
    },
    'lorem':{
        en: `Some quick example text to build on the card title and make up the bulk of the card's content.`,
        he: 'קצת טקסט דוגמה מהיר לבנייה על כותרת הכרטיס ולהוות את עיקר התוכן של הכרטיס.'
    }
}

let gCurrLang = 'en'

function getTrans(transKey) {
    const transMap = gTrans[transKey]
    if (!transMap) return 'UNKNOWN'

    let trans = transMap[gCurrLang]
    if (!trans) trans = transMap.en
    return trans
}

function doTrans() {
    const els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const trans = getTrans(transKey)
        el.innerText = trans
        if (el.placeholder) el.placeholder = trans
    })
}

function setLang(lang) {
    gCurrLang = lang
}

function formatNum(num) {
    return new Intl.NumberFormat(gCurrLang).format(num)
}

function formatDate(time) {
    const options = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        hour12: true,
    }
    return new Intl.DateTimeFormat(gCurrLang, options).format(time)
}

function getlang(){
    return gCurrLang
}