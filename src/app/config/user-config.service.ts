import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MainConfig } from 'app/config/main-config';

@Injectable()
export class UserConfigService {

  //MainConfig erstellen (z.B. Felder der Treffer liste)
  config: MainConfig = new MainConfig();

  //Http-Service laden
  constructor(private http: Http) { }

  //Config an Anwendung ausliefern
  getConfig(): Promise<MainConfig> {

    //Filterwerte (=ausgewaehlte Repos in bwsts) von Schnittstelle holen, toPromise, damit async / await in Komponente funktioniert
    return this.http.get('http://localhost/bwsts/web/export.php').toPromise().then(response => {

      //Repo-Daten in Filterdatenbereich schreiben (war bisher leer)
      this.config.filterFields.institution.data = response.json();

      //komplette Config an Anwendung zurueckliefern
      return this.config;
    })
  }
}