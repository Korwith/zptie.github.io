// Bookmark Management
const preset_icon = {
    'blackboard.com': 'blackboard.ico',
    'lms.fcps.org': 'schoology.ico',
    'schoology.com': 'schoology.ico',
    'drive.google.com': 'drive.png',
    'meet.google.com': 'meet.png',
    'slides.google.com': 'slides.ico',
    'sites.google.com': 'sites.ico',
    'docs.google.com': 'docs.ico',
    'classroom.google.com': 'classroom.png',
    'maps.google.com': 'maps.ico',
    'google.com/maps': 'maps.ico',
    'earth.google.com': 'earth.ico',
    'remotedesktop.google.com': 'remotedesktop.png',
    'mail.google.com': 'gmail.ico',
}

function newBookmark() {
    let result = prompt('Enter URL');
    if (!result) { return false };
    let sliced = result.substring(0, 8).toLowerCase();
    let formatted;

    if (!sliced.includes('https://') && !sliced.includes('http://')) {
        formatted = 'http://' + result;
    } else {
        formatted = result;
    }
    formatted = formatted.toLowerCase();

    bookmarkCreate(formatted);
    user_bookmarks.push(formatted);
    localStorage.setItem('user_bookmarks', JSON.stringify(user_bookmarks));
}

function bookmarkCreate(formatted) {
    let mark = document.createElement('a');
    mark.classList.add('mark');
    mark.classList.add('darkglass');
    mark.classList.add('noload');
    mark.href = formatted;
    mark.title = formatted;

    mark.onclick = bookmarkClick;
    bookmarks.appendChild(mark);
    
    // check presets
    for (var i in preset_icon) {
        if (formatted.includes(i)) {
            let found_preset = preset_icon[i];
            mark.style.backgroundImage = `url(icon/bookmark/${found_preset})`;
            mark.classList.remove('noload');
            return false;
        }
    }
    
    // else, set web iconit 
    let favicon = `https://www.google.com/s2/favicons?sz=64&domain=${formatted}`;
    let attempt = new Image();
    attempt.onload = function () {
        mark.classList.remove('noload');
        if (attempt.width <= 20 && attempt.height <= 20) {
            mark.classList.add('default');
        } else {
            mark.style.backgroundImage = `url(${favicon})`;
        }
    }
    attempt.onerror = function() {
        mark.classList.add('default')
        mark.classList.remove('noload')
    }

    attempt.src = favicon;
}

function loadBookmarks() {
    let bookmark_data = localStorage.getItem('user_bookmarks');
    if (!bookmark_data) { return false };
    let bookmark_array = JSON.parse(bookmark_data);
    user_bookmarks = bookmark_array;

    for (var i = 0; i < bookmark_array.length; i++) {
        let this_bookmark = bookmark_array[i];
        bookmarkCreate(this_bookmark);
    }
}

let deletion_mode;
function deletionMode() {
    deletion_mode = !deletion_mode;
    bookmarks.classList.toggle('deletion', deletion_mode);
    let all_links = bookmarks.querySelectorAll('a');

    if (deletion_mode) {
        for (var i = 0; i < all_links.length; i++) {
            let this_mark = all_links[i];
            this_mark.setAttribute('nohref', this_mark.href);
            this_mark.removeAttribute('href');
        }
    } else {
        for (var i = 0; i < all_links.length; i++) {
            let this_mark = all_links[i];
            let nohref = this_mark.getAttribute('nohref');
            this_mark.setAttribute('href', nohref);
            this_mark.removeAttribute('nohref');
        }
    }
}

function bookmarkClick(event) {
    if (!event.target) { return false };
    if (deletion_mode) {
        let mark_link = event.target.getAttribute('nohref');
        if (mark_link.charAt(mark_link.length - 1) == '/') {
            mark_link = mark_link.slice(0, -1);
        }
        let linkID = user_bookmarks.indexOf(mark_link);
        
        if (linkID > -1) {
            event.target.remove();
            user_bookmarks.splice(linkID, 1);
            localStorage.setItem('user_bookmarks', JSON.stringify(user_bookmarks));
        }
    }
}

loadBookmarks();
add_bookmark.addEventListener('mouseup', newBookmark);
delete_bookmark.addEventListener('mouseup', deletionMode)