===============
RDV Version 1.0
===============

The idea of the Research Data Viewer is to make research data visible, searchable and usable,
using a simple browser. The matching concept can be called "exploratory search",
proposed by Dr. Steffen Vogt in the project tambora.

The Research Data Viewer consists of three parts:

(1) User interface
(2) Solr proxy
(3) Solr search engine

To create or update the solr index for the different projects look in the folder create.
Each project use a special mapping script. It is also possible to automate the update
procedure (e.g. musse_pub).

The user interface uses jquery and some plugins like treesearch. 

===================
Directory Structure
===================

└── ressources
        └── rdv_version_1.0
        ├── backup
        ├── build
        ├── config
        ├── create
        ├── css
        ├── files
        ├── index.php
        ├── js
        ├── php
        ├── README.txt
        ├── robots.txt
        ├── solr
        └── test

backup: Ant build backups every deployment. Thiis will be used incase you
        like to revert the deployment.
config: There you find the different bootstrap files for each project.
create: The scripts that builds the solr index based on a source comming from the reseacher.
solr  : Solr server, cores and indexes. Run with java -jar solr
files : pictures and sound files for some projects.

====================
Install instructions
====================
Run one of the examples is easy. You will need a web server, php and some symlinks. Here you find
an typical installation for debian systems.

sudo apt-get install apache2 apache2-doc
sudo apt-get install php 


=======
History
=======
The RDV version 1.0 was developped by Martin Helfer (<martin.helfer@ub.uni-freiburg.de>)
originally called ISS (Intelligent Solr Search) at the University Library Freiburg. The intensation
was to publish different bibliographies and to make it searchable.
You find most attached examples online (see README.txt in create/<project>).




