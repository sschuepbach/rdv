import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendSearchService } from '../../services/backend-search.service';

@Component({
  selector: 'app-landing-page',
  template: `
    <div class="container mt-2"
         *ngIf="landingpageData">
      <div class="no-gutters p-2 bg-info text-white rounded">

        <!-- Data: {{landingpageData | json}} -->

        <h3>{{landingpageData.Titel}}</h3>
        <!--
        <h5>
          <div ="let person of landingpageData.Person">
            {{person}} [Autor]
          </div>
        </h5>
      -->
        <ul>
          <li>Verfasser/in: {{landingpageData['Verfasser\/in']}}</li>
          <li>Sprache: {{landingpageData.Sprache}}</li>
          <li>Form: {{landingpageData.Form}}</li>
          <li>Jahr: {{landingpageData.Jahr}}</li>
          <li>Kommentar: {{landingpageData.Kommentar}}</li>
        </ul>
      </div>
    </div>
  `
})
export class LandingPageComponent implements OnInit {

  //ID des Eintrags. String um flexibel zu sein (123 vs. 234_b)
  id: string;
  // TODO: Interface definieren
  landingpageData;

  constructor(private backendSearchService: BackendSearchService, private route: ActivatedRoute) {
  }

  ngOnInit() {

    //ID auslesen aus Route
    this.route.paramMap.subscribe(params => {

      //ID Parameter holen
      this.id = params.get('id');

      //LandingPage Daten per Service holen
      this.backendSearchService.getBackendDetailData(this.id, true).subscribe(
        //LandingPage Daten speichern fuer Anzeige
        res => this.landingpageData = res);
    });
  }
}
