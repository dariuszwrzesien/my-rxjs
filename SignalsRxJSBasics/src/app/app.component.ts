import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { from, fromEvent, map, Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  name = 'Angular';
  ofSub!: Subscription;
  fromSub!: Subscription;
  buttonSubscriptions!: Subscription;

  fruits = ''
  fruitObservable!: Observable<string>;

  ngOnInit() {
    console.log('AppComponent initialized');
    this.ofSub = of(2,4,6,8).subscribe((item: number) => console.log('of item:', item));
    this.fromSub = from([2,4,6,8]).subscribe((item: number) => console.log('from item:', item));
    this.fruitObservable = from(['apple', 'orange', 'banana', 'kiwi']).pipe(
      map(fruit => {
        const attributed = ['fresh', 'sweet', 'delicious'];
        const randomAttribute = attributed[Math.floor(Math.random() * attributed.length)];
        return `${[randomAttribute]} ${fruit.toUpperCase()}`
      })
      
    );
  }

  onClick = () => {
    this.fruits = '';
    this.fruitObservable.subscribe((fruit) => {
      this.fruits += fruit + ', ';
    })
  
  }

  ngOnDestroy() {
    console.log('AppComponent destroyed');

    this.ofSub.unsubscribe();
    this.fromSub.unsubscribe();
    this.buttonSubscriptions.unsubscribe();
  }

}
