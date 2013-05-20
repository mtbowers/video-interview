;(function ($, window) {
    'use strict';

    var Utils = window.Utils = {

        isset: function ( v ) {
            return typeof v !== 'undefined';
        },

        isObject: function( v ) {
            return typeof v === 'object';
        },

        sizeOf: function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    size++;
                }
            }
            return size;
        },

        removeFromArray:  function(array, from, to) {
            var rest = array.slice((to || from) + 1 || array.length);
            array.length = from < 0 ? array.length + from : from;
            return array.push.apply(array, rest);
        }

    };

    var Template = window.Template = {

        th: function () {
            return $( "<thead></thead>" );
        },

        table: function () {
            return $( "<table></table>" );
        },

        row: function () {
            var row = $( "<tr></tr>" );
            return row;
        },

        col: function () {
            var col = $( "<td></td>" );
            return col;
        },

        createModal: function( options, data, type, add, button ) {
            var modal = $( '<div class="modal hide fade" id="modal-' + options.id + '"></div>' )
                            .data( '__data__', data ),
            errorEl = $("<div id='kpi-err' class='alert alert-error'></div>").hide(),
            val = "",
            modalHeader = $( '<div></div>' )
                .addClass( 'modal-header' )
                .append( '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' )
                .append( '<h3></h3>' ),

            form = $( '<div class="form form-horizontal"></div>' ),
            modalBody = $( '<div class="modal-body"></div>' )
                .append( form ),
            cancel = $( "<a href='#' class='btn'>Cancel</a>" )
                .on( 'click', function(e) {
                    var parent = $(this).parent( '.modal-footer' ).parent( '.modal' );
                    parent.modal('hide');
                }),
            i = 0,
            modalContent,
            modalFooter,
            save,
            del;

            var currencySymobl = options['currencySymbol'];

            if ( type == 'primary' ) {

                if ( add ) {
                    modalHeader.find( 'h3' ).text( "Add Measure" );
                } else {
                    modalHeader.find( 'h3' ).text( "Edit Measure" );
                }

                var columns = options.columns[0];
 
                for ( i in columns ) {

                    if ( i === "processtitle" || i === "objectivetitle" || i === 'kpiinstancevalue' ) {
                        continue;
                    }

                    var column = columns[i],
                    name = column.name;
                    val = ( typeof data[column.name] === 'object' ) ? data[column.name]['value'] : data[column.name];

                    if ( add ) {
                        val = "";
                    }

                    var form_ele = '<input type="text" name="' + name + '" id="'+ column.name + '" value="' + val + '" />';
                    if('kpifrequency' == column.name ){
                            form_ele = '<select name="' + name + '" id="'+ column.name + '">';
                            var sel1 = '', sel2 = '', sel3 ='',sel_text='selected="selected"';
                            if(val == 'M') sel1 = sel_text;
                            if(val == 'Q') sel2 = sel_text;
                            if(val == 'Y') sel3 = sel_text;
                            form_ele += '<option value="">Select Frequency</option>';
                            form_ele += '<option value="M" '+sel1+'>M</option>';
                            form_ele += '<option value="Q" '+sel2+'>Q</option>';
                            form_ele += '<option value="Y" '+sel3+'>Y</option>';
                            form_ele += '</select>';
                    } else if ( name === 'kpimeasure' ) {

                        var valType = data['kpimeasuretype'];
                        val = data[column.name];

                        if ( add ) {
                            val = "";
                            valType = "";
                        }                        

                        form_ele = '<select onchange="disableAll(this)" name="kpimeasuretype" id="kpimeasuretype">';
                        var sel1 = '',
                        sel2 = '', sel3 = '', sel4 = '';
                        sel_text = 'selected="selected"';
                        if(valType == currencySymobl) sel1 = sel_text;
                        if(valType == '#') sel2 = sel_text;
                        if(valType == '%') sel3 = sel_text;
                        if(valType == 'Nil') sel4 = sel_text;
                        form_ele += '<option value="">Select Type</option>';
                        form_ele += '<option value="' + currencySymobl + '" '+sel1+'>' + currencySymobl + '</option>';
                        form_ele += '<option value="#" '+sel2+'>#</option>';
                        form_ele += '<option value="%" '+sel3+'>%</option>';
                        form_ele += '<option value="Nil" '+sel4+'>Nil</option>';
                        form_ele += '</select>';

                        modalContent = $( "<div class='row control-group'></div>" )
                            .append( $("<label class='control-label'>" + "Measurement Type" + "</label>") )
                            .append(
                                $( "<div class='controls'></div>" )
                                    .append(
                                        $(form_ele)
                                    )
                            );

                        form.append( modalContent );
                        form_ele = '<input type="text" name="' + name + '" id="'+ column.name + '" value="' + val + '" />';
                    }

                    if(column.label == 'Measure') {
                        column.label = 'Measurement Wording';
                    } else if(column.label == 'Frequency') {
                        column.label = 'Measurement Frequency';
                    }

                    modalContent = $( "<div class='row control-group'></div>" )
                            .append( $("<label class='control-label'>" + column.label + "</label>") )
                            .append(
                                $( "<div class='controls'></div>" )
                                    .append(
                                        $(form_ele)
                                )
                            );

                    form.append( modalContent );



                }

                modalBody.append(errorEl).append( form );

                modalFooter = $( "<div class='modal-footer'></div>" );
                save = $( '<button class="btn btn-success">Save</button>' )
                    .on( 'click', function(e) {

                        var target = button,
                        toolbar,
                        row,
                        rowData;

                        toolbar = target.parent( '.toolbox' ),
                        row = button.closest( 'tr.row' );
                        rowData = row.data('__row__data__');

                        if ( options.onAddSave && add ) {
                            options.onAddSave( e, row, modal );
                        }

                        if ( options.onEditSave && !add ) {
                            options.onEditSave( e, rowData, row, modal );
                        }

                        return false;
                    });

                modalFooter.append( cancel ).append( save );

            } else {

                modalHeader.find( 'h3' ).text( "Delete KPI" );
                modalBody.append('<div class="modal-body"><p>Are you sure you want to delete this KPI?</p></div>');

                modalFooter = $( "<div class='modal-footer'></div>" );

                del = $( '<button class="btn btn-danger">Delete</button>' )
                    .on( 'click', function(e) {

                        var target = button,
                        toolbar,
                        row,
                        rowData;

                        toolbar = target.parent( '.toolbox' ),
                        row = button.closest( 'tr.row' );
                        rowData = row.data( '__row__data__' );

                        if ( options.onDelete ) {
                            options.onDelete( e, rowData, row, modal );
                        }

                        return false;
                    });

                modalFooter.append( cancel ).append( del );
            }

            if(modalBody.find('select[name=kpimeasuretype]').val() == 'Nil') {
                modalBody.find('select[name!=kpimeasuretype]').attr("disabled", true);
                modalBody.find('input[type=text]').attr("disabled", true);
            }

            modal
                .append( modalHeader )
                .append( modalBody )
                .append( modalFooter );

            modal.on( 'hidden', function( e ) {
                $( this ).remove();
            });

            return modal;
        },



        frequencyModal: function( title, frequency, add ) {

            var modal = $("<div class='modal hide fade'></div>").attr({'id': 'targetInstanceModal'}),
            errorEl = $("<div id='kpi-frequency' class='alert alert-error'></div>").hide(),
            modalHeader = $( '<div></div>' )
                .addClass( 'modal-header' )
                .append( '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' )
                .append( '<h3>' + title + '</h3>' ),
            modalBody = $('<div class="modal-body"></div>'),
            form = $( '<div class="form form-horizontal"></div>' ).append("<div id='error' class='alert alert-error' style='display: none;'></div>"),
            months = [
                        {'label': "January", 'value': '01'},
                        {'label': "February", 'value': '02'},
                        {'label': "March", 'value': '03'},
                        {'label': "April", 'value': '04'},
                        {'label': "May", 'value': '05'},
                        {'label': "June", 'value': '06'},
                        {'label': "July", 'value': '07'},
                        {'label': "August", 'value': '08'},
                        {'label': "September", 'value': '09'},
                        {'label': "October", 'value': '10'},
                        {'label': "November", 'value': '11'},
                        {'label': "December", 'value': '12'}
                    ],
            quarters = ["Q1", "Q2", "Q3", "Q4"],
            select = $("<select name='kpiinstanceperiod' id='kpiinstanceperiod'></select>"),
            option = $("<option>"),
            i,
            month,
            quarter,
            year = $('<select id="periodYear"></select>'),
            val = $('<input id="kpiValue" placeholder="Current Value" type="text" name="kpiValue"></input>'),
            formGroup = $( "<div class='row control-group'></div>" ),
            label = $("<label class='control-label'></label>"),
            controls = $( "<div class='controls'></div>" ),
            cancel = $( "<a href='#' class='btn'>Close</a>" )
                .on( 'click', function(e) {
                    var parent = $(this).parent( '.modal-footer' ).parent( '.modal' );
                    parent.modal('hide');
                }),
            modalFooter = $( "<div class='modal-footer'></div>" ),
            save = $( '<button id="btnSaveKPIInstanceValue" class="btn btn-success">Save</button>' )
                        .on('click', function(e) {

                            var dialog = $('#targetInstanceModal'),
                            error = $('#error'),
                            parent = dialog.data('parent_el'),
                            data = dialog.data('__data__'),
                            kpi = data['kpi__id'],
                            period = dialog.find('select#kpiinstanceperiod'),
                            periodVal = period.val(),
                            year = dialog.find('#periodYear'),
                            yearVal = year.val(),
                            valInp = dialog.find('#kpiValue'),
                            val = valInp.val();

                            if (periodVal == '' && (frequency == 'M' || frequency == 'Q') ) {
                                error.empty().html("Period cannot be blank.").show();
                                //console.log('Show Error:: PERIOD_EMPTY');
                                return false;
                            }
                            
                            if (yearVal == '') {
                                error.empty().html("Year cannot be blank.").show();
                                //console.log('Show Error:: YEAR_EMPTY');
                                return false;
                            }
                            
                            if (val == '') {
                                error.empty().html("Value cannot be blank.").show();
                                //console.log('Show Error:: VAL_EMPTY');
                                return false;
                            }

                            var date = new Date(),
                            currentYear = date.getFullYear(),
                            currentMonth = date.getMonth();

                            if (parseInt(yearVal) === currentYear && frequency === 'M' 
                                &&  parseInt(periodVal) > (currentMonth + 1)) {
                                error.empty().html("Future value cannot be added.").show();
                                //console.log("Show Error:: VAL_FUTURE");
                                return false;
                            }
                            
                            var periodString = (frequency == 'M' || frequency == 'Q') ? 
                                                yearVal + ":" + periodVal : yearVal;

                            $.ajax({
                                url: '/application/kpi/saveKPIInstance',
                                data: {
                                    period: periodString,
                                    val: val,
                                    id: kpi,
                                    frequency: frequency
                                },
                                type: 'POST',
                                dataType: 'json',
                                success: function( d ) {                                    
                                    dialog.modal('hide');
                                    var t = parent.find('.kpiinstancevalue'),
                                    button = t.find('.btnAddInstanceValue').clone(true);

                                    t.empty().append(val).append(button);
                                }
                            });
                            
                            return false;
                        });
            
            // Period Month
            if ( frequency === 'M' ) {
                
                select.append( option.clone().attr({'value': ''}).text('Select a Month'));
                
                for ( i in months ) {
                    month = months[i];
                    select.append( option.clone().attr({'value': month.value}).text(month.label));
                }
                
                form.append( 
                    formGroup.clone(false)
                        .append(label.clone(false).text("Period Month"))
                        .append(controls.clone(false).append(select))
                );
                                
            }
            
            // Period Quarter
            if ( frequency === 'Q' ) {
                
                select.append( option.clone().attr({'value': ''}).text('Select a Quarter'));
                                
                for ( i in quarters ) {
                    quarter = quarters[i];
                    select.append( option.clone().attr({'value': quarter}).text(quarter));
                }
                
                form.append( 
                    formGroup.clone(false)
                        .append(label.clone(false).text("Period Quarter"))
                        .append(controls.clone(false).append(select))
                );              
            }
            
            var date = new Date(),
            currentYear = date.getFullYear(),
            range = date.getFullYear() - 4;
            
            
            
            for (var i = range; i <= currentYear; i++) {
                
                var o = option.clone().attr({'value': i}).text(i);

                if (i === currentYear) {
                    o.attr({'selected': 'Yes'});
                }

                year.append(o);
            }

            // Period Year
            form.append(
                formGroup.clone(false)
                    .append(label.clone(false).text("Year"))
                    .append(controls.clone(false).append(year))
            );

            // KPI Instance Value
            form.append(
                formGroup.clone(false)
                    .append(label.clone(false).text("Value"))
                    .append(controls.clone(false).append(val))
            );

            modalBody.append(errorEl).append(form);
            modalFooter.append(cancel).append(save);
            modal.append(modalHeader).append(modalBody).append(modalFooter);

            return modal;

        },

        toolbox: function ( options, data, addButton ) {

            var toolbar = $("<div class='dropdown toolbox'></div>"),
            dropdown = $('<ul class="dropdown-menu" role="menu" aria-labelledby="Actions"></ul>'),
            add = $('<li role="presentation"><a role="menuitem" tabindex="-1" href="#"><i class="icon-plus"></i> Add KPI</a></li>'),
            edit = $('<li role="presentation"><a role="menuitem" tabindex="0" href="#"><i class="icon-pencil"></i> Edit KPI</a></li>'),
            _delete = $('<li role="presentation"><a role="menuitem" tabindex="0" href="#"><i class="icon-trash"></i> Delete KPI</a></li>');

            toolbar.append('<a class="dropdown-toggle" id="drop5"' +
                            ' role="button" data-toggle="dropdown"' +
                            ' href="#"><i class="icon-cog"></i></a>');

            if ( addButton && options.add ) {
                add.on('click', function(e) {
                    var modal = Template.createModal( options, {}, "primary", true, $( e.target ) );
                    $( "body" ).append( modal );
                    modal.modal();
                });
                dropdown.append( add );
            }

            edit.on( 'click', function(e) {
                var target = $(e.target),
                row = target.closest('tr'),
                _data = row.data('__row__data__');

                $( "body" ).append(
                    Template.createModal(
                        options,
                        _data,
                        "primary",
                        false,
                        $( e.target )
                    )
                );

                $( '#modal-' + options.id ).modal( 'show' );
            });

            _delete.on('click', function(e) {

                var target = $(e.target),
                row = target.closest('tr'),
                _data = row.data('__row__data__');

                $("body").append(
                    Template.createModal(
                        options,
                        _data,
                        "",
                        false,
                        $( e.target )
                    )
                );

                $( '#modal-' + options.id ).modal( 'show' );
            });

            dropdown.append(edit).append(_delete);
            toolbar.append(dropdown).data( '__data__', data );
            return toolbar;
        }
    };

})(jQuery, window);

;(function ($, window) {
    'use strict';

    /**
    * Data Grid constructor
    *
    *
    * @param el element this plugin is attached to
    * @param options user defined plugin options
    * @api Public
    */
    var DataGrid = function ( el, options ) {

        if ( !window.jQuery ) {
            return "jQuery is not Defined. This plugin requires jquery version 1.7.2";
        }

        if ( !window.Template ) {
            return "This plugin depends on Template module. Please make sure template module is loaded.";
        }

        var defaults = {
            data: [],
            onEditSave: false,
            onAddSave: false,
            onDelete: false,
            layout: 'fixed',
            tableCssClass: "",
            add: true,
            type: 'KBP',
            isObjective: false
        },
        table = "",
        that = this;
        
        options = $.extend({}, defaults, options);
        
        that.getParent = function () {
            return el;
        };
        
        that.getOptions = function () {
            return options;
        };
        
        that.setTable = function ( table ) {
            that.table = table;
        };
        
        that.getUnit = function () {
            return ( options.layout === 'fixed' ) ? 'px' : '%';
        };
        
        /**
        * Build the grid and display it on the page
        *
        * @return void
        */
        that.getData = function () {
            return options.data;
        };  
        
        /**
        * Build the grid and display it on the page
        *
        * @return void
        */
        that.setData = function ( data ) {
            options.data = data;            
        };  
        
        that.rebuild = function() {
            $(el).empty();
            this.build();
        };
       
    };

    var grid = DataGrid.prototype;
    
    /**
    * Build the grid and display it on the page
    *
    * @return void
    */
    grid.build = function () {
        
        var self = this,
        target = $(self.getParent()),
        options = self.getOptions(),
        
        // Header table
        table = Template.table()
                .addClass( options.tableCssClass )
                .attr( {'id': "header-" + options.id} ),
        
        // Body table
        tableBody = Template.table()
                .addClass( options.tableCssClass )
                .attr( {'id': "body-" + options.id} ),
        
        // px or %      
        unit = self.getUnit(),
        
        // Grid table header
        header = grid.createHeader( options.columns, unit ),
        thead = Template.th(),
        body,
        i;
        
        self.setTable( table );
        table.append( thead.append( header ) );
        
        // Grid table Body
        body = grid.createBody( options, unit, self );
        
        for ( i = 0; i < body.length; i++) {
            tableBody.append(body[i]);
        }
        
        // Display it on teh screen
        target.append( table ).append( tableBody ); 
        
        self.adjustTableHeight(tableBody);
    };

    /**
    * Re adjust table height and realign the text within it
    *
    * @param {Object} column list of columns
    * @param {String} unit column width unit i.e px or %
    * @return {DOM} html
    * @api Public
    */
    grid.adjustTableHeight = function(tables, isObjective) {
        var titles = tables.find('div.tableTitle'),
        height,
        table,
        title,
        titleHeight,
        tableHeight,
        $this,
        self = this,
        options = self.getOptions();

        titles.each(function() {
            $this = $(this);
            table = $this.closest('table');
            titleHeight = parseInt($this.height(), 10);
            tableHeight = parseInt(table.height(), 10);
            height = Math.max.apply(Math, [titleHeight, tableHeight]);
            // Re adjust height of the table and give it a bit of padding
            table.height(height + 10);
            if (options.isObjective) {
                // // Center the text within the table
                $this.css(
                    'marginTop', (($(table).innerHeight() - $this.outerHeight()) / 2) + 'px'
                );    
            }
            
        });
    };
    
    /**
    * Create Grid table header
    *
    * @param {Object} column list of columns
    * @param {String} unit column width unit i.e px or %
    * @return {DOM} html
    * @api Public
    */
    grid.createHeader = function ( columns, unit ) {
        
        var header = Template.row().data( '__row__data__', columns ),
        i, 
        j, 
        col,
        _column, 
        column,
        label = "";

        if ( columns.length > 0 ) {
            
            for ( i in columns ) {

                column = columns[i];
                
                for ( j in column ) {
                    
                    _column = column[j];
                    
                    col = Template.col();
                    label = _column.label;

                    col.css( {width: _column.sizeX + unit} );
                    col.data( "__column__data__", _column );

                    if ( Utils.isset( _column.caption ) && _column.caption !== '' ) {
                        label += "<br><small>" + _column.caption + "</small>";
                    }

                    col.html(label)
                        .attr( { 'id': _column.name } );

                    header.append( col );   
                    
                }
            }
            
            header.append( Template.col().css({'width': "10%"}).text('KPI + / - / Edit') );
        }
        
        return header;
    };
    
    /**
    * Create grid body
    *
    * @param {Object} options plugin options 
    * @param {String} unit row width unit i.e px or %
    * @return {Dom} html
    * @api Public
    */
    grid.createBody = function( options, unit, self ) {
        
        var i = 0,
        j = 0,
        k = 0,
        l = 0,
        row,
        cells,
        cell,
        column,
        cellValue = "",
        rowContainer,
        colContainer, 
        table, 
        tableRow,
        rows = [],
        cssClass = "",
        data = options.data,
        columns = options.columns[0],
        unit = self.getUnit(),
        add = true,
        cellIsObject,
        nr, 
        tc,
        link,
        processId,
        _options = self.getOptions(),
        titles = [],
        isObjective = false,
        sizes = [];
        for (var x in columns) {
            sizes.push(columns[x].sizeX);
        }

        for ( i in data ) {
            
            row = data[i];
            add = true;

            rowContainer = Template.row().data( '__row__data__', cells );
            table = Template.table().addClass( options.tableCssClass );

            for ( j in row ) {

                cells = row[j];
                processId = cells.process__id;

                if ( j >= 1) {
                    add = false;
                }
                
                cell = cells;
                tableRow = Template.row().data( '__row__data__', cell ).addClass( 'row' ).attr({'id': j});
                                
                for ( k in columns ) {
                    
                    column = columns[k];
                    cellIsObject = typeof cell[column.name] === 'object';
                    cellValue = ( cellIsObject ) ? cell[column.name].value : cell[column.name];
                    cssClass = column.name;
                    
                    if (j == 0 && k === 'processtitle' || k === 'objectivetitle') {
                        if (k === 'objectivetitle') {
                            isObjective = true;
                        }
                        titles.push(cellValue);
                        cellValue = "";                        
                    }

                    if (j == 0 && k == 'processtitle') {
                        cellValue = cellValue + " <a class='pull-right ptdash' href='/report?processId=" + encodeURIComponent(processId) + 
                                                "&type=" + _options.type + "' title='View Dashboard'><i class='icon-bar-chart'></i></a>";
                    }

                    if ( j >= 1 && k == 'processtitle' || j >= 1 && k == 'objectivetitle') {
                        cssClass += " ht ";
                        cellValue = "";
                    }
                    
                    if ( j >= 1 ) {
                        cssClass += " noBorderTop";
                    }
                    
                    if ( j == 0 && k === 'kpimeasure' && Utils.isset(cell['kpi_measure_caption'])) {
                        
                        nr = "<tr class='row noBorderBottom'>";
                        
                        for (var cl = 0; cl < Utils.sizeOf(columns) + 1; cl++) {
                            
                            var cls = (cl === 0) ? 'objectivetitle noBorderBottom' : 'noBorderBottom';
                            var style = (sizes[cl]) ? "style='width: " + sizes[cl] + "%;'" : "10%";
                            
                            nr += "<td " + style + " class='" + cls + "'>"
                            
                            if (cl == 1) {
                                nr += cell['kpi_measure_caption'];
                            }
                            
                            nr += "</td>";
                        }
                        
                        nr += "</tr>";
                        table.prepend(nr);
                        
                    }
                    
                    tc = Template.col()
                        .html( 
                            ( 
                                k === 'kpimeasure' ? 
                                "<span style='margin-right: 5px;' class='kpimeasuretype'>" + 
                                cell['kpimeasuretype'] + " </span>" : "" 
                            ) +  cellValue
                        )
                        .addClass( cssClass )
                        .css({'width': column.sizeX + unit});
                            
                    if ( k === 'kpiinstancevalue' ) {
                        tc.append( self.createKpiInstanceButton() );
                    }
                    
                    tableRow.append( 
                        tc                              
                    );

                    table.append( tableRow );
                }

                tableRow.append(
                    Template.col()
                        .append( 
                            Template.toolbox( options, cell, add ) )
                                .css({'width': '10%'})
                                .addClass( 'noBorderTop' )
                        );                      
                
                rowContainer.append( table );

                
            }

            rows.push(rowContainer);
        }
        
        self.buildTitles(titles, rows, isObjective);
        return rows;
    };
    
    grid.buildTitles = function(titles, rows, isObjective) {

        var div = $("<div></div>").addClass('tableTitle'),
        table,
        tableHeight,
        cellWidth = (isObjective) ? "7%" : "13%",
        top = (isObjective) ? 0 : "10px",
        left = "5px",
        pos,
        el,
        css = {
            'position': 'absolute',
            left: left,
            top: top,            
            width: cellWidth
        };

        $.each(rows, function(k, v) {
            table = $(v).find('table');
            tableHeight = table.height();
            el = div.clone(true)
                .addClass(k)
                .text(titles[k])
                .css(css);

            table.find("tr:eq(0) > td:eq(0)").append(el);            
        });
    };

    /**
    * Helper to create KPI Instance button
    *
    * @return {DOM} html
    * @api Public
    */
    grid.createKpiInstanceButton = function() {

        var button = $("<span class='pull-right btnAddInstanceValue'><i class='icon-plus'></i></span>")
            .on('click', function( e ) {
                
                var target = $(e.target),
                cell = target.parent('td'),
                parent = target.closest('tr'),
                data = parent.data('__row__data__'),
                frequency = data['kpifrequency'];
                
                if ( frequency === '' ) {
                    alert("Frequency is not specified. Can't enter value");
                    return false;
                }
                
                // Show kpi instance modal modal
                var dialog = Template.frequencyModal( "Add KPI Current Value", frequency, true );
                dialog.data('__data__', data);
                
                $('body').append(dialog);
                dialog.modal('show');
                dialog.data('parent_el', parent);
                dialog.on('hidden', function(e) {
                    $(e.target).remove();
                });
            });

        return button;  
    };

    /**
    * Create row html
    *
    * @param {Object} data array of data for rows to be printed on the screen
    * @param {Object} list of columns
    * @param {DataGrid} instance of grid plugin
    * @return {DOM} html
    * @api Public
    */
    grid.createRow = function ( data, columns, self, add, rowCount ) {
        
        var tableRow = Template.row().addClass( 'row' ).data( '__row__data__', data ),
        i = 0,
        cellIsObject,
        column,
        cssClass = "noBorderTop",
        unit = self.getUnit(),
        cellValue,
        options = self.getOptions(),
        processId = data.process__id;
        
        columns = columns[0];
        
        add = (!add) ? false : true;

        for ( i in columns ) {
            
            column = columns[i];
            cellIsObject = Utils.isObject(data[column.name]);
            cellValue = ( column.name === 'kpimeasure' ) ? "<span class='kpimeasure'>" 
                            + data['kpimeasuretype'] + " </span>" + data[column.name] : data[column.name];
            if (rowCount == 0 && column.name === 'processtitle') {
                cellValue = cellValue + " <a class='pull-right ptdash' href='/report?processId=" + encodeURIComponent(processId) + 
                            "&type=" + options.type + "' title='View Dashboard'><i class='icon-bar-chart'></i></a>";
            }

            //if (rowCount > 0 && column.name === 'processtitle') {
            if (column.name === 'processtitle' || column.name === 'objectivetitle') {
                cellValue = "";
            }

            tableRow.append( 
                Template.col()
                    .html( (column.name === 'kpiinstancevalue') ? self.createKpiInstanceButton() : cellValue )
                    .addClass( cssClass + " " + column.name )
                    .css({'width': column.sizeX + unit})                                
            );
        
        }
        
        tableRow.append(
            Template.col()
                .append(Template.toolbox( options, data, add ) ).addClass('noBorderTop')
                .css({'width': '10%'})
        );
        
        if ( rowCount >= 0 ) {
            tableRow.attr('id', rowCount);
        }

        return tableRow;
    };
    
    
    // jQuery adapter to call the plugin
    $.fn.bsGrid = function( options ) {
        return new DataGrid ( this, options );
    };
    
})(jQuery, window);

function nFormatter(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2) + 'G';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return num;
}
function checkDollar(){
    $('.kpimeasure').each(function(){
        //$(this+":contains('<span>')")
    });
}

function disableAll(el) {
   var form = $(el).closest('.modal-body');

   if($('#kpimeasuretype').val() == 'Nil') {
       form.find('select[name!=kpimeasuretype]').attr("disabled", true);
       form.find('input[type=text]').attr("disabled", true);
   } else {
       form.find('select[name!=kpimeasuretype]').removeAttr("disabled");
       form.find('input[type=text]').removeAttr("disabled");
   }

}
