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


/*
  The RangeSelector class allows the user to specify regions of activity in a
  timeline representing the total duration of a given lesson. One RangeSelector
  is created for each Standard chosen in the log. When more than one Standard is
  chosen, they will appear stacked above one another, allowing the user to 
  visualize and indicate the overlap of multiple Standards during the lesson 
  period. The granularity of the RangeSelector (that is, the number of buttons
  comprising it), is set by the 'increment' property, which represents the %
  added to the total each time a button is pressed. Thus, the default increment 
  of 5 results in splitting the timeline into 20 buttons, each button representing 
  5% of the total.
*/
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
	cls: 'o-rangeselector',//Important for CSS styling
	allowMultiple: true,//Do not change
	increment: 5,//This determines the granularity (number of buttons) of the RangeSelector. For example, default value of 5 results in 20 buttons, each worth 5% of total
	area: {},//This stores the Ext.util.Region associated with the area of the screen the RangeSelector occupies when drawn in the browser 
	items: [],//This stores the buttons
	state: { //This stores state variables used by the touchstart, touchmove, and touchend event handlers
	    touchInProgress: false, //Set to true while the user's finger remains on the screen after touching the RangeSelector, false otherwise
	    touched: null, //Set to the button currently targeted by the touch
	    lastTouched: null, //Set to the button previously targeted by the touch
	    direction: null, //Set to the direction the touch is currently heading ('right' or 'left')
	    lastDirection: null, //Set to the direction the touch was previously heading ('right' or 'left')
	    reversed: false //Set to true when direction!=lastDirection, false otherwise
	},
	regions: '',//This stores the region data, each button is represented by either a 0 or 1 in the string
	total: 0,//This stores the total % currently indicated on the slider
	totalPercentCmp: '',//This stores the itemId of the component used to display the total % (established via config when RangeSelector is instantiated)
	totalMinutesCmp: '',//This stores the itemId of the component used to display the total minutes (established via config when RangeSelector is instantiated)
	durationCmp: '',//This stores the itemId of the component used to enter the lesson duration time in minutes (elsewhere in log page)
	listeners: {
	    /*
	      touchstart - This function establishes the location of the touch, locates the button associated with that location, initializes the state
	      variables for this touch, and toggles the target button if found. Note that buttons are looked up by the pageX value of the touch event
	     */
	    touchstart: {
		element: 'element',//Important - SegmentedButton doesn't normally support this event, so it must be set to listen on the DOM element instead
		fn: function(e){
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
		}
	    },
	    /*
	      touchmove - This function locates the button associated with the current touch location, updates the state
	      variables for this touch, and toggles the target button if found. There is additional logic to handle changes
	      in direction of the touch and to deal with problems stemming from events not firing during rapid changes in
	      touch position, which used to result in gaps as the user quickly moved his/her finger across the RangeSelector.
	      Note that buttons are looked up by the pageX value of the touch event.
	     */
	    touchmove: {
		element: 'element',//Important - SegmentedButton doesn't normally support this event, so it must be set to listen on the DOM element instead
		fn: function(e){
		    var button=this.getButtonByTouch(e.pageX),
		    state=this.getState();
		    
		    if(button && state.touchInProgress && state.touched!=button.index){//Confirms that the touch has moved over a new button
			//Update state variables
			state.lastTouched=state.touched
			state.touched=button.index;
			
			state.lastDirection=state.direction;
			state.direction=(state.lastTouched<state.touched)?'right':'left';

			state.reversed=(state.lastDirection!=null && state.direction!=state.lastDirection)?true:false;
			
			var lastButton=this.getButtonByIndex(state.lastTouched);

			/*this block helps deal with buggy/missing touchmove events*/
			if(Math.abs(state.touched-state.lastTouched)>1){//A gap is present any time the 
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
				state.touchInProgress=false;//If the current touch is activating buttons the touch will be terminated upon encountered another region of activated buttons and vice versa
			    }
			    else{
				this.toggleButtonByIndex(state.touched);
				this.recordTotal();//Update and display the new total
				//console.log('touchmove over button ' + button.index + '|pageX: ' + e.pageX + ', pageY: ' + e.pageY);
			    }
			}
			else{//If the direction is reversed, the previously touched button must be toggled back to it's previous state (reversal undoes the action)
			    this.toggleButtonByIndex(state.lastTouched);
			    this.toggleButtonByIndex(state.touched);
			    this.recordTotal();//Update and display the new total
			    //console.log('touchmove over button ' + button.index + '|pageX: ' + e.pageX + ', pageY: ' + e.pageY);
			}	
			//console.log('touchmove over button ' + button.index);	
			//console.log('touchmove: '+this.getPressedIndices().toString());
		    }
		}
	    },
	    /*
	      touchend - This function resets the state variables to their default values at the end of a touch interaction
	      and then updates the region information to reflect the new state of the RangeSelector. 
	     */
	    touchend: {
		element: 'element',//Important - SegmentedButton doesn't normally support this event, so it must be set to listen on the DOM element instead
		fn: function(e){
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
		}
	    },
	    /*
	      tap - This function handles toggling single buttons when tapped/clicked. This allows for fine tuning of the 
	      regions.
	    */
	    tap: {
		element: 'element',//Important - SegmentedButton doesn't normally support this event, so it must be set to listen on the DOM element instead
		fn: function(e){
		    var button=this.getButtonByTouch(e.pageX);

		    if(button){
			this.toggleButtonByIndex(button.index);
			//console.log('tap on button '+button.index);
			//console.log('tap: '+this.getPressedIndices().toString());
		    }
		}
	    },
	    /*
	      longpress - This function toggles between all 'on' or all 'off'. If targeted button is 'on' all will be turned 'off' and vice versa.
	     */
	    longpress: {
		element: 'element',//Important - SegmentedButton doesn't normally support this event, so it must be set to listen on the DOM element instead
		fn: function(e){
		    var button=this.getButtonByTouch(e.pageX);
		    
		    if(button){
			var buttons=this.getItems().items,
			buttonCount=buttons.length,
			task=this.isPressed(button)?'activate':'deactivate',//This is a little funky/reversed, because isPressed changes on 'mousedown'
			pressedIndicesNew = [],
			i=0;

			if(task=='activate'){
			    for(;i<buttonCount;i++){
				pressedIndicesNew.push(i);
			    }
			}
			this.setPressedButtons(pressedIndicesNew);
			//console.log('longpress on button '+button.index);
		    }
		}
	    },
	    /*
	      resize - This function updates the RangeSelector's knowledge of it's size/position with respect to the screen after it's DOM element
	      is resized as a result of either the browser window changing size or the layout changing. Also updates the area property of each
	      button.
	     */
	    resize: {
		buffer: 100, //buffer reduces calls to this function as resize is taking place, all that matters is final size in 'resting' state
		fn: function(){
		    var buttons=this.getItems().items,
		    buttonCount=buttons.length,
		    i=0;
		    
		    for(;i<buttonCount;i++){
			buttons[i].area=Ext.util.Region.getRegion(buttons[i].element);
		    }
		    this.setArea(Ext.util.Region.getRegion(this.element));
		    //console.log('selector resized', this.element.dom.scrollWidth);
		    //console.log(this.area.toString());
		}
	    },
	    /*
	      painted - This function initializes the values of the related components (totalPercentCmp and totalMinutesCmp), not called until it 
	      is safe to attempt to access those other components. 
	     */
	    painted: {
		fn: function(){
		    this.displayTotalPercent();
		    this.displayTotalMinutes();
		}
	    }
	}
    },
    /*
      initialize - This function initializes the RangeSelector using values specified in the config object. SegmentedButton constructor
      must be called first [this.callParent()].
     */
    initialize: function(){
	this.callParent(); //Important - takes care of establishing everything associated with the parent class (SegmentedButton)

	//Establish number of buttons given increment setting
	var increment=this.getIncrement(),//default of 5 is given in class definition config above
	numButtons=(100/increment),
	regions='',
	i=0;

	//Create and initialize buttons
	for(;i<numButtons;i++){
	    var button=Ext.create('Ext.Button', {//There are a number of custom properties being added to the button class. In the future, an extension of Ext.Button might be nice
		index: i,//custom index used to identify buttons
		text: '&nbsp;',
		width: increment+'%',//set size of each button based on increment
		area: {}, //This stores the Ext.util.Region associated with the area of the screen the button occupies when drawn in the browser
		pressed: false //default to not pressed
	    });
	    this.add(button);
	    regions+='0';//build empty region string for default empty state
	}
	
	this.setRegions(this.config.regions || regions);//Pull in region data is available, otherwise initialize to empty state.
	this.setTotalPercentCmp(this.config.totalPercentCmp);
	this.setTotalMinutesCmp(this.config.totalMinutesCmp);
	this.setDurationCmp(this.config.durationCmp);
	this.initializeRegions();//Now that the buttons are in place, set them to 'on' or 'off' according to region data
	//console.log(this.getItems().items);
    },
    /*
      getButtonByTouch - This function uses the touch position (pageX) to look up which button corresponds to that position
      by iterating over the button collection and checking if the touch position falls within each button's area. Returns
      the button object when found. Additional logic is in place to account for touches going beyond the RangeSelector's
      area, in which case either the first or last button is returned depending on which side of the RangeSelector the touch
      has gone out of bounds on. 
     */
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
    /*
      getButtonByIndex - This function uses a button index to look up and return a button. Uses SegmentedButton's getAt function
     */
    getButtonByIndex: function(index){
	return this.getAt(index);
    },
    /*
      getPressedIndices - This function returns an array of indices corresponding to the buttons that are currently pressed.
      Uses SegmentedButton's getPressedButtons function to retrieve an array of button objects which is iterated over to
      collect those buttons' index properties into an array.  
     */
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
    /*
      toggleButtonByIndex - This function toggles the state of the button identified by the index argument. Uses SegmentedButton's
      setPressedButtons function.
     */
    toggleButtonByIndex: function(index){
	var button=this.getItems().items[index],
	pressedIndicesOld=this.getPressedIndices(),
	pressedIndicesNew=[],
	wasPressed=this.isPressed(button);

	if(wasPressed){
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
	this.setPressedButtons(pressedIndicesNew);
	//console.log('toggled by index: '+index);
	//console.log('selected: '+this.getPressedIndices().toString());
    },
    /*
      activateButtonByIndex - This function turns on the button identified by the index argument or does nothing if that button is
      already turned on. Uses SegmentedButton's setPressedButtons function.
     */
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
	this.setPressedButtons(pressedIndicesNew);
	//console.log('toggled by index: '+index);
	//console.log('selected: '+this.getPressedIndices().toString());
    },
    /*
      deactivateButtonByIndex - This function turns off the button identified by the index argument or does nothing if that button is
      already turned off. Uses SegmentedButton's setPressedButtons function.
     */
    deactivateButtonByIndex: function(index){
	var button=this.getItems().items[index],
	pressedIndicesOld=this.getPressedIndices(),
	pressedIndicesNew=[],
	wasPressed=this.isPressed(button);

	if(wasPressed){
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
	this.setPressedButtons(pressedIndicesNew);
	//console.log('toggled by index: '+index);
	//console.log('selected: '+this.getPressedIndices().toString());
    },
    /*
      initializeRegions - This function is responsible for using the region data (if available) retrieved from the server to initialize
      the state of each button when the RangeSelector is first displayed. It also establishes the initial value for RangeSelector.total
      based on the region data. Uses SegmentedButton's setPressedButtons function. Code written to handle previous, object-style region
      data has been commented out and replaced by code that handles string representation of the region data
     */
    initializeRegions: function(){
	/*var regions=this.getRegions(),
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
	}*/
	var regions=this.getRegions(),
	buttonCount=regions.length,
	increment=this.getIncrement(),
	initialPressedIndices=[],
	total=0,
	i=0;
	for(;i<buttonCount;i++){
	    if(regions.charAt(i)=='1'){
		initialPressedIndices.push(i);
		total+=increment;
	    }
	}
	this.setPressedButtons(initialPressedIndices);
	this.setTotal(total);
	//console.log(this.getTotal());	
    },
    /*
      recordRegions - This function updates the region data to match the current state of the buttons in the RangeSelector. Total is 
      tallied and displayed as well. Code written to handle previous, object-style region data has been commented out and replaced by
      code that handles string representation of the region data. 
     */
    recordRegions: function(){/*
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
	}*/
	

	var buttons=this.getItems().items,
	buttonCount=buttons.length,
	increment=this.getIncrement(),
	tempRegions='',
	i=0,
	total=0;
	
	for(;i<buttonCount;i++){
	    if(this.isPressed(buttons[i])){
		tempRegions+='1';
		total+=increment;
	    }
	    else{
		tempRegions+='0';
	    }
	}
	this.setRegions(tempRegions);
	this.setTotal(total);
	this.displayTotalPercent();
	this.displayTotalMinutes();
	//console.log('regions: '+this.regions.toString())
	//console.log(this.total);
    },
    /*
      recordTotal - This function tallies the total % selected in the RangeSelector and updates RangeSelector.totalPercentage
      and displays the updated total value. Then calls function to display total minutes given the % and the lesson duration 
      retrieved from Lesson Duration input on the page.
     */
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
	this.displayTotalPercent();
	this.displayTotalMinutes();
    },
    /*
      displayTotalPercentage - This function updates the displayed total percentage value. Looks up the total % display component using
      id fed into config at initialization. 
     */
    displayTotalPercent: function(){
	var outString=Math.round(this.getTotal())+'%';
	Ext.ComponentQuery.query('#'+this.getTotalPercentCmp())[0].setValue(outString);
    },
    /*
      displayTotalPercentage - This function updates the displayed total percentage value. Looks up the total % display component using
      id fed into config at initialization. 
     */
    displayTotalMinutes: function(){
	var totalMinutes=0, 
	totalPercent=this.getTotal(),
	outString='';
	duration=Ext.ComponentQuery.query('#'+this.getDurationCmp())[0].getValue();
	totalMinutes=(totalPercent/100)*duration;

	if(Math.round(totalMinutes)!=totalMinutes){
	    outString='~';
	}
	outString+=Math.round(totalMinutes)+' minutes';
	Ext.ComponentQuery.query('#'+this.getTotalMinutesCmp())[0].setValue(outString);
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
	    itemId: 'rs0',
	    totalPercentCmp: 'rs0_percent',
	    totalMinutesCmp: 'rs0_minutes',
	    durationCmp: 'duration',
	    regions: '00001111111111000000'
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
					    xtype: 'numberfield',
					    label: 'Lesson Duration',
					    name: 'duration',
					    itemId: 'duration',
					    minValue: 0,
					    maxValue: 360,
					    value: 0,
					    listeners: {
						keyup: function(){
						    var rangeSelectors=Ext.ComponentQuery.query('rangeselector'),
						    rangeSelectorCount=rangeSelectors.length,
						    i=0;
						    for(;i<rangeSelectorCount;i++){
							rangeSelectors[i].displayTotalMinutes();
						    }
						    console.log('duration changed');
						}
					    }
					}
				    ]
				},
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
						    itemId: 'rs0_percent',
						    label: 'Total:',
						    readOnly: true
						},
						{
						    xtype: 'textfield',
						    itemId: 'rs0_minutes',
						    label: '',
						    readOnly: true
						}
					    ]
					},
					{
					    xtype: 'container',   
					    items: [
						{
						    xtype: 'rangeselector',
						    itemId: 'rs1',
						    totalPercentCmp: 'rs1_percent',
						    totalMinutesCmp: 'rs1_minutes',
						    durationCmp: 'duration',
						    regions: '11110000001111111100'
						},
						{
						    xtype: 'textfield',
						    itemId: 'rs1_percent',
						    label: 'Total:',
						    readOnly: true
						},
						{
						    xtype: 'textfield',
						    itemId: 'rs1_minutes',
						    label: '',
						    readOnly: true
						}
					    ]
					}
				    ]
				},
				{
				    xtype: 'button',
				    text: 'Send',
				    ui: 'confirm',
				    handler: function(){
					var rangeSelectors=Ext.ComponentQuery.query('rangeselector'),
					rangeSelectorCount=rangeSelectors.length,
					rangeSelector,
					outString='',
					i=0;
					for(;i<rangeSelectorCount;i++){
					    rangeSelector=rangeSelectors[i];
					    outString+=(
						'RangeSelector #'+(i+1)+': '+'['+rangeSelector.getRegions()+'] ('+rangeSelector.getTotal()+'%)<br/>'
					    );
					}
					Ext.Msg.alert(
					    'Regions:',
					    outString,
					    Ext.emptyFn
					);
					//this.up('formpanel').submit();
				    }
				}
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

	
	
