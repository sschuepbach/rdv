import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { BackendSearchService } from 'app/services/solr-search.service';
import { BackendSearchService } from 'app/services/elastic-search.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html'
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
