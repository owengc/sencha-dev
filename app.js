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
	'Ext.MessageBox',
	'Ext.TabPanel',
	'Ext.data.proxy.JsonP',
	'Ext.form.FieldSet',
	'Ext.form.Panel',
	'Ext.field.Number',
	'Ext.data.Store',
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
			{id: 0, start: 0, end: 4, percentage: 25},
			{id: 1, start: 11, end: 18, percentage: 35}
		    ]
		}
	    ]
	});
	
	var buttons = [];
	for(var i=0;i<20;i++){
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
			//console.log('button regions recorded');
			//console.log(this.area.toString());
		    }
		}
	    });
	    buttons.push(button);
	}

	var regions = [
	    {id: 0, start: 0, end: 4, percentage: 25},
	    {id: 1, start: 11, end: 18, percentage: 40}
	];


	rangeSelector = Ext.create('Ext.SegmentedButton', {
	    id: 'rangeSelector',
	    name: 'rangeSelector',
	    cls: 'o-rangeselector',
	    allowMultiple: true,
	    layout: {
		type: 'hbox',
		pack: 'center',
		align: 'stretchmax'
	    },
	    area: {},
	    items: buttons,
	    state: {},
	    regions: regions,
	    total: 0,
	    getButtonByTouch: function(pageX){
		var buttons = this.getItems().items,
		i=0,
		buttonCount = buttons.length,
		button;
		for(;i<buttonCount;i++){
		    if(!buttons[i].area.isOutOfBoundX(pageX)){
			button = buttons[i];
			break;
		    }   
		}
		if(!button){
		    if(this.area.isOutOfBoundX(pageX)){
			if(this.area.getOutOfBoundOffsetX(pageX)>0){
			    button = buttons[0];
			}
			else{
			    button = buttons[count-1];
			}
			//console.log(this.area.getOutOfBoundOffsetX(pageX));
		    }
		}
		return button;
	    },
	    getPressedIndices: function(){
		var pressedButtons = this.getPressedButtons();
		var i=0, pressedButtonCount=pressedButtons.length, pressedIndices = [];
		for(;i<pressedButtonCount;i++){
		    pressedIndices.push(pressedButtons[i].index);
		}
		return pressedIndices;
	    },
	    toggleButtonByIndex: function(index){
		var button = this.getItems().items[index],
		pressedIndicesOld = this.getPressedIndices(),
		pressedIndicesNew=[];
		var wasPressed = this.isPressed(button);
		//console.log('wasPressed: '+wasPressed);
		if(wasPressed){
		    //console.log('pressedIndicesOld: '+pressedIndicesOld.toString());
		    var i=0, pressedButtonCountOld=pressedIndicesOld.length;
		    for(;i<pressedButtonCountOld;i++){
			if(pressedIndicesOld[i]!=index){
			    pressedIndicesNew.push(pressedIndicesOld[i]);
			}
		    }
		}
		else{
		    pressedIndicesNew = pressedIndicesOld;
		    pressedIndicesNew.push(index);
		}
		//console.log('pressedIndicesNew: '+pressedIndicesNew.toString());
		this.setPressedButtons(pressedIndicesNew);
		//console.log('toggled by index: '+index);
		//console.log('selected: '+this.getPressedIndices().toString());
	    },/*
	    getRegionByButtonIndex: function(index){
		var button = this.getItems().items[index],
		i=0,
		regionCount = this.regions.count,
		region={
		    id: regionCount,
		    start: index,
		    end: index,
		    percentage: 5
		};
		for(;i<regionCount;i++){
		    if(index>=this.regions[i].start || index<=this.regions[i].end){
			console.log('region found: start='+this.regions[i].start+', end='+this.regions[i].end);
			return this.regions[i];
		    }
		}
		console.log('new region: start='+region.start+', end='+region.end);
		return region;
	    },*/
	    initializeRegions: function(){
		var i=0,
		regionCount=this.regions.length,
		initialPressedIndices=[],
		j=0;
		for(;i<regionCount;i++){
		    for(j=this.regions[i].start;j<=this.regions[i].end;j++){
			initialPressedIndices.push(j);
		    }
		    this.total+=this.regions[i].percentage;
		}
		this.setPressedButtons(initialPressedIndices);
		//console.log(this.total);
		
	    },
	    recordRegions: function(){
		var buttons = this.getItems().items,
		i=0,
		buttonCount=buttons.length,
		tempRegions=[],
		tempRegion=null;
		this.total=0;
		for(;i<buttonCount;i++){
		    if(this.isPressed(buttons[i])){
			if(tempRegion){
			    tempRegion.end=i;
			    if(i==(buttonCount-1)){
				tempRegion.percentage=((tempRegion.end-tempRegion.start+1)/buttonCount)*100;
				this.total+=tempRegion.percentage;
				tempRegions.push(tempRegion);
				tempRegion=null
			    }
			}
			else{
			    tempRegion=new Object();
			    tempRegion.id=tempRegions.length;
			    tempRegion.start=i;
			    tempRegion.end=i;
			}
		    }
		    else{
			if(tempRegion){
			    tempRegion.percentage=((tempRegion.end-tempRegion.start+1)/buttonCount)*100;
			    this.total+=tempRegion.percentage;
			    tempRegions.push(tempRegion);
			    tempRegion=null;
			}
		    }
		}
		this.regions=tempRegions;
		this.displayTotal();
		//console.log('regions: '+this.regions.toString())
		//console.log(this.total);
	    },
	    displayTotal: function(){
		Ext.getCmp('rangeSelectorTotal').setValue(this.total+'%');
	    },
	    listeners: {
		element: 'element',
		touchstart: function(e){
		    var button = this.getButtonByTouch(e.pageX);
		    
		    this.state.inProgress = true;
		    this.state.touched = button.index;
		    this.state.lastTouched = null;
		
		    this.toggleButtonByIndex(button.index);
		    //console.log('touchstart over button ' + button.index);
		    //console.log('touchstart: '+this.getPressedIndices().toString());
		    //return false;
		},
		touchmove: function(e){
		    var button = this.getButtonByTouch(e.pageX);

		    if(this.state.touched!=button.index){	
			this.state.lastTouched=this.state.touched
			this.state.touched=button.index;
		
			this.toggleButtonByIndex(this.state.touched);
			//console.log('touchmove over button ' + button.index);	
			//console.log('touchmove: '+this.getPressedIndices().toString());
		    }
		    //return false;
		},
		touchend: function(e){
		    var button = this.getButtonByTouch(e.pageX);
		    
		    this.state.touchInProgress = false;
		    this.state.touched = null;
		    this.state.lastTouched = null;
		    
		    this.recordRegions();
		    
		    //console.log('touchend over button ' + button.index);
		    //console.log('touchend: '+this.getPressedIndices().toString());
		    //return false;
		},
		tap: function(e){
		    var button = this.getButtonByTouch(e.pageX);

		    this.toggleButtonByIndex(button.index);
		    //console.log('tap on button '+button.index);
		    //console.log('tap: '+this.getPressedIndices().toString());
		    //return false;
		},
		longpress: function(e){
		    //console.log('longpress: ');
		},
		pinch: function(e){
		    //console.log(e.touches[0].pageX, e.touches[1].pageX);
		},
		resize: function(){
		    this.area = Ext.util.Region.getRegion(this.element);
		    //console.log('container region recorded');
		    //console.log(this.area.toString());
		}
	    }
	});
	rangeSelector.initializeRegions();
		

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
				/*{
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
				},*/
				{
				    xtype: 'container',
				    padding: 10,
				    items: [rangeSelector]
				},
				{
				    xtype: 'textfield',
				    id: 'rangeSelectorTotal',
				    label: 'total',
				    readOnly: true
				}
			    ]
			},
			{
			    xtype: 'button',
			    text: 'Send',
			    ui: 'confirm',
			    handler: function(){
				var rangeSelector=Ext.getCmp('rangeSelector'),
				regionString="",
				i=0,
				regionCount = rangeSelector.regions.length,
				region;
				for(;i<regionCount;i++){
				    region=rangeSelector.regions[i];
				    regionString+=(
					'Region '+region.id+': '+'['+region.start+', '+region.end+'] ('+region.percentage+'%)<br/>'
				    );
				}
				regionString+=('Total duration: '+rangeSelector.total+'%');
				Ext.Msg.alert(
				    'Regions:',
				    regionString,
				    Ext.emptyFn
				);
				//this.up('formpanel').submit();
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


