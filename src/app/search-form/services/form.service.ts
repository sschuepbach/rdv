import { Directive, forwardRef, Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, Validators } from '@angular/forms';
import { UpdateQueryService } from './update-query.service';
import { QueriesStoreService } from './queries-store.service';
import { environment } from '../../../environments/environment';
import { UserConfigService } from '../../services/user-config.service';
import { BasketsStoreService } from './baskets-store.service';
import { Basket } from '../models/basket';

function queryNameIsUniqueValidatorFactory(queriesStore: QueriesStoreService) {
  return (control: FormControl) => {
    return queriesStore.savedQueries.filter(q => q.name === control.value).length > 0 ?
      {uniqueQueryName: {valid: false}} : null;
  }
}

// For explanations on the reason why using a directive as validator see
// https://blog.thoughtram.io/angular/2016/03/14/custom-validators-in-angular-2.html#custom-validators-with-dependencies
@Directive({
  selector: '[app-validateUniqueQueryName][formControl]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => QueryNameIsUniqueValidatorDirective), multi: true}
  ]
})
export class QueryNameIsUniqueValidatorDirective {

  validator: Function;

  constructor(queriesStore: QueriesStoreService) {
    this.validator = queryNameIsUniqueValidatorFactory(queriesStore);
  }

  // noinspection JSUnusedGlobalSymbols
  validate(c: FormControl) {
    return this.validator(c);
  }
}

@Injectable({
  providedIn: 'root'
})
export class FormService {

  searchForm;

  //Liste der Merklistennamen erhalten
  get baskets(): FormArray {

    //als FormArray zureuckgeben, damit .push() angeboten wird
    return this.searchForm.get("baskets") as FormArray;
  }


  private mainConfig = {
    ...environment,
    generatedConfig: {},
  };

  constructor(private formBuilder: FormBuilder,
              private updateQueryService: UpdateQueryService,
              private userConfigService: UserConfigService,
              private basketsStoreService: BasketsStoreService,
              private queriesStoreService: QueriesStoreService) {
    userConfigService.getConfig();
    userConfigService.config$.subscribe(res => this.mainConfig = res);
    this.createForms();
  }

  //FormControls fuer Suchanfragen und Speicherung von Suchanfragen anlgen
  private createForms(): any {

    //Such-Form
    this.searchForm = this.formBuilder.group({

      //Anzahl der Zeilen in der Treffertabelle mit Wert aus queryFormat belegen
      rows: this.updateQueryService.queryFormat.queryParams.rows,

      //Merklisten als FormArray
      baskets: this.formBuilder.array([]),

      //Objekt fuer Filter (Filter 1: Auswahl der Einrichtung, Filter 2 mit/ohne Upload,...)
      filters: this.formBuilder.group({}),

      //Eingabefeld fuer Name der zu speichernden Suche
      saveQuery: [
        'Meine Suche ' + (this.queriesStoreService.savedQueries.length + 1),
        [Validators.required, Validators.minLength(3), new QueryNameIsUniqueValidatorDirective(this.queriesStoreService)]
      ]
    });

    //Wenn Anzahl der Zeilen in Treffertabelle geandert wird
    this.searchForm.controls["rows"].valueChanges.subscribe(rows => {

      //Zeilen-Anzahl in Abfrage-Format setzen
      this.updateQueryService.queryFormat.queryParams.rows = rows;

      //Trefferliste wieder von vorne anzeigen
      this.updateQueryService.queryFormat.queryParams.start = 0;

      //Suche starten
      this.updateQueryService.getData();
    });

    //FormControls fuer Suchfelder und deren Auswahlselects festlegen
    for (const key of Object.keys(this.updateQueryService.queryFormat.searchFields)) {

      //Select-Feld fuer Auswahl des Feldes (z.B. Freitext, Titel, Person,...) und direkt mit Wert belegen
      this.searchForm.addControl('selectSearchField_' + key, new FormControl(this.updateQueryService.queryFormat.searchFields[key].field));

      //Bei Aenderung des Selects
      this.searchForm.controls['selectSearchField_' + key].valueChanges.subscribe(value => {

        //Wert in queryFormat speichern
        this.updateQueryService.queryFormat.searchFields[key].field = value;

        //Suche starten
        this.updateQueryService.getData();
      });

      //Suchfeld einfuegen und direkt mit Wert belegen
      this.searchForm.addControl('searchField_' + key, new FormControl(this.updateQueryService.queryFormat.searchFields[key].value));

      //Bei Aenderung des Suchfelds
      this.searchForm.controls['searchField_' + key].valueChanges.subscribe(value => {

        //Wert in Query-Format anpassen
        this.updateQueryService.queryFormat.searchFields[key].value = value;

        //Start der Trefferliste auf Anfang setzen
        this.updateQueryService.queryFormat.queryParams.start = 0;

        //Suche starten
        this.updateQueryService.getData();

        //Pruefen, ob alle Suchfelder leer sind (in diesem Fall wird oben der Hinweis "alle Titel anzeigen" angezeigt)
        this.checkIfSearchFieldsAreEmpty();
      });
    }

    //FormControls fuer Checkenboxen erstellen, die festlegen, ob Titel ohne ein Merkmal (z.B. Titel ohne Jahr) angezeigt werden sollen
    for (const key of Object.keys(this.updateQueryService.queryFormat.rangeFields)) {

      //FormControl fuer Checkbox anlegen und direkt anhaken (falls gesetzt)
      this.searchForm
        .addControl('showMissing_' + key,
          new FormControl(this.updateQueryService.queryFormat.rangeFields[key].showMissingValues));

      //Bei Aenderung der Checkbox
      this.searchForm.controls['showMissing_' + key].valueChanges.subscribe(checked => {

        //Wert setzen
        this.updateQueryService.queryFormat.rangeFields[key].showMissingValues = checked;

        //Suche starten
        this.updateQueryService.getData();
      });
    }

    //FormControls fuer Selects erstellen, die festlegen wie die Werte einer Facette kombiniert werden (ger and eng) vs (ger or eng)
    for (const key of Object.keys(this.updateQueryService.queryFormat.facetFields)) {

      //FormControl nur erstellen, wenn es eine Auswahlmoeglichkeit gibt (OR, AND)
      if (this.mainConfig.facetFields[key].operators.length > 1) {

        //FormControl anlegen und direkt mit Wert belegen
        this.searchForm.addControl('operatorSelect_' + key, new FormControl(this.updateQueryService.queryFormat.facetFields[key].operator));

        //Bei Anederung des Selects
        this.searchForm.controls['operatorSelect_' + key].valueChanges.subscribe(value => {

          //Wert in queryFormat speichern
          this.updateQueryService.queryFormat.facetFields[key].operator = value;

          //Suche starten
          this.updateQueryService.getData();
        })
      }
    }

    //FormControls fuer Filter selbst (=FormArray) und einzelne Checkboxen der Filterauswahlmoeglichkeiten (=FormControl) setzen
    for (const filter of Object.keys(this.mainConfig.filterFields)) {

      //FormArray anlegen pro Filter (z.B. 1. Filter Institutionsauswahl, 2. Filter mit/ohne Datei-Auswahl)
      (this.searchForm.controls['filters'] as FormGroup).addControl(filter, new FormArray([]));

      //Ueber moegliche Filterwerte dieses Filters gehen
      for (const filter_data of this.mainConfig.filterFields[filter].options) {

        //pruefen, ob Filter im QueryFormat als ausgewaehlt hinterlegt ist
        const checked = this.updateQueryService.queryFormat.filterFields[filter].values.indexOf(filter_data.value) > -1;

        //FormControl fuer moeligche Filterwerte als Checkbox (z.B. Instiutionen: [UB Freiburg, KIT,...])
        ((this.searchForm.controls['filters'] as FormGroup).controls[filter] as FormArray).push(this.formBuilder.control(checked));

        //Aenderungen des Checkbox-Inputs verfolgen, dazu ueber Controls gehen
        ((this.searchForm.controls['filters'] as FormGroup).controls[filter] as FormArray).controls.forEach(control => {

          //Bei letztem Control = neue eingefuegtes
          if (((this.searchForm.controls['filters'] as FormGroup).controls[filter] as FormArray).controls.indexOf(control) ===
            ((this.searchForm.controls['filters'] as FormGroup).controls[filter] as FormArray).controls.length - 1) {

            //Aenderungen verfolgen
            control.valueChanges.subscribe(
              () => {

                //Index des Controls in FormArray finden
                const index = ((this.searchForm.controls['filters'] as FormGroup).controls[filter] as FormArray).controls.indexOf(control);

                //Ueber den Index den konkreten Suchewert in Config finden, der an Backend geschickt wird
                const value = this.mainConfig.filterFields[filter].options[index].value;

                //Wenn Checkbox angehakt wurde
                if (control.value) {

                  //Suchwert in QueryFormat speichern
                  this.updateQueryService.queryFormat.filterFields[filter].values.push(value);
                } else {

                  //Stelle in QueryFormat finden, wo der Suchwert steht
                  const removeIndex = this.updateQueryService.queryFormat.filterFields[filter].values.indexOf(value);

                  //Suchwert aus QueryFormat entfernen
                  this.updateQueryService.queryFormat.filterFields[filter].values.splice(removeIndex, 1);
                }

                //Neue Suchabschicken
                this.updateQueryService.getData();
              }
            )
          }
        });
      }
    }
  }

  //prueft, ob in mind. 1 der Text-Suchfelder etwas steht
  checkIfSearchFieldsAreEmpty(): boolean {

    //davon ausgehen, dass alle Suchefelder leer sind
    let allEmpty = true;

    //Ueber Suchfelder gehen gehen
    for (const key of Object.keys(this.updateQueryService.queryFormat.searchFields)) {

      //Wenn Wert gesetzt ist (z.B. bei Freitext-Suche)
      if (this.updateQueryService.queryFormat.searchFields[key].value) {

        //Flag aendern
        allEmpty = false;

        //Loop abbrechen (es reicht, dass 1 Feld gesetzt ist)
        break;
      }
    }

    //Wert in Variable setzen fuer die Oberflaeche
    return allEmpty;
  }


  //Werte des Abfrage-Formats in Input-Felder im Template schreiben
  setFormInputValues() {

    //aktuellen Startwert merken (dieser wird beim Setzen der Felder auf 0 gesetzt) und ganz am Ende setzen
    const start = this.updateQueryService.queryFormat.queryParams.start;

    //Ueber Felder des Abfrage-Formats gehen
    for (const key of Object.keys(this.updateQueryService.queryFormat.searchFields)) {

      //das ausgewaehlte Suchefeld in Template setzen (z.B. Freitext, Titel, Person,...) -> kein Event ausloesen, da sonst Mehrfachsuche
      this.searchForm.get('selectSearchField_' + key)
        .setValue(this.updateQueryService.queryFormat.searchFields[key].field, {emitEvent: false});

      //Wert in Input-Feld im Template setzen -> kein Event ausloesen, da sonst Mehrfachsuche
      this.searchForm.get('searchField_' + key).setValue(this.updateQueryService.queryFormat.searchFields[key].value, {emitEvent: false})
    }

    //Operator bei Verknuepfung der Facettenwerte setzen
    for (const key of Object.keys(this.updateQueryService.queryFormat.facetFields)) {

      //Es existiert nur dann ein FormControl, wenn es eine Auswahlmoeglichkeit gibt (OR, AND)
      if (this.mainConfig.facetFields[key].operators.length > 1) {

        //Wert aus QueryFormat holen und in Template setzen -> kein Event ausloesen, da sonst Mehrfachsuche
        this.searchForm.get('operatorSelect_' + key)
          .setValue(this.updateQueryService.queryFormat.facetFields[key].operator, {emitEvent: false});
      }
    }

    //Checkboxen anhaken, bei welchen Ranges auch Titel ohne Merkmal gesucht werden sollen (z.B. Titel ohne Jahr)
    for (const key of Object.keys(this.updateQueryService.queryFormat.rangeFields)) {

      //Wert aus QueryFormat holen und in Template setzen -> kein Event ausloesen, da sonst Mehrfachsuche
      this.searchForm.get("showMissing_" + key)
        .setValue(this.updateQueryService.queryFormat.rangeFields[key].showMissingValues, {emitEvent: false});
    }

    //Checkboxen bei Filtern anhaken, dazu ueber Filter gehen (Filter 1: Institutionsfilter, Filter 2: mit/ohne Datei-Filter,...)
    for (const key of Object.keys(this.mainConfig.filterFields)) {

      //Ueber moegliche Filterwerte eines Filters gehen (Institutionen: [UB Freiburg, KIT,...])
      this.mainConfig.filterFields[key].options.forEach((filter_data, index) => {

        //Pruefen ob Wert in QueryFormat angehakt ist
        const checked = this.updateQueryService.queryFormat.filterFields[key].values.indexOf(filter_data.value) > -1;

        //Checkbox anhakden (falls gesetzt) -> kein Event ausloesen, da sonst Mehrfach-Anfrage an Backend
        ((this.searchForm.controls['filters'] as FormGroup).controls[key] as FormArray).at(index).setValue(checked, {emitEvent: false});
      });
    }

    //Anzahl der Treffer in Select im Template auswaehlen -> kein Event ausloesen, da sonst Mehrfachsuche
    this.searchForm.get("rows").setValue(this.updateQueryService.queryFormat.queryParams.rows, {emitEvent: false});

    //gemerkten Startwert wieder setzen (war zwischenzeitlich auf 0 gesetzt worden)
    this.updateQueryService.queryFormat.queryParams.start = start;
  }


  addBasketToFormArray(basket: Basket) {
    const basketArray = this.searchForm.get("baskets") as FormArray;
    //Neue Merkliste in FormArray eintragen (fuer Names-Input)
    basketArray.push(this.formBuilder.control((basket.name)));

    //Aenderungen des Namens-Inputs verfolgen, dazu ueber Controls gehen
    // TODO: Simplify
    basketArray.controls.forEach(control => {

      //Bei letztem Control = neue eingefuegtes
      if (basketArray.controls.indexOf(control) === basketArray.controls.length - 1) {

        //Aenderungen verfolgen
        control.valueChanges.subscribe(
          () => {

            //Index im Formarray finden, damit passende Stelle in savedBasket-Array gefunden wird
            const index = basketArray.controls.indexOf(control);

            //an passender Stelle in savedBaskets den Wert angleichen
            this.basketsStoreService.savedBasketItems[index].name = control.value;
          }
        )
      }
    });
  }
}
