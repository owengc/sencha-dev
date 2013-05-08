/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src',
    'MyApp': 'app'
});
//</debug>

Ext.define('Standard', {
    extend: 'Ext.data.Model',
    config: {
	fields: [
	    {name: 'standardId', type: 'int'},
	    {name: 'standardDesc', type: 'string'},
	    {name: 'num', type: 'int'}
	],
	hasMany: {
	    model: 'Region',
	    name: 'regions'
	}
    }
});

Ext.define('Region', {
    extend: 'Ext.data.Model',
    config: {
	fields: [
	    {name: 'regionId', type: 'int'},
	    {name: 'regionStart', type: 'int'},
	    {name: 'regionEnd', type: 'int'},
	    {name: 'regionDuration', type: 'int'}
	],
	belongsTo: {
	    model: 'Standard',
	    name: 'standard'
	}
    }
});

var chart, rangeSelector;

Ext.application({
    name: 'MyApp',
    
    requires: [
	'Ext.draw.Component',
	'Ext.MessageBox',
	'Ext.TabPanel',
	'Ext.dataview.NestedList',
	'Ext.data.proxy.JsonP',
	'Ext.form.FieldSet',
	'Ext.form.Panel',
	'Ext.field.Number',
	'Ext.field.Slider',
	'Ext.data.Store',
	'Ext.chart.Chart',
	'Ext.chart.axis.Category',
	'Ext.chart.axis.Numeric',
	'Ext.chart.series.Scatter',
	'Ext.SegmentedButton',
	'Ext.Array',
	'Ext.util.Region',
	'Ext.util.Point'
    ],
    
    views: [
        'Main'
    ],
    
    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },
    
    isIconPrecomposed: true,
    
    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
	'768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function(){
	console.log('launch');
	// Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
	
	
	var regionStore = Ext.create('Ext.data.Store', {
	    model: 'Standard',
	    data: [
		{
		    id: 0,
		    desc: 'Multiplication',
		    num: 7,
		    regions: [
			{id: 0, start: 4, end: 28, duration: 24},
			{id: 1, start: 56, end: 85, duration: 29}
		    ]
		}
	    ]
	});
	
	
	var buttons = [];
	var i;
	for(i=0;i<20;i++){
	    var button = Ext.create('Ext.Button', {
		index: i,
		text: '&nbsp;',
		width: '5%',
		area: {},
		pressed: false,
		listeners: {
		    element: 'element',
		    resize: function(){
			this.area = Ext.util.Region.getRegion(this.element);
			console.log('button regions recorded');
		    }
		}
	    }); 
	    buttons.push(button);
	}
	rangeSelector = Ext.create('Ext.SegmentedButton', {
	    id: 'rangeSelector',
	    name: 'rangeSelector',
	    allowMultiple: true,
	    layout: {
		type: 'hbox',
		pack: 'center',
		align: 'stretchmax'
	    },
	    items: buttons,
	    state: {
		touchInProgress: false,
		lastTouched: null
	    },
	    getPressedIndices: function(){
		var pressedButtons = this.getPressedButtons();
		var i=0, count=pressedButtons.length, pressedIndices = [];
		for(;i<count;i++){
		    pressedIndices.push(pressedButtons[i].index);
		}
		return pressedIndices;
	    },
	    toggleButtonByIndex: function(index){
		var button = this.getItems().items[index],
		pressedIndicesOld = this.getPressedIndices(),
		pressedIndicesNew=[];
		var wasPressed = this.isPressed(button);
		if(wasPressed){
		    var i=0, count=pressedIndicesOld.length;
		    for(;i<count;i++){
			if(pressedIndicesOld[i]!=index){
			    pressedIndicesNew.push(pressedIndicesOld[i]);
			}
		    }
		}
		else{
		    pressedIndicesNew = pressedIndicesOld.push(index);
		}
		this.setPressedButtons(pressedIndicesNew);
	    },
	    listeners: {
		element: 'element',
		touchstart: function(e){
		    var buttons = this.getItems().items,
		    i=0,
		    count = buttons.length,
		    button;
		    for(;i<count;i++){
			if(!buttons[i].area.isOutOfBoundX(e.pageX)){
			    button = buttons[i];
			    this.state.touchInProgress = true;
			    this.state.lastTouched = button.index;
			    this.toggleButtonByIndex(button.index);
			    console.log('touchstart over button ' + button.index);
			}
		    }
		},
		touchmove: function(e){
		    //console.log('touch held at position '+e.pageX + ", "+e.pageY);
		    var buttons = this.getItems().items,
		    i=0,
		    count = buttons.length,
		    button;
		    for(;i<count;i++){
			if(!buttons[i].area.isOutOfBoundX(e.pageX)){
			    button = buttons[i];
			    
			    if(this.state.lastTouched!=button.index){
				this.toggleButtonByIndex(button.index);
				this.state.lastTouched=button.index;
				console.log('touchmove over button ' + button.index);
			    }
			}
		    }
		    
		},
		touchend: function(e){
		    var buttons = this.getItems().items,
		    i=0,
		    count = buttons.length,
		    button;
		    for(;i<count;i++){
			if(!buttons[i].area.isOutOfBoundX(e.pageX)){
			    button = buttons[i];
			    this.state.touchInProgress = false;
			    this.toggleButtonByIndex(button.index);
			    console.log('touchend over button ' + button.index);
			}
		    }
		    return false;
		}
	    }
	});
		

        // INITIALIZE THE MAIN VIEW
        Ext.create("Ext.TabPanel", {
	    fullscreen: true,
	    tabBarPosition: 'bottom',
	    
	    items: [
		{
		    title: 'Log',
		    iconCls: 'user',
		    xtype: 'formpanel',
		    url: 'contact.php',
		    layout: {
			type: 'vbox',
			align: 'stretch'
		    },
		    
		    items: [
			{
			    xtype: 'fieldset',
			    title: 'Lesson Breakdown',
			    instructions: 'enter length of lesson and then specify regions',
			    items: [
				{
				    xtype: 'numberfield',
				    name: 'time',
				    label: 'Lesson time',
				    minValue: 5,
				    maxValue: 120,
				    stepValue: 5,
				    listeners: {
					change: function(){
					    var v = this.getValue();
					    var slider = Ext.getCmp('durationSlider').getComponent();
					    slider.setMaxValue(v);
					    console.log(slider.getMaxValue());
					}
				    }
				},
				{
				    xtype: 'slider',
				    name: 'durationSlider',
				    id: 'durationSlider',
				    label: 'Durations',
				    minValue: 0,
				    maxValue: 120,
				    increment: 5,
				    clickToChange: false,
				    listeners: {
					change: function (){
					    Ext.getCmp('debug').setValue(this.getValues());
					}
				    }
				},
				{
				    xtype: 'textfield',
				    id: 'debug',
				    label: 'value(s)',
				    readOnly: true
				},
				{
				    xtype: 'container',
				    padding: 10,
				    items: [rangeSelector]
				}
			    ]
			},
			{
			    xtype: 'button',
			    text: 'Send',
			    ui: 'confirm',
			    handler: function(){
				this.up('formpanel').submit();
			    }
			}
		    ]
		}
	    ]
	});

//	Ext.Viewport.add(chart);
    },
    
    onUpdated: function(){
	console.log('updated');
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    onReady: function(){
	console.log('ready');
    }
});


