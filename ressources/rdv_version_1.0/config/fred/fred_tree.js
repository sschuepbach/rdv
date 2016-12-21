// search tree data
var tree_data_array = [];
tree_data_array['LOC_CLEAN_all_facet'] = [
            {
                "id": "Heb",
                "text": "Hebrides",
                "parent": "#",
                "icon": false
            },
            {
                "id": "MAN",
                "text": "Isle of Man",
                "parent": "#",
                "icon": false
            },
            {
                "id": "Mid",
                "text": "Midlands",
                "parent": "#",
                "icon": false
            },
            {
                "id": "N",
                "text": "North",
                "parent": "#",
                "icon": false
            },
            {
                "id": "SCH",
                "text": "Scottish Highlands",
                "parent": "#",
                "icon": false
            },
            {
                "id": "SCL",
                "text": "Scottish Lowlands",
                "parent": "#",
                "icon": false
            },
            {
                "id": "SE",
                "text": "South East",
                "parent": "#",
                "icon": false
            },
            {
                "id": "SW",
                "text": "South West",
                "parent": "#",
                "icon": false
            },
            {
                "id": "Wal",
                "text": "Wales",
                "parent": "#",
                "icon": false
            },
            {
                "id": "Heb-Benbecula",
                "text": "Benbecula",
                "parent": "Heb",
                "icon": false
            },
            {
                "id": "Heb-Berneray",
                "text": "Berneray",
                "parent": "Heb",
                "icon": false
            },
            {
                "id": "Heb-Carinish",
                "text": "Carinish",
                "parent": "Heb",
                "icon": false
            },
            {
                "id": "Heb-North Uist",
                "text": "North Uist",
                "parent": "Heb",
                "icon": false
            },
            {
                "id": "Heb-Skye",
                "text": "Skye",
                "parent": "Heb",
                "icon": false
            },
            {
                "id": "Heb-South Uist",
                "text": "South Uist",
                "parent": "Heb",
                "icon": false
            },
            {
                "id": "Heb-unknown",
                "text": "unknown",
                "parent": "Heb",
                "icon": false
            },
            {
                "id": "MAN-Isle of Man",
                "text": "Isle of Man",
                "parent": "MAN",
                "icon": false
            },
            {
                "id": "Mid-Leicestershire",
                "text": "Leicestershire",
                "parent": "Mid",
                "icon": false
            },
            {
                "id": "Mid-Nottinghamshire",
                "text": "Nottinghamshire",
                "parent": "Mid",
                "icon": false
            },
            {
                "id": "Mid-Shropshire",
                "text": "Shropshire",
                "parent": "Mid",
                "icon": false
            },
            {
                "id": "Mid-Warwickshire",
                "text": "Warwickshire",
                "parent": "Mid",
                "icon": false
            },
            {
                "id": "N-Durham",
                "text": "Durham",
                "parent": "N",
                "icon": false
            },
            {
                "id": "N-Lancashire",
                "text": "Lancashire",
                "parent": "N",
                "icon": false
            },
            {
                "id": "N-Northumberland",
                "text": "Northumberland",
                "parent": "N",
                "icon": false
            },
            {
                "id": "N-Westmorland",
                "text": "Westmorland",
                "parent": "N",
                "icon": false
            },
            {
                "id": "N-Yorkshire",
                "text": "Yorkshire",
                "parent": "N",
                "icon": false
            },
            {
                "id": "SCH-Inverness-shire",
                "text": "shire",
                "parent": "SCH",
                "icon": false
            },
            {
                "id": "SCH-Ross and Cromarty",
                "text": "Ross and Cromarty",
                "parent": "SCH",
                "icon": false
            },
            {
                "id": "SCH-Sutherland",
                "text": "Sutherland",
                "parent": "SCH",
                "icon": false
            },
            {
                "id": "SCL-Angus",
                "text": "Angus",
                "parent": "SCL",
                "icon": false
            },
            {
                "id": "SCL-Banffshire",
                "text": "Banffshire",
                "parent": "SCL",
                "icon": false
            },
            {
                "id": "SCL-Dumfriesshire",
                "text": "Dumfriesshire",
                "parent": "SCL",
                "icon": false
            },
            {
                "id": "SCL-East Lothian",
                "text": "East Lothian",
                "parent": "SCL",
                "icon": false
            },
            {
                "id": "SCL-Fife",
                "text": "Fife",
                "parent": "SCL",
                "icon": false
            },
            {
                "id": "SCL-Kincardineshire",
                "text": "Kincardineshire",
                "parent": "SCL",
                "icon": false
            },
            {
                "id": "SCL-Kinross-shire",
                "text": "shire",
                "parent": "SCL",
                "icon": false
            },
            {
                "id": "SCL-Lanarkshire",
                "text": "Lanarkshire",
                "parent": "SCL",
                "icon": false
            },
            {
                "id": "SCL-Midlothian",
                "text": "Midlothian",
                "parent": "SCL",
                "icon": false
            },
            {
                "id": "SCL-Peebleshire",
                "text": "Peebleshire",
                "parent": "SCL",
                "icon": false
            },
            {
                "id": "SCL-Perthshire",
                "text": "Perthshire",
                "parent": "SCL",
                "icon": false
            },
            {
                "id": "SCL-Selkirkshire",
                "text": "Selkirkshire",
                "parent": "SCL",
                "icon": false
            },
            {
                "id": "SCL-West Lothian",
                "text": "West Lothian",
                "parent": "SCL",
                "icon": false
            },
            {
                "id": "SE-Kent",
                "text": "Kent",
                "parent": "SE",
                "icon": false
            },
            {
                "id": "SE-London",
                "text": "London",
                "parent": "SE",
                "icon": false
            },
            {
                "id": "SE-Middlesex",
                "text": "Middlesex",
                "parent": "SE",
                "icon": false
            },
            {
                "id": "SE-Suffolk",
                "text": "Suffolk",
                "parent": "SE",
                "icon": false
            },
            {
                "id": "SW-Cornwall",
                "text": "Cornwall",
                "parent": "SW",
                "icon": false
            },
            {
                "id": "SW-Devon",
                "text": "Devon",
                "parent": "SW",
                "icon": false
            },
            {
                "id": "SW-Oxfordshire",
                "text": "Oxfordshire",
                "parent": "SW",
                "icon": false
            },
            {
                "id": "SW-Somerset",
                "text": "Somerset",
                "parent": "SW",
                "icon": false
            },
            {
                "id": "SW-Wiltshire",
                "text": "Wiltshire",
                "parent": "SW",
                "icon": false
            },
            {
                "id": "Wal-Denbighshire",
                "text": "Denbighshire",
                "parent": "Wal",
                "icon": false
            },
            {
                "id": "Wal-Glamorgan",
                "text": "Glamorgan",
                "parent": "Wal",
                "icon": false
            },
            {
                "id": "Wal-Glamorganshire",
                "text": "Glamorganshire",
                "parent": "Wal",
                "icon": false
            },
            {
                "id": "Heb-Benbecula-Hacklett",
                "text": "Hacklett",
                "parent": "Heb-Benbecula",
                "icon": false
            },
            {
                "id": "Heb-Berneray-Innes",
                "text": "Innes",
                "parent": "Heb-Berneray",
                "icon": false
            },
            {
                "id": "Heb-Carinish-Claddach",
                "text": "Claddach",
                "parent": "Heb-Carinish",
                "icon": false
            },
            {
                "id": "Heb-North Uist-Clachan",
                "text": "Clachan",
                "parent": "Heb-North Uist",
                "icon": false
            },
            {
                "id": "Heb-North Uist-Locheport",
                "text": "Locheport",
                "parent": "Heb-North Uist",
                "icon": false
            },
            {
                "id": "Heb-North Uist-unknown",
                "text": "unknown",
                "parent": "Heb-North Uist",
                "icon": false
            },
            {
                "id": "Heb-Skye-Balmaquien",
                "text": "Balmaquien",
                "parent": "Heb-Skye",
                "icon": false
            },
            {
                "id": "Heb-Skye-Bornaskitaig",
                "text": "Bornaskitaig",
                "parent": "Heb-Skye",
                "icon": false
            },
            {
                "id": "Heb-Skye-North Duntulm",
                "text": "North Duntulm",
                "parent": "Heb-Skye",
                "icon": false
            },
            {
                "id": "Heb-Skye-Portree",
                "text": "Portree",
                "parent": "Heb-Skye",
                "icon": false
            },
            {
                "id": "Heb-Skye-Portree Kingsburgh",
                "text": "Portree Kingsburgh",
                "parent": "Heb-Skye",
                "icon": false
            },
            {
                "id": "Heb-Skye-Portree Staffin",
                "text": "Portree Staffin",
                "parent": "Heb-Skye",
                "icon": false
            },
            {
                "id": "Heb-Skye-Staffin",
                "text": "Staffin",
                "parent": "Heb-Skye",
                "icon": false
            },
            {
                "id": "Heb-Skye-Stenscholl",
                "text": "Stenscholl",
                "parent": "Heb-Skye",
                "icon": false
            },
            {
                "id": "Heb-Skye-Struan",
                "text": "Struan",
                "parent": "Heb-Skye",
                "icon": false
            },
            {
                "id": "Heb-Skye-unknown",
                "text": "unknown",
                "parent": "Heb-Skye",
                "icon": false
            },
            {
                "id": "Heb-South Uist-Howbeg",
                "text": "Howbeg",
                "parent": "Heb-South Uist",
                "icon": false
            },
            {
                "id": "Heb-South Uist-Iochdar",
                "text": "Iochdar",
                "parent": "Heb-South Uist",
                "icon": false
            },
            {
                "id": "Heb-South Uist-Loch Carnan",
                "text": "Loch Carnan",
                "parent": "Heb-South Uist",
                "icon": false
            },
            {
                "id": "Heb-South Uist-Staffin Clachan",
                "text": "Staffin Clachan",
                "parent": "Heb-South Uist",
                "icon": false
            },
            {
                "id": "Heb-South Uist-unknown",
                "text": "unknown",
                "parent": "Heb-South Uist",
                "icon": false
            },
            {
                "id": "Heb-unknown-Maliger",
                "text": "Maliger",
                "parent": "Heb-unknown",
                "icon": false
            },
            {
                "id": "Heb-unknown-unknown",
                "text": "unknown",
                "parent": "Heb-unknown",
                "icon": false
            },
            {
                "id": "MAN-Isle of Man-Laxey",
                "text": "Laxey",
                "parent": "MAN-Isle of Man",
                "icon": false
            },
            {
                "id": "MAN-Isle of Man-Ramsey",
                "text": "Ramsey",
                "parent": "MAN-Isle of Man",
                "icon": false
            },
            {
                "id": "Mid-Leicestershire-Caldwell",
                "text": "Caldwell",
                "parent": "Mid-Leicestershire",
                "icon": false
            },
            {
                "id": "Mid-Leicestershire-unknown",
                "text": "unknown",
                "parent": "Mid-Leicestershire",
                "icon": false
            },
            {
                "id": "Mid-Nottinghamshire-Lambley",
                "text": "Lambley",
                "parent": "Mid-Nottinghamshire",
                "icon": false
            },
            {
                "id": "Mid-Nottinghamshire-Nottingham",
                "text": "Nottingham",
                "parent": "Mid-Nottinghamshire",
                "icon": false
            },
            {
                "id": "Mid-Nottinghamshire-Southwell",
                "text": "Southwell",
                "parent": "Mid-Nottinghamshire",
                "icon": false
            },
            {
                "id": "Mid-Nottinghamshire-unknown",
                "text": "unknown",
                "parent": "Mid-Nottinghamshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-Broseley",
                "text": "Broseley",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-Coalbrookdale",
                "text": "Coalbrookdale",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-Coalport",
                "text": "Coalport",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-Craigside",
                "text": "Craigside",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-Dawley",
                "text": "Dawley",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-Farley",
                "text": "Farley",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-Ironbridge",
                "text": "Ironbridge",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-Ketley",
                "text": "Ketley",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-Lawley",
                "text": "Lawley",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-Madeley",
                "text": "Madeley",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-Oakengates",
                "text": "Oakengates",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-Shifnal",
                "text": "Shifnal",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-Telford",
                "text": "Telford",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-Wellington",
                "text": "Wellington",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Shropshire-unknown",
                "text": "unknown",
                "parent": "Mid-Shropshire",
                "icon": false
            },
            {
                "id": "Mid-Warwickshire-Walsall",
                "text": "Walsall",
                "parent": "Mid-Warwickshire",
                "icon": false
            },
            {
                "id": "N-Durham-Birtley",
                "text": "Birtley",
                "parent": "N-Durham",
                "icon": false
            },
            {
                "id": "N-Durham-Hartlepool",
                "text": "Hartlepool",
                "parent": "N-Durham",
                "icon": false
            },
            {
                "id": "N-Lancashire-Barrow",
                "text": "Barrow",
                "parent": "N-Lancashire",
                "icon": false
            },
            {
                "id": "N-Lancashire-Crompton",
                "text": "Crompton",
                "parent": "N-Lancashire",
                "icon": false
            },
            {
                "id": "N-Lancashire-Huyton",
                "text": "Huyton",
                "parent": "N-Lancashire",
                "icon": false
            },
            {
                "id": "N-Lancashire-Prescott",
                "text": "Prescott",
                "parent": "N-Lancashire",
                "icon": false
            },
            {
                "id": "N-Lancashire-Preston",
                "text": "Preston",
                "parent": "N-Lancashire",
                "icon": false
            },
            {
                "id": "N-Lancashire-Wigan",
                "text": "Wigan",
                "parent": "N-Lancashire",
                "icon": false
            },
            {
                "id": "N-Northumberland-Cammerse",
                "text": "Cammerse",
                "parent": "N-Northumberland",
                "icon": false
            },
            {
                "id": "N-Northumberland-Choppington",
                "text": "Choppington",
                "parent": "N-Northumberland",
                "icon": false
            },
            {
                "id": "N-Northumberland-Fenwick Steads",
                "text": "Fenwick Steads",
                "parent": "N-Northumberland",
                "icon": false
            },
            {
                "id": "N-Northumberland-Swarland",
                "text": "Swarland",
                "parent": "N-Northumberland",
                "icon": false
            },
            {
                "id": "N-Westmorland-Ambleside",
                "text": "Ambleside",
                "parent": "N-Westmorland",
                "icon": false
            },
            {
                "id": "N-Yorkshire-Guisborough",
                "text": "Guisborough",
                "parent": "N-Yorkshire",
                "icon": false
            },
            {
                "id": "N-Yorkshire-Hebden Bridge",
                "text": "Hebden Bridge",
                "parent": "N-Yorkshire",
                "icon": false
            },
            {
                "id": "N-Yorkshire-Hinderwell",
                "text": "Hinderwell",
                "parent": "N-Yorkshire",
                "icon": false
            },
            {
                "id": "N-Yorkshire-Loftus",
                "text": "Loftus",
                "parent": "N-Yorkshire",
                "icon": false
            },
            {
                "id": "N-Yorkshire-Middlesbrough",
                "text": "Middlesbrough",
                "parent": "N-Yorkshire",
                "icon": false
            },
            {
                "id": "N-Yorkshire-Redcar",
                "text": "Redcar",
                "parent": "N-Yorkshire",
                "icon": false
            },
            {
                "id": "SCH-Inverness-shire-Inverness",
                "text": "Inverness",
                "parent": "SCH-Inverness-shire",
                "icon": false
            },
            {
                "id": "SCH-Ross and Cromarty-Aultbea",
                "text": "Aultbea",
                "parent": "SCH-Ross and Cromarty",
                "icon": false
            },
            {
                "id": "SCH-Ross and Cromarty-Hill of Fearn",
                "text": "Hill of Fearn",
                "parent": "SCH-Ross and Cromarty",
                "icon": false
            },
            {
                "id": "SCH-Sutherland-Assynt",
                "text": "Assynt",
                "parent": "SCH-Sutherland",
                "icon": false
            },
            {
                "id": "SCH-Sutherland-Boulstoer",
                "text": "Boulstoer",
                "parent": "SCH-Sutherland",
                "icon": false
            },
            {
                "id": "SCH-Sutherland-Durness",
                "text": "Durness",
                "parent": "SCH-Sutherland",
                "icon": false
            },
            {
                "id": "SCH-Sutherland-Terryside",
                "text": "Terryside",
                "parent": "SCH-Sutherland",
                "icon": false
            },
            {
                "id": "SCL-Angus-Arbroath",
                "text": "Arbroath",
                "parent": "SCL-Angus",
                "icon": false
            },
            {
                "id": "SCL-Angus-Forfar",
                "text": "Forfar",
                "parent": "SCL-Angus",
                "icon": false
            },
            {
                "id": "SCL-Angus-Kirkton",
                "text": "Kirkton",
                "parent": "SCL-Angus",
                "icon": false
            },
            {
                "id": "SCL-Banffshire-Keith",
                "text": "Keith",
                "parent": "SCL-Banffshire",
                "icon": false
            },
            {
                "id": "SCL-Dumfriesshire-Mickle Kirkland",
                "text": "Mickle Kirkland",
                "parent": "SCL-Dumfriesshire",
                "icon": false
            },
            {
                "id": "SCL-East Lothian-Tranent",
                "text": "Tranent",
                "parent": "SCL-East Lothian",
                "icon": false
            },
            {
                "id": "SCL-Fife-Anstruther",
                "text": "Anstruther",
                "parent": "SCL-Fife",
                "icon": false
            },
            {
                "id": "SCL-Kincardineshire-Gourdon",
                "text": "Gourdon",
                "parent": "SCL-Kincardineshire",
                "icon": false
            },
            {
                "id": "SCL-Kinross-shire-Crook-o-Devon",
                "text": "Devon",
                "parent": "SCL-Kinross-shire",
                "icon": false
            },
            {
                "id": "SCL-Lanarkshire-Symington",
                "text": "Symington",
                "parent": "SCL-Lanarkshire",
                "icon": false
            },
            {
                "id": "SCL-Midlothian-Edinburgh",
                "text": "Edinburgh",
                "parent": "SCL-Midlothian",
                "icon": false
            },
            {
                "id": "SCL-Peebleshire-Nether Urd",
                "text": "Nether Urd",
                "parent": "SCL-Peebleshire",
                "icon": false
            },
            {
                "id": "SCL-Peebleshire-West Linton",
                "text": "West Linton",
                "parent": "SCL-Peebleshire",
                "icon": false
            },
            {
                "id": "SCL-Perthshire-Abernethy",
                "text": "Abernethy",
                "parent": "SCL-Perthshire",
                "icon": false
            },
            {
                "id": "SCL-Perthshire-Crieff",
                "text": "Crieff",
                "parent": "SCL-Perthshire",
                "icon": false
            },
            {
                "id": "SCL-Perthshire-Perth",
                "text": "Perth",
                "parent": "SCL-Perthshire",
                "icon": false
            },
            {
                "id": "SCL-Selkirkshire-Ettrick",
                "text": "Ettrick",
                "parent": "SCL-Selkirkshire",
                "icon": false
            },
            {
                "id": "SCL-Selkirkshire-Selkirk",
                "text": "Selkirk",
                "parent": "SCL-Selkirkshire",
                "icon": false
            },
            {
                "id": "SCL-Selkirkshire-Yarrow",
                "text": "Yarrow",
                "parent": "SCL-Selkirkshire",
                "icon": false
            },
            {
                "id": "SCL-West Lothian-Falkirk",
                "text": "Falkirk",
                "parent": "SCL-West Lothian",
                "icon": false
            },
            {
                "id": "SE-Kent-Faversham",
                "text": "Faversham",
                "parent": "SE-Kent",
                "icon": false
            },
            {
                "id": "SE-Kent-Lydd",
                "text": "Lydd",
                "parent": "SE-Kent",
                "icon": false
            },
            {
                "id": "SE-Kent-Sheerness",
                "text": "Sheerness",
                "parent": "SE-Kent",
                "icon": false
            },
            {
                "id": "SE-Kent-Sittingbourne",
                "text": "Sittingbourne",
                "parent": "SE-Kent",
                "icon": false
            },
            {
                "id": "SE-Kent-Tenterden",
                "text": "Tenterden",
                "parent": "SE-Kent",
                "icon": false
            },
            {
                "id": "SE-Kent-Whitstable",
                "text": "Whitstable",
                "parent": "SE-Kent",
                "icon": false
            },
            {
                "id": "SE-London-London North",
                "text": "London North",
                "parent": "SE-London",
                "icon": false
            },
            {
                "id": "SE-London-Poplar-London Port",
                "text": "London Port",
                "parent": "SE-London",
                "icon": false
            },
            {
                "id": "SE-Middlesex-Pinner",
                "text": "Pinner",
                "parent": "SE-Middlesex",
                "icon": false
            },
            {
                "id": "SE-Suffolk-Lowestoft",
                "text": "Lowestoft",
                "parent": "SE-Suffolk",
                "icon": false
            },
            {
                "id": "SE-Suffolk-Yarmouth",
                "text": "Yarmouth",
                "parent": "SE-Suffolk",
                "icon": false
            },
            {
                "id": "SW-Cornwall-Carnelloe",
                "text": "Carnelloe",
                "parent": "SW-Cornwall",
                "icon": false
            },
            {
                "id": "SW-Cornwall-Churchtown",
                "text": "Churchtown",
                "parent": "SW-Cornwall",
                "icon": false
            },
            {
                "id": "SW-Cornwall-Gulval",
                "text": "Gulval",
                "parent": "SW-Cornwall",
                "icon": false
            },
            {
                "id": "SW-Cornwall-Gurnards Head",
                "text": "Gurnards Head",
                "parent": "SW-Cornwall",
                "icon": false
            },
            {
                "id": "SW-Cornwall-Heamoor",
                "text": "Heamoor",
                "parent": "SW-Cornwall",
                "icon": false
            },
            {
                "id": "SW-Cornwall-Ludgvan",
                "text": "Ludgvan",
                "parent": "SW-Cornwall",
                "icon": false
            },
            {
                "id": "SW-Cornwall-Nancledra",
                "text": "Nancledra",
                "parent": "SW-Cornwall",
                "icon": false
            },
            {
                "id": "SW-Cornwall-Pendeen",
                "text": "Pendeen",
                "parent": "SW-Cornwall",
                "icon": false
            },
            {
                "id": "SW-Cornwall-Sennen",
                "text": "Sennen",
                "parent": "SW-Cornwall",
                "icon": false
            },
            {
                "id": "SW-Cornwall-St. Ives",
                "text": "St. Ives",
                "parent": "SW-Cornwall",
                "icon": false
            },
            {
                "id": "SW-Cornwall-St. Just",
                "text": "St. Just",
                "parent": "SW-Cornwall",
                "icon": false
            },
            {
                "id": "SW-Devon-Blackawton",
                "text": "Blackawton",
                "parent": "SW-Devon",
                "icon": false
            },
            {
                "id": "SW-Devon-Brixham",
                "text": "Brixham",
                "parent": "SW-Devon",
                "icon": false
            },
            {
                "id": "SW-Devon-Buckfast",
                "text": "Buckfast",
                "parent": "SW-Devon",
                "icon": false
            },
            {
                "id": "SW-Devon-Dartmouth",
                "text": "Dartmouth",
                "parent": "SW-Devon",
                "icon": false
            },
            {
                "id": "SW-Devon-Galmpton",
                "text": "Galmpton",
                "parent": "SW-Devon",
                "icon": false
            },
            {
                "id": "SW-Devon-Totnes",
                "text": "Totnes",
                "parent": "SW-Devon",
                "icon": false
            },
            {
                "id": "SW-Oxfordshire-Leafield",
                "text": "Leafield",
                "parent": "SW-Oxfordshire",
                "icon": false
            },
            {
                "id": "SW-Somerset-Ashwick",
                "text": "Ashwick",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Babcary",
                "text": "Babcary",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Baltonsborough",
                "text": "Baltonsborough",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Barton St. David",
                "text": "Barton St. David",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Bridgwater",
                "text": "Bridgwater",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Buckleigh",
                "text": "Buckleigh",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Butleigh",
                "text": "Butleigh",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Churchingfold Beaminster",
                "text": "Churchingfold Beaminster",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Coley",
                "text": "Coley",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Compton Dundon",
                "text": "Compton Dundon",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Evercreech",
                "text": "Evercreech",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Fivehead",
                "text": "Fivehead",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Galhampton",
                "text": "Galhampton",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Glastonbury",
                "text": "Glastonbury",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Hatch Beauchamp",
                "text": "Hatch Beauchamp",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Henley",
                "text": "Henley",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Horton",
                "text": "Horton",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Kingston Seymour",
                "text": "Kingston Seymour",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Moorwood Oakhill",
                "text": "Moorwood Oakhill",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-North Bridgwater",
                "text": "North Bridgwater",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-North Burrowbridge",
                "text": "North Burrowbridge",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-North Curry",
                "text": "North Curry",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-North Petherton",
                "text": "North Petherton",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Petherton",
                "text": "Petherton",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Stoke St. Gregory",
                "text": "Stoke St. Gregory",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Street",
                "text": "Street",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Sunnyside",
                "text": "Sunnyside",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Wedmore",
                "text": "Wedmore",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-West Stoughton",
                "text": "West Stoughton",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-Yeovil",
                "text": "Yeovil",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Somerset-unknown",
                "text": "unknown",
                "parent": "SW-Somerset",
                "icon": false
            },
            {
                "id": "SW-Wiltshire-Donhead St. Andrew",
                "text": "Donhead St. Andrew",
                "parent": "SW-Wiltshire",
                "icon": false
            },
            {
                "id": "SW-Wiltshire-Edington",
                "text": "Edington",
                "parent": "SW-Wiltshire",
                "icon": false
            },
            {
                "id": "SW-Wiltshire-Enford",
                "text": "Enford",
                "parent": "SW-Wiltshire",
                "icon": false
            },
            {
                "id": "SW-Wiltshire-Melksham",
                "text": "Melksham",
                "parent": "SW-Wiltshire",
                "icon": false
            },
            {
                "id": "SW-Wiltshire-Trowbridge",
                "text": "Trowbridge",
                "parent": "SW-Wiltshire",
                "icon": false
            },
            {
                "id": "SW-Wiltshire-Urchfont",
                "text": "Urchfont",
                "parent": "SW-Wiltshire",
                "icon": false
            },
            {
                "id": "SW-Wiltshire-Westbury",
                "text": "Westbury",
                "parent": "SW-Wiltshire",
                "icon": false
            },
            {
                "id": "Wal-Denbighshire-Conwy",
                "text": "Conwy",
                "parent": "Wal-Denbighshire",
                "icon": false
            },
            {
                "id": "Wal-Denbighshire-unknown",
                "text": "unknown",
                "parent": "Wal-Denbighshire",
                "icon": false
            },
            {
                "id": "Wal-Glamorgan-Bishopston",
                "text": "Bishopston",
                "parent": "Wal-Glamorgan",
                "icon": false
            },
            {
                "id": "Wal-Glamorgan-Plasmarl",
                "text": "Plasmarl",
                "parent": "Wal-Glamorgan",
                "icon": false
            },
            {
                "id": "Wal-Glamorgan-Pontardulais",
                "text": "Pontardulais",
                "parent": "Wal-Glamorgan",
                "icon": false
            },
            {
                "id": "Wal-Glamorgan-Townhill",
                "text": "Townhill",
                "parent": "Wal-Glamorgan",
                "icon": false
            },
            {
                "id": "Wal-Glamorganshire-Bedlinog",
                "text": "Bedlinog",
                "parent": "Wal-Glamorganshire",
                "icon": false
            },
            {
                "id": "Wal-Glamorganshire-Cwmfelin",
                "text": "Cwmfelin",
                "parent": "Wal-Glamorganshire",
                "icon": false
            },
            {
                "id": "Wal-Glamorganshire-Swansea",
                "text": "Swansea",
                "parent": "Wal-Glamorganshire",
                "icon": false
            }];