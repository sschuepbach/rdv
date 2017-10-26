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
  async getConfig(): Promise<MainConfig> {

    //vorhandene Filter dynamisch laden
    for (let key of Object.keys(this.config.filterFields)) {

      //Wenn bei Filter eine URL hinterlegt ist, muessen Daten dynamisch geholt werden
      if (this.config.filterFields[key].url) {

        //Config-Werte per URL holen
        this.config = await this.http.get(this.config.filterFields[key].url).toPromise().then(response => {

          //Filter-Auswaehlmoeglichkeiten in Filterdatenbereich der Config schreiben (war bisher leer)
          this.config.filterFields[key].data = response.json();

          //Config zurueckgeben
          return this.config;
        });
      }
    }

    //ggf. angepasste Config an Anwendung geben
    return this.config;
  }
}
