# rdv
Research Data Viewer

## Konfiguration

Der Research Data Viewer kann mit verschiedenen Konfigurationen gestartet werden:

* `elastic` (Standard) und `production` (produktiv)
* `freidok` und `freidok-prod` (produktiv)
* `bwsts` und `bwsts-prod` (produktiv)
* `elastic-mh` und `elastic-mh-prod` (produktiv)

Eine Konfiguration abweichend vom Standard kann mit `ng serve -c konfiguration` bzw.
`ng build -c konfiguration` ausgewählt werden.

Anpassungen für index / type von Elasticsearch müssen auch in `angularx_elasticsearch_proxy_unibas.php` nachvollzogen werden.
