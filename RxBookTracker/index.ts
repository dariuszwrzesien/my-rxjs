import { catchError, concat, filter, fromEvent, interval, mergeMap, Observable, of, tap, throwError } from "rxjs";
import { allBooks, allReaders, type Book, type Reader } from "./data";
import { fromFetch } from 'rxjs/fetch';
import { ajax } from 'rxjs/ajax';
import { response } from "express";

const showReadersButton = document.getElementById('showReaders');
const loadReadersButton = document.getElementById('loadReaders');
const loadReadersAndBooksButton = document.getElementById('loadReadersAndBooks');
const readersDiv = document.getElementById('readers');
const loadedReadersDiv = document.getElementById('loadedReaders');
const loadedReadersAndBooksDiv = document.getElementById('loadedReadersAndBooks');

// const allBooksObservable$ = new Observable(subscriber => {
//     for (let book of allBooks) {
//         subscriber.next(book);
//     }
//     setTimeout(() => {
//         subscriber.complete();
//     }, 2000);

//     return () => console.log('Teardown');
// })

// allBooksObservable$.subscribe((book: Book) => console.log(book.title));


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
const readers$ = fromFetch('http://localhost:3000/api/readers')
const books$ = fromFetch('http://localhost:3000/api/books')
const error500$ = fromFetch('http://localhost:3000/api/errors/500')

const onLoadReaders = () => {
    readers$.subscribe({
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
const onLoadReaderAndBook = () => {
    concat(readers$, books$).subscribe({
        next: response => {
            loadedReadersAndBooksDiv.innerHTML = '';
            response.json().then((data) => {
                data.forEach((readerAndBooks: Reader & Book) => {
                    const newDiv = document.createElement('div');
                    newDiv.innerText = readerAndBooks.name || readerAndBooks.title;
                    loadedReadersAndBooksDiv.appendChild(newDiv);
                })
            })
        },
        complete: () => console.log('done')
    });
}

fromEvent(loadReadersButton, 'click').subscribe(onLoadReaders);
fromEvent(loadReadersAndBooksButton, 'click').subscribe(onLoadReaderAndBook);


//Create and use Observers

books$.subscribe({
    next: response => {
        response.json().then((data: Book[]) => {
            console.log(data);
        })
    },
    error: (err: any) => console.log(err),
    complete: () => console.log('done')
});


//Multiple Observers on one Observable

const currentTime$ = new Observable(subscriber => {
    const timeString = new Date().toLocaleTimeString();
    subscriber.next(timeString);
    subscriber.complete();
});

currentTime$.subscribe((currentTime: string) => console.log(`Observer 1: ${currentTime}`));

setTimeout(() => {
    currentTime$.subscribe((currentTime: string) => console.log(`Observer 2: ${currentTime}`));
}, 2000);

setTimeout(() => {
    currentTime$.subscribe((currentTime: string) => console.log(`Observer 3: ${currentTime}`));
}, 6000);


//Cancel Observer

const timeCancelButton = document.getElementById('timeCancel');
const timerDiv = document.getElementById('timer');

// const timer$ = interval(1000);

const timer$ = new Observable(subscriber => {
    let i = 0;
    const intervalId = setInterval(() => {
        subscriber.next(i++);
    }, 1000);

    return () => {
        clearInterval(intervalId);
        console.log('Timer stopped');
    }
}
)
// const timerSubscription = timer$.subscribe({
//     next: value => timerDiv.innerText += `${new Date().toLocaleTimeString()} (${value}) \n`,
//     error: null,
//     complete: () => console.log('All done')
// })

// fromEvent(timeCancelButton, 'click').subscribe(() => timerSubscription.unsubscribe());


//Add subscription to another subscription

// const anotherTimerSubscription = timer$.subscribe({
//     next: value => console.log(`${new Date().toLocaleTimeString()} (${value}) \n`),
// })

/**
 * dodanie "anotherTimerSubscription" do "timerSubscription"
 * powoduje ze jesli zrobimy unsubscribe na "timerSubscription" 
 * to rowniez "anotherTimerSubscription" zostanie zatrzymany
 */
// timerSubscription.add(anotherTimerSubscription);



//Operators

const booksWithOperators$ = books$.pipe(
    mergeMap(response => response.json()),
    tap((data) => console.log('tap1', data)),
    mergeMap((data: Book[]) => data),
    filter((book: Book) => book.publicationYear < 1950),
    tap((data) => console.log('tap2', data)),
    // catchError(err => of({title: 'Error', author: 'Error', publicationYear: 0}))
    // catchError(err => {
    //     throw new Error('Something went wrong');
    // })
);

booksWithOperators$.subscribe({
    next: (result) => console.log('VALUE:', result),
    error: (err) => console.log('ERROR:', err),
})