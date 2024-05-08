import { fromEvent, Observable } from "rxjs";
import { allBooks, allReaders, type Book, type Reader } from "./data";
import { fromFetch } from 'rxjs/fetch';
import { ajax } from 'rxjs/ajax';

const showReadersButton = document.getElementById('showReaders');
const loadReadersButton = document.getElementById('loadReaders');
const readersDiv = document.getElementById('readers');
const loadedReadersDiv = document.getElementById('loadedReaders');

const allBooksObservable$ = new Observable(subscriber => {
    for (let book of allBooks) {
        subscriber.next(book);
    }
    setTimeout(() => {
        subscriber.complete();
    }, 2000);

    return () => console.log('Teardown');
})

allBooksObservable$.subscribe((book: Book) => console.log(book.title));


//click event
const onShowReaders = () => {
    readersDiv.innerHTML = '';
    allReaders.forEach(reader => {
        const newDiv = document.createElement('div');
        newDiv.innerText = reader.name;
        readersDiv.appendChild(newDiv);
    })
}

fromEvent(showReadersButton, 'click').subscribe(onShowReaders);

//data from API call

const onLoadReaders = () => {
    const data$ = fromFetch('http://localhost:3000/api/readers')
    data$.subscribe({
        next: response => {
            loadedReadersDiv.innerHTML = '';
            response.json().then((data) => {
                data.forEach((reader: Reader) => {
                    const newDiv = document.createElement('div');
                    newDiv.innerText = reader.name;
                    loadedReadersDiv.appendChild(newDiv);
                })
            })
        },
        complete: () => console.log('done')
    });
}

fromEvent(loadReadersButton, 'click').subscribe(onLoadReaders);

