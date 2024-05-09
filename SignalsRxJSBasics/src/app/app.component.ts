import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  name = 'Angular';

  ngOnInit() {
    console.log('AppComponent initialized');
  }

  ngOnDestroy() {
    console.log('AppComponent destroyed');
  }

}
