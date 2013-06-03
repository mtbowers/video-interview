/**
*   @todo: Convert this to more MVC using client side mvc framework like backbonejs 
*          have a bit more structure and spearation of concern and MVVM happening
*   @todo Re factor the file so that it can be used for both key business process 
*         and key support processes
*/
var Objectives = {
    
    /**
    * Reference to grid instance
    *
    * @author Sachit Malhotra, Clear Blue Water Pty. Ltd
    * @since 11 December 2012
    */
    grid: "",

    /**
    * Reference to grid options for the current instance
    *
    * @author Sachit Malhotra, Clear Blue Water Pty. Ltd
    * @since 11 December 2012
    */
    options: {},

    currencySymbol: "",
    
    /**
    * Add active class to the current view tab
    *
    * @param string tab css class of the tab to activate
    * @return void
    * @author Sachit Malhotra, Clear Blue Water Pty. Ltd
    * @since 11 December 2012
    */
    setActiveTab: function ( tab ) {        
        $('#headerNav li').removeClass('active');
        $('li.' + tab).addClass('active');              
    },

    /**
    * Show hide buttons toggle
    * This enables a user to show hide the buttons so that they hey 
    * clean view of the grid
    *
    * @return void
    * @author Sachit Malhotra, Clear Blue Water Pty. Ltd
    * @since 27 March 2013
    */
    bindToggleEdit: function() {

        var btn = $('#btnToggleEdit');
        btn.on('click', function(e) {
            var $this = $(e.target),
            tog = $this.data('__toggle__'),
            b1 = $('.btnAddInstanceValue'),
            b2 = $('.toolbox');

            if (!tog) {
                tog = 0;
            }

            // show
            if (tog == 0) {
                b1.show();
                b2.show();
                $this.data('__toggle__', 1).text('Finish');
            }

            // hide
            if (tog == 1) {
                b1.hide();
                b2.hide();
                $this.data('__toggle__', 0).text('Edit');
            }

            return false;
        })
        .data('__toggle__', 1)
        .trigger('click');

    },
    
    getObjectives: function( callback ) {
        $.ajax({
            url: "/application/objectives/getObjectiveList?processId=" + encodeURIComponent(spUri),
            dataType: 'json',
            type: 'GET',
            success: function ( d ) {
                if ( callback ) {
                    callback(d);
                }
            }
        });
    },
    
    /**
    * Send ajax request to update the key support process
    *
    * @param object data A key value pair for post data
    * @param function callback Function to act upon ajax success
    * @return void
    * @author Sachit Malhotra, Clear Blue Water Pty. Ltd
    * @since 11 December 2012
    */
    update: function( data, callback ) {
        
        $.ajax({
            url: '/application/kpi/update',
            data: data,
            type: 'POST',
            dataType: 'json',
            success: function(d) {
                if ( callback ) {
                    callback( d );
                }
            }
        });
    },
    
    /**
    * On Edit Request handler for the grid plugin
    *
    * @param window.event e A click event object
    * @param array data Data for the key support process instance
    * @param dom row Dom nodes of the key support process being eidted
    * @param dom modal the modal for editing key support process
    * @return void
    * @author Sachit Malhotra, Clear Blue Water Pty. Ltd
    * @since 11 December 2012
    */
    onEditSave: function ( e, data, row, modal ) {
        
        var dialog = modal,
        originalData = data,
        inputs = modal.find('input[type=text]'),
        selects = modal.find('select'),
        input,
        key,
        originalValue,
        value,
        update = true;

        $.each(inputs, function(k, v) {

            input = $(v);
            key = input.attr('id');
            value = input.val();
            originalValue = (typeof data[key] == 'object') ? data[key]['value'] : data[key];

            data[key] = value;

        });
        $.each(selects, function(k, v) {

            input = $(v);
            key = input.attr('id');
            value = input.val();
            

            data[key] = value;
            
        });

        var frequency = data['kpifrequency'];
        var error = false;
        var errMsg = [];

        var measuretype = data['kpimeasuretype'];
        if(measuretype != Objectives.currencySymbol && measuretype != '#' && measuretype != '%' && measuretype != 'Nil') {
            //$('#kpi-err').html('Please select a Measure Type').show();
            errMsg.push('Please select a Measure Type.');
            error = true;
        }

        if(frequency != 'M' && frequency != 'Q' && frequency != 'Y'  && measuretype != 'Nil') {
            //$('#kpi-err').html('Please select a Frequency').show();
            errMsg.push('Please select a Frequency.');
            error = true;
        }

        if(error) {
            var message = '';
            var count = errMsg.length;
            var i;
            for(i in errMsg) {
                message += errMsg[i];

                if(count > 0) {
                    message += '<br>';
                }
            }
           $('#kpi-err').html(message).show();
           return false;
        }

        if(measuretype == 'Nil') {
            data['kpifrequency'] = "";
            data['kpimeasure'] = "";
            data['kpibaselineend'] = "";
            data['kpitargetdate1'] = "";
            data['kpitargetdate2'] = "";
            data['kpitargetdate3'] = "";
        }

            // Do on update success
        modal.modal('hide');
        data['linkId'] = originalData['objective__id'];

        Objectives.update(data, function( d ) {

            originalData = $.extend({}, originalData, data);
            row.data('__row__data__', originalData);

            $.each (data, function( k, v ) {

                value = (Utils.isObject(v)) ? "<span class='measure'>" + v.type + "</span>" + v.value : v;
                var td = row.find("." + k);

                if (k !== 'kpiinstancevalue' && k !== 'objectivetitle') {
                    
                    if ( td.length ) {
                        td.html(value);
                    }

                    if ( k == 'kpimeasuretype' ) {
                       if(value == Objectives.currencySymbol) { dtype = Objectives.currencySymbol; }
                        row.find('.kpimeasure')
                            .prepend(
                                '<span class="kpimeasuretype" style="margin-right: 5px;"> ' +
                                value + '</span>'
                            );
                    }
                }
            });
        });

        return false;
    },

    /**
    * Send ajax request to delete a key support process
    *
    * @param string kpi uri of the kpi to be deleted
    * @param function callback Function to act upon ajax success
    * @return void
    * @author Sachit Malhotra, Clear Blue Water Pty. Ltd
    * @since 11 December 2012
    */
    _delete: function ( kpi, callback ) {
        
        $.ajax({
            url: '/application/kpi/delete',
            data: {
                uri: escape(kpi)
            },
            type: 'post',
            dataType: 'json',
            success: function( d ) {

                if ( callback ) {
                    callback( d );
                }
                
            }
        });
    },
    
    /**
    * On Delete Request handler for the grid plugin
    *
    * @param window.event e A click event object
    * @param array rowData Data for the key business process instance
    * @param dom row Dom nodes of the key business process being eidted
    * @param dom modal the modal for editing key business process
    * @return void
    * @author Sachit Malhotra, Clear Blue Water Pty. Ltd
    * @since 11 December 2012
    */
    onDelete: function ( e, rowData, row, modal ) {
           
        var rowId = parseInt(row.attr("id")),
        data = Objectives.grid.getData(),
        kpi = rowData['kpi__id'],
        table,
        rows,
        newRow;
           
        if (kpi === '') {
            alert("No Kpi to delete");
            return;
        }
        
        Objectives._delete(kpi, function( d ) {
            
            table = row.parent('tbody').parent('table'),
            rows;

            rows = table.find('tr');
            row.remove();
            
            if (rows.length === 2) {
                
                // Reset data
                rowData.kpi__id = "";
                rowData.kpifrequency = "";
                rowData.kpimeasure = "";
                rowData.kpimeasuretype = "";
                rowData.kpitargetdate1 = "";
                rowData.id = "";
                
                newRow = Objectives.grid.createRow( rowData, Objectives.options.columns, Objectives.grid, true, 0);
                table.append(newRow);
            }

            modal.modal('hide');
            
        });
    },
    
    /**
    * Send ajax request to save a key support process
    *
    * @param object data A key value pair for post data
    * @param function callback Function to act upon ajax success
    * @return void
    * @author Sachit Malhotra, Clear Blue Water Pty. Ltd
    * @since 11 December 2012
    */
    save: function ( data, callback ) {
        
        $.ajax({
            url: '/application/kpi/save',
            data: data,
            type: 'POST',
            dataType: 'json',
            success: function(d) {
                
                if ( callback ) {
                    callback( d );
                }
            }

        });
    },
    
    /**
    * On Save Request handler for the grid plugin
    *
    * @param window.event e A click event object
    * @param dom row Dom nodes of the key support process being eidted
    * @param dom modal the modal for editing key support process
    * @return void
    * @author Sachit Malhotra, Clear Blue Water Pty. Ltd
    * @since 11 December 2012
    */
    onSave: function ( e, row, modal ) {

        var dialog = modal,
        data = {},
        inputs = modal.find('input[type=text]'),
        selects = modal.find('select'),
        input,
        key,
        value,
        key,
        add = false,
        value,
        newRow,
        rowCount = 0,
        tr,
        firstKpi = false,
        table,
        rowData = row.data('__row__data__');

        $.each(inputs, function(k, v) {
            input = $(v);
            key = input.attr('id');
            value = input.val();
            data[key] = value;
        });

        $.each(selects, function(k, v) {

            input = $(v);
            key = input.attr('id');
            value = input.val();
            

            data[key] = value;
            
        });

        // Do this on save .. we need to attach querybuilder data for this row
        data.linkId = rowData['objective__id'];
        data.objective = 1;

        var frequency = data['kpifrequency'];
        var error = false;
        var errMsg = [];

        var measuretype = data['kpimeasuretype'];
        if(measuretype != Objectives.currencySymbol && measuretype != '#' && measuretype != '%' && measuretype != 'Nil') {
            //$('#kpi-err').html('Please select a Measure Type').show();
            errMsg.push('Please select a Measure Type.');
            error = true;
        }

        if(frequency != 'M' && frequency != 'Q' && frequency != 'Y'  && measuretype != 'Nil') {
            //$('#kpi-err').html('Please select a Frequency').show();
            errMsg.push('Please select a Frequency.');
            error = true;
        }

        if(error) {
            var message = '';
            var count = errMsg.length;
            for(i in errMsg) {
                message += errMsg[i];

                if(count > 0) {
                    message += '<br>';
                }
            }
           $('#kpi-err').html(message).show(); 
           return false;
        }

        if(measuretype == 'Nil') {
            data['kpifrequency'] = "";
            data['kpimeasure'] = "";
            data['kpibaselineend'] = "";
            data['kpitargetdate1'] = "";
            data['kpitargetdate2'] = "";
            data['kpitargetdate3'] = "";
        }

        Objectives.save(data, function(d) {
            
            firstKpi = (rowData.kpi__id === '') ? true : false;

            data.id = d.uri;
            data.kpi__id = d.uri;
           
            table = $( row ).parent( 'tbody' ).parent( 'table' );

            if (firstKpi) {
                tr = table.find('tr#0');                
                tr.remove();
                data.processtitle = rowData.processtitle;
                add = true;
            }

            rowCount = table.find('tr');
            
            rowData = $.extend({}, rowData, data);
            newRow = Objectives.grid.createRow( rowData, Objectives.options.columns, Objectives.grid, add, rowCount.length);
            table.append(newRow);
            dialog.modal('hide'); 
    
        });
        
        return false;

    },
    
    buildGrid: function( d ) {
        
        var data = d.data,
        options = {
            layout: 'fluid',
            tableCssClass: "table table-bordered table-condensed",
            id: "objTable"
        };
        
        options.columns = data.columns;
        options.data = data.data;

        options.onDelete = Objectives.onDelete;     
        options.onEditSave = Objectives.onEditSave;
        options.onAddSave = Objectives.onSave;
        options.type = "objective";
        options.isObjective = true;
        options.currencySymbol = Objectives.currencySymbol;

        var grid = $('#dataGrid').bsGrid(options);
        grid.build();

        Objectives.grid = grid;
        Objectives.options = options;

        Objectives.bindToggleEdit();
    },
    
    /**
    * Initialize the KBS Grid
    * Use the grid plugin to display the list of key support processes and their KPI
    *
    * @return void
    * @author Sachit Malhotra, Clear Blue Water Pty. Ltd
    * @since 11 December 2012
    */
    init: function (currencySymbol) {
        this.currencySymbol = currencySymbol;
        this.setActiveTab( 'objectives' );
        this.getObjectives( this.buildGrid );
    }
};