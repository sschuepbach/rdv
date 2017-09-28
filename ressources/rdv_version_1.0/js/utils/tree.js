// Note which values ​​were clicked in which tree

var tree_data_selected_array = [];

//Prepare trees for hierarchical search
function prepareTrees() {

    //several trees can be created
    $.each(config_array["tree_array"], function (i, tree_id) {

        //Initialize valuemerkarray with empty array
        tree_data_selected_array[tree_id] = [];

        //assume that checkboxes are displayed in the 3 state
        var three_state = true;

        // if it should be individually clickable checkboxes
        if (has_feature("no_three_state_tree")) {

            //Adjust the variable
            three_state = false;
        }

        //Build JS tree
        $('#tree_' + tree_id).jstree({
            'core': {
                //Allow renaming
                'check_callback': true,
                //Load JSON data
                'data': tree_data_array[tree_id]
            },
            "search": {"show_only_matches": config_array["tree_show_only_matches"]},
            "plugins": [
                //Search in the tree
                "search",
                //whole line clickable
                "wholerow",
                //Nodes as checkboxes
                "checkbox"
            ],
            "checkbox": {
                "three_state": three_state
            }
        });

        //Expand the tree
        $('#open_' + tree_id).click(function () {

            //Open all nodes
            $('#tree_' + tree_id).jstree("open_all");
        });

        //Collapse the tree
        $('#close_' + tree_id).click(function () {

            //close all nodes
            $('#tree_' + tree_id).jstree("close_all");
        });

        //Assign search fields for search in tree with function
        $('#search_' + tree_id).on("search keyup", function (event) {

            //read the value from the input
            var term = $.trim($('#search_' + tree_id).val());

            //Term must have a minimum length
            if (term.length < 3) {
                term = "";
            }

            //Search for the term in a corresponding tree
            $('#tree_' + tree_id).jstree(true).search(term);
        });

        //Event listener when changing the tree (click or click)
        $('#tree_' + tree_id).on("changed.jstree", function () {

            //If it is a tri-state tree
            if (!has_feature("no_three_state_tree")) {

                //clever: To reduce the number of OR queries, collect only the nodes that are hooked up in the hierarchy. (Hit with LOC_CLEAN_all_facet North-Durham-Britley, also has LOC_CLEAN_all_facet value North-Durham and North). So when North is completely selected, it is enough to search for North because the elements in the hierarchy are also found
                tree_data_selected_array[tree_id] = $('#tree_' + tree_id).jstree('get_top_selected');
            }

            //it is not a tri-state tree (each node counts for itself)
            else {

                //get all selected nodes
                tree_data_selected_array[tree_id] = $('#tree_' + tree_id).jstree('get_selected');
            }

            //If the number of selected nodes should be displayed in the tree
            if (has_feature("show_tree_select_count")) {

                //Customize the display
                $('#tree_select_count_' + tree_id).text(tree_data_selected_array[tree_id].length);
            }

            //Send the request
            sendQuery();
        });

        //Event listener after (asynchronous) creation of the tree
        $('#tree_' + tree_id).on("loaded.jstree", function () {
                 // Now call specialInit with solrQuery, otherwise the values ​​for tree nodes will not be displayed
                 special_init(false);
        });
    });
}

//Adjust the number of hits of the nodes in the tree
function updateTreeCount() {

    //walk over existing trees
    $.each(config_array["tree_array"], function (i, tree_id) {

        //Go over facet values ​​of this tree (all facet values ​​are fetched, also those with 0 hits)
        $.each(getFacetValues(tree_id), function (facetValue, count) {

            //get current text value of the node in the tree: North (33)
            var text_full = $('#tree_' + tree_id).jstree("get_text", facetValue);

            //If node exists in the tree
            if (text_full !== false) {

                //get current text value of the node in the tree: North (33)
                var substr_length = (text_full.lastIndexOf(" (") > 1) ? text_full.lastIndexOf(" (") : text_full.length;
                var text_without_count = text_full.substring(0, substr_length);

                //Anzahl als neuen Text des Baumknotens hinten einfuegen: North -> North (14)
                $('#tree_' + tree_id).jstree("rename_node", facetValue, text_without_count + " (" + count + ")");
            }
        });
    });
}