import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <div class="container mt-2">
      <div class="no-gutters p-1"> Hier geht es um den Inhalt der Datenbank</div>
    </div>
  `
})
export class AboutComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
