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

/*Ext.define('Standard', {
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
});*/

/*Ext.define('iPad2.view.component.RegionSelectorButton', {
    extend: 'Ext.Button',
    xtype: 'rangeselectorbutton',
    requires: [
	'Ext.Button',
	'Ext.util.Region'
    ],
    config: {
	index: null,
	text: '&nbsp;',
	width: '5%',
	area: {},
	pressed: false,
	listeners: {
	    element: 'element',
	    resize: function(){
		this.setArea(Ext.util.Region.getRegion(this.element));
		//console.log('button regions recorded');
		//console.log(buttonContext.area.toString());
	    }
	}
    }
});*/

Ext.define('iPad2.view.component.RangeSelector', {
    extend: 'Ext.SegmentedButton',
    alias: 'widget.rangeselector',
    xtype: 'rangeselector',
    requires: [
	'Ext.Button',
	'Ext.util.Region'
    ],
    config: {
	layout: {
	    type: 'hbox',
	    pack: 'center',
	    align: 'stretchmax'
	},
	cls: 'o-rangeselector',
	allowMultiple: true,
	increment: 5,
	area: {},
	items: [],
	state: {
	    touchInProgress: false,
	    touched: null,
	    lastTouched: null,
	    direction: null,
	    lastDirection: null,
	    reversed: false
	},
	regions: [],
	total: 0,
	listeners: {
	    element: 'element',
	    touchstart: function(e){
		var button=this.getButtonByTouch(e.pageX),
		state=this.getState();
		state.position=e.pageX

		if(button){
		    state.touchInProgress=true;
		    state.touched=button.index;
		    state.lastTouched=null;
		    state.direction=null;
		    state.lastDirection=null;
		    state.reversed=false;

		    this.toggleButtonByIndex(state.touched);
		    //console.log('touchstart over button ' + button.index);
		    //console.log('touchstart: '+this.getPressedIndices().toString());
		}
	    },
	    touchmove: function(e){
		var button=this.getButtonByTouch(e.pageX),
		state=this.getState();
		
		if(button && state.touchInProgress && state.touched!=button.index){    

		    state.lastTouched=state.touched
		    state.touched=button.index;
		    
		    state.lastDirection=state.direction;
		    state.direction=(state.lastTouched<state.touched)?'right':'left';

		    state.reversed=(state.lastDirection!=null && state.direction!=state.lastDirection)?true:false;
		    
		    var lastButton=this.getButtonByIndex(state.lastTouched);

		    /*this block helps deal with buggy/missing touchmove events*/
		    if(Math.abs(state.touched-state.lastTouched)>1){
			var gapStart=(state.direction=='right')?state.lastTouched+1:state.touched+1,
			gapEnd=(state.direction=='right')?state.touched-1:state.lastTouched-1,
			i=gapStart;
			for(;i<=gapEnd;i++){
			    if(this.isPressed(lastButton)){
				this.activateButtonByIndex(i);
			    }
			    else{
				this.deactivateButtonByIndex(i);
			    }
			    //console.log('skipped button '+ i);
			}
		    }
		    
		    if(!state.reversed){
			if(this.isPressed(lastButton)==this.isPressed(button)){
			    state.touchInProgress=false;
			}
			else{
			    this.toggleButtonByIndex(state.touched);
			    this.recordTotal();
			    //console.log('touchmove over button ' + button.index + '|pageX: ' + e.pageX + ', pageY: ' + e.pageY);
			}
		    }
		    else{
			//console.log('reversed|last=' + state.lastTouched + 'current=' + state.touched);
			this.toggleButtonByIndex(state.lastTouched);
			this.toggleButtonByIndex(state.touched);
			this.recordTotal();
			//console.log('touchmove over button ' + button.index + '|pageX: ' + e.pageX + ', pageY: ' + e.pageY);
		    }	
		    //console.log('touchmove over button ' + button.index);	
		    //console.log('touchmove: '+this.getPressedIndices().toString());
		}
		    
	    },
	    touchend: function(e){
		var button=this.getButtonByTouch(e.pageX),
		state=this.getState();
		
		state.touchInProgress=false;
		state.touched=null;
		state.lastTouched=null;
		state.direction=null,
		state.lastDirection=null,
		state.reverse=false;
		
		this.recordRegions();
		//console.log('touchend over button ' + button.index);
		//console.log('touchend: '+this.getPressedIndices().toString());
	    },
	    tap: function(e){
		var button=this.getButtonByTouch(e.pageX);

		if(button){
		    this.toggleButtonByIndex(button.index);
		    //console.log('tap on button '+button.index);
		    //console.log('tap: '+this.getPressedIndices().toString());
		}
	    },
	    longpress: function(e){
		//console.log('longpress: ');
	    },
	    pinch: function(e){
		//console.log(e.touches[0].pageX, e.touches[1].pageX);
	    },
	    resize: {
		buffer: 100,
		fn: function(){
		    //console.log('selector resized', this.element.dom.scrollWidth);
		    this.setArea(Ext.util.Region.getRegion(this.element));
		    //console.log('container region recorded');
		    //console.log(this.area.toString());
		}
	    }
	}
    },
 
    constructor: function(config) {
	this.callParent(config);
	this.setRegions(config.regions || []);


	var increment=this.getIncrement(),
	numButtons=(100/increment),
	i=0;

	for(;i<numButtons;i++){
	    var button=Ext.create('Ext.Button', {
		index: i,
		text: '&nbsp;',
		width: increment+'%',
		area: {},
		pressed: false,
		listeners: {
		    element: 'element',
		    resize: function(){
			var buttonContext=this;
			buttonContext.area=Ext.util.Region.getRegion(this.element);
		
			/*if(buttonContext.index==0){
			    console.log('leftmost button position: ', buttonContext.area.)*/
			//console.log('button regions recorded');
			//console.log(buttonContext.area.toString());
		    }
		}
	    });
	    this.add(button);
	}
	this.initializeRegions();
	//console.log(this.getItems().items);
    },
    
    getButtonByTouch: function(pageX){
	var buttons=this.getItems().items,
	buttonCount=buttons.length,
	button,
	rangeSelectorArea=this.getArea(),
	i=0;

	for(;i<buttonCount;i++){
	    if(!buttons[i].area.isOutOfBoundX(pageX)){
		button=buttons[i];
		break;
	    }   
	}
	if(!button){
	    if(rangeSelectorArea.isOutOfBoundX(pageX)){
		if(rangeSelectorArea.getOutOfBoundOffsetX(pageX)>0){
		    button=buttons[0];
		}
		else{
		    button=buttons[buttonCount-1];
		}
		//console.log(rangeSelectorArea.getOutOfBoundOffsetX(pageX));
	    }
	}
	return button;
    },
    getButtonByIndex: function(index){
	return this.getAt(index);
    },
    getPressedIndices: function(){
	var pressedButtons=this.getPressedButtons(),
	pressedButtonCount=pressedButtons.length, 
	pressedIndices=[],
	i=0;

	for(;i<pressedButtonCount;i++){
	    pressedIndices.push(pressedButtons[i].index);
	}
	return pressedIndices;
    },
    toggleButtonByIndex: function(index){
	var button=this.getItems().items[index],
	pressedIndicesOld=this.getPressedIndices(),
	pressedIndicesNew=[],
	wasPressed=this.isPressed(button);

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
	    pressedIndicesNew=pressedIndicesOld;
	    pressedIndicesNew.push(index);
	}
	//console.log('pressedIndicesNew: '+pressedIndicesNew.toString());
	this.setPressedButtons(pressedIndicesNew);
	//console.log('toggled by index: '+index);
	//console.log('selected: '+this.getPressedIndices().toString());
    },
    activateButtonByIndex: function(index){
	var button=this.getItems().items[index],
	pressedIndicesOld=this.getPressedIndices(),
	pressedIndicesNew=[],
	wasPressed=this.isPressed(button);

	if(wasPressed){
	    return;
	}
	else{
	    pressedIndicesNew=pressedIndicesOld;
	    pressedIndicesNew.push(index);
	}
	//console.log('pressedIndicesNew: '+pressedIndicesNew.toString());
	this.setPressedButtons(pressedIndicesNew);
	//console.log('toggled by index: '+index);
	//console.log('selected: '+this.getPressedIndices().toString());
    },
    deactivateButtonByIndex: function(index){
	var button=this.getItems().items[index],
	pressedIndicesOld=this.getPressedIndices(),
	pressedIndicesNew=[],
	wasPressed=this.isPressed(button);

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
	    return;
	}
	//console.log('pressedIndicesNew: '+pressedIndicesNew.toString());
	this.setPressedButtons(pressedIndicesNew);
	//console.log('toggled by index: '+index);
	//console.log('selected: '+this.getPressedIndices().toString());
    },/*
	getRegionByButtonIndex: function(index){
	var button=this.getItems().items[index],
	i=0,
	regionCount=this.regions.count,
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
	var regions=this.getRegions(),
	regionCount=regions.length,
	initialPressedIndices=[],
	i=0,
	j=0,
	total=0;

	for(;i<regionCount;i++){
	    for(j=regions[i].start;j<=regions[i].end;j++){
		initialPressedIndices.push(j);
	    }
	    total+=regions[i].percentage;
	}
	this.setPressedButtons(initialPressedIndices);
	this.setTotal(total);
	//console.log(this.getTotal());	
    },
    recordRegions: function(){
	var buttons=this.getItems().items,
	buttonCount=buttons.length,
	tempRegions=[],
	tempRegion=null,
	i=0,
	total=0;

	for(;i<buttonCount;i++){
	    if(this.isPressed(buttons[i])){
		if(tempRegion){
		    tempRegion.end=i;
		    if(i==(buttonCount-1)){//edge-case solution.
			tempRegion.percentage=((tempRegion.end-tempRegion.start+1)/buttonCount)*100;
			total+=tempRegion.percentage;
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
		    total+=tempRegion.percentage;
		    tempRegions.push(tempRegion);
		    tempRegion=null;
		}
	    }
	}
	this.setRegions(tempRegions);
	this.setTotal(total);
	this.displayTotal();
	//console.log('regions: '+this.regions.toString())
	//console.log(this.total);
    },
    recordTotal: function(){
	var buttons=this.getItems().items,
	buttonCount=buttons.length,
	increment=this.getIncrement(),
	i=0,
	total=0;

	for(;i<buttonCount;i++){
	    if(this.isPressed(buttons[i])){
		total+=increment;
	    }
	}
	this.setTotal(total);
	this.displayTotal();
    },
    displayTotal: function(){
	this.up().down('textfield').setValue(Math.round(this.getTotal())+'%');
    }
});



Ext.application({
    name: 'MyApp',
    
    requires: [
	'Ext.MessageBox',
	'Ext.TabPanel',
	'Ext.form.FieldSet',
	'Ext.form.Panel',
	'Ext.field.Number',
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
	

	var rangeSelector=Ext.create('iPad2.view.component.RangeSelector', {
	    id: 'rangeSelector0',
	    regions: [
		{id: 0, start: 5, end: 14, percentage: 50}
	    ]
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
		    url: '#',
		    layout: {
			type: 'vbox',
			align: 'stretch'
		    },
		    
		    items: [
			{
			    xtype: 'fieldset',
			    title: 'Slider Demo',
			    instructions: 'specify regions',
			    items: [
				{
				    xtype: 'container',
				    padding: 10,
				    items: [
					{
					    xtype: 'container',
					    items: [
						rangeSelector,
						{
						    xtype: 'textfield',
						    id: 'rangeSelectorTotal0',
						    label: 'Total:',
						    readOnly: true
						}
					    ]
					},
					{
					    xtype: 'container',   
					    items: [
						{
						    xtype: 'rangeselector',
						    id: 'rangeSelector1',
						    regions: [
							{id: 0, start: 0, end: 4, percentage: 25},
							{id: 1, start: 11, end: 18, percentage: 40}
						    ]
						},
						{
						    xtype: 'textfield',
						    id: 'rangeSelectorTotal1',
						    label: 'Total:',
						    readOnly: true
						}
					    ]
					}
				    ]
				}/*,
				{
				    xtype: 'button',
				    text: 'Send',
				    ui: 'confirm',
				    handler: function(){
					var rangeSelector=Ext.getCmp('rangeSelector'),
					regionString="",
					i=0,
					regionCount=rangeSelector.regions.length,
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
				}*/
			    ]
			}
		    ]
		}
	    ],
	

	    
	
	    
	    
	    onUpdated: function(){
		console.log('updated');
		Ext.Msg.confirm(
		"Application Update",
		    "This application has just successfully been updated to the latest version. Reload now?",
		    function(buttonId) {
			if (buttonId==='yes') {
			    window.location.reload();
			}
		    }
		);
	    },
	    
	    onReady: function(){
		console.log('ready');
	    }
	});
    }
});

	
	
