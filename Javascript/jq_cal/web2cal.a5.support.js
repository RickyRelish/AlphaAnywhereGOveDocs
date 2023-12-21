Web2CalLanguage_EN={
	 CLOSE: "Close"
	 ,DAYS:[ "Sunday", "Monday","Tuesday","Wednesday", "Thursday" , "Friday","Saturday"]
	 ,DAYS_SHORT: [ "Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	 ,DAYS_SHORT2: [ "Su","Mo", "Tu", "We", "Th", "Fr", "Sa"]
	 ,MONTHS_SHORT: ["Jan", "Feb","Mar", "Apr","May" ,"Jun", "Jul","Aug", "Sep","Oct","Nov","Dec"] 
	 ,MONTHS: ["January", "February","March", "April","May" ,"June", "July","August", "September","October","November","December"]
	,LABEL_MONTH: "Month"	
	,LABEL_WEEK: "Week"
	,LABEL_DAY: "Day"
	,LABEL_NEXT: "Next "
	,LABEL_AGENDA: "Agenda"
	,LABEL_WORKSHIFT: "Workshift"
	,LABEL_DAYS: "Days"
	,LABEL_WORKWEEK: "Work Week"
	,LABEL_W2CVIEW: "W2C View"
	,LABEL_HIDESHOW: "Hide / Show" 
	,LABEL_RECUR_EDIT_WINDOW:"Edit Recurring Event"
	,LABEL_EDIT_RECUR_EVENT_DESC: "	Would you like to change only this event, or all events in the series?"
	,LABEL_IS_RECURRING_EVENT: "This is a recurring Event"
	,LABEL_AM: "AM"
	,LABEL_PM: "PM" 
	,LABEL_EVENTNAME: "Event Name"
	,LABEL_STARTDATE: "Start Date"
	,LABEL_STARTTIME: "Start Time"
	,LABEL_ENDDATE: "End Date"
	,LABEL_ENDTIME: "End Time"
	,LABEL_GROUP: "Group"
	,LABEL_ALLDAY: "All Day?"
	,LABEL_CREATEEVENT: "Create Event"
	,LABEL_DESCRIPTION: "Description" 
	,LABEL_INFORMATION: "Information" 
	,LABEL_VIEWALL: "View All"
	,LABEL_DESCRIPTION: "Description"  
	,LABEL_NOTITLE: "No Title" 
	,LABEL_CREATENEWEVENT: "Create New Event" 
	,LABEL_CREATENEW: "Create New" 
	,LABEL_TODAY: "Today"
	,LABEL_OPTIONS: "Settings" 
	,LABEL_FILTER: "Filter" 
	,LABEL_EXPAND_DETAILS: "Expand Details" 
	,LABEL_COLLAPSE_DETAILS: "Collapse Details" 
	,LABEL_MORE: "More" 
	,LABEL_CREATENEWGROUP: "New Calendar"
	,MSG_LOADINGMSG: "Loading.. Please Wait"  
	,MSG_RETRIEVING: "Retrieving Events" 	
	,MSG_WAIT: "Please Wait..." 		
	,MSG_UPDATING: "Updating..." 	
	,MSG_WS_EVENT_STARTS: "Event Starts at {0}" 	
	,MSG_WS_EVENT_ENDS: "Event Ends at {0}" 	
	,MSG_VIEW_NOTFOUND:"View '{0}' Not found. \nCheck your settings. The Default View may not be in the selected views"
}


Web2Cal.LANG=Web2CalLanguage_EN;
Web2Cal.defaultSettings=new Array();
Web2Cal.defaultSettings['leftNavTitle']						=  Web2Cal.LANG.HIDESHOW;
Web2Cal.defaultSettings['maxEventsToShow'] 					= 7; 
Web2Cal.defaultSettings['startOfWeek']		 				= 0; //0 for Sunday, 1 for Monday....
Web2Cal.defaultSettings['date'] 							= new Date();
Web2Cal.defaultSettings['defaultView'] 						= "week";

Web2Cal.defaultSettings['startTime']						= 7;
Web2Cal.defaultSettings['endTime'] 							= 23;
Web2Cal.defaultSettings['customViewSize'] 					= 4;
Web2Cal.defaultSettings['adjustHeightOffset']				= 0;  
Web2Cal.defaultSettings['timeFormat'] 						= 12;
Web2Cal.defaultSettings['dwSlotHeight'] 					= 43;
Web2Cal.defaultSettings['timeZoneOffset']					= -new Date().getTimezoneOffset();
Web2Cal.defaultSettings['controlWidth'] 					= '99%';
Web2Cal.defaultSettings['controlHeight'] 					= '500px';
Web2Cal.defaultSettings["showLeftNav"] 						= true;   
Web2Cal.defaultSettings["showAllDay"]	 					= true;
Web2Cal.defaultSettings["showQuickFilter"]	 				= true;
Web2Cal.defaultSettings["showQuickAdd"]	 					= true;  
Web2Cal.defaultSettings["showOptions"]		 				= false; 
Web2Cal.defaultSettings['showTodayButton']					= false;
Web2Cal.defaultSettings["newEventInPopUp"]					= false;
Web2Cal.defaultSettings["wsGroupUnselectable"]				= false;
Web2Cal.defaultSettings["sampleMode"]						= true;
Web2Cal.defaultSettings["wsStartTime"] 						= 9;
Web2Cal.defaultSettings["wsEndTime"]						= 24;
Web2Cal.defaultSettings["wsInterval"]						= 2;
Web2Cal.defaultSettings["wsNameWidth"]						= 100;
Web2Cal.defaultSettings["wsSlotHeight"]						= 55;
Web2Cal.defaultSettings["interval"]							= 4;
Web2Cal.defaultSettings["newEventTemplate"]  				= "defaultNewEventTemplate";
/*
Web2Cal.defaultSettings["monthNewEventTemplate"]  			= "defaultNewEventTemplate";
Web2Cal.defaultSettings["weekNewEventTemplate"]  			= "defaultNewEventTemplate";
Web2Cal.defaultSettings["w2cNewEventTemplate"]  			= "defaultNewEventTemplate";
Web2Cal.defaultSettings["wsNewEventTemplate"]  				= "defaultNewEventTemplate";
*/
Web2Cal.defaultSettings["wsSlotTemplateId"]  			    = "wsSlotTemplate";	
Web2Cal.defaultSettings["timeSlotTemplate"]					= "timeSlotTemplate";
Web2Cal.defaultSettings["weekDataTemplate"]  				= "dayWeekEventTemplate";
Web2Cal.defaultSettings["w2cDataTemplate"]  				= "dayWeekEventTemplate"; 	
Web2Cal.defaultSettings["monthDataTemplate"]  				= "monthEventTemplate";	 	
Web2Cal.defaultSettings["wsDataTemplate"]  					= "workshiftEventTemplate";
Web2Cal.defaultSettings["agendaDataTemplate"]  				= "agendaViewTemplate";
Web2Cal.defaultSettings["previewTemplate"]  				= "previewTemplate";
/*
Web2Cal.defaultSettings["weekPreviewTemplate"]  			= "previewTemplate";
Web2Cal.defaultSettings["wsPreviewTemplate"]  				= "previewTemplate";
Web2Cal.defaultSettings["monthPreviewTemplate"]  			= "previewTemplate"; 
Web2Cal.defaultSettings["w2cPreviewTemplate"]  				= "previewTemplate";  
*/
Web2Cal.defaultSettings["quickFilterTemplate"]				= "quickFilterTemplate";
Web2Cal.defaultSettings["monthAllDayTemplate"]				= "monthAllDayTemplate";


//callbacks 	 	 
Web2Cal.defaultSettings["loadEvents"]  							= function(){};  
 

Web2Cal.dictionary=function(){};
/**
 * 
 * @param {Object} key
 * @param {Object} params
 */
Web2Cal.dictionary.getMsg=function(key, params){
	
	var msg=Web2Cal.LANG[key];
	if(!msg)
		return; 
	if(params!=undefined)
	{
		for(var x=0; x<params.length; x++)
		{ 
			msg= msg.replace( "{"+x+"}" , params[x]);
		} 
	}
	return msg;
} 

/**
 * Method to Show Preview
 * @param {jQuery Element} element
 * @param {Array} options
 * 			1. container - jQuery Container Object
 * 			2. activeElement - Element that was clicked on
 * 			3. perspective - Left | Top
 */
Web2Cal.showPreview=function(element, options)
{ 
	var as=GetBounds(options.activeElement),windowEvent=options.ev, top, left;
	var containerOffset=options.container.offset(),viewPort=getViewport();
	var delay=0, bodyscrolltop=options.container.find("div.calbodyContainer").get(0).scrollTop;
	var bodyScrollY=+getBodyScrollY(), pointerTop=25, pointerHeight=10, pointerDimension=5;	
	var jqEle=jQuery(element).hide(), eleW= jqEle.width();
	var pointerObj=jqEle.find(".aPointer").css({top:pointerTop+"px"})
						.removeClass("p-left")
						.removeClass("p-right")
						.removeClass("p-bottom")
						.removeClass("p-top"); 
						
	options.heightOffset = options.heightOffset || 0;
 
	
	left=windowEvent.clientX+pointerDimension;
	top=windowEvent.clientY+bodyScrollY;

	if(options.perspective =="bottom" || options.perspective=="top")
	{
		pointerObj.addClass("p-top");
		left=as.Left+(as.Width/2)-eleW/2-14;

		jqEle.fadeIn(delay).css({
					left:(left )+"px"
					, top: (top)+"px"
				});
	} 
	else
	{
		if (( left +   eleW) > ( viewPort.w)) {
			left =left- eleW-pointerDimension;  
			if(left<0)
			{
				jqEle.css({left:"0px"});
			} 
			pointerObj.addClass("p-right");
		}
		else
		{ 
			pointerObj.addClass("p-left"); 
		}  
		 
		top=top-pointerDimension;		
		var overflowingHeight=viewPort.h-(top+jqEle.height()+5) +getBodyScrollY();		
		if(overflowingHeight<0)
		{
			pointerObj.css({top:(-overflowingHeight-5) });
			top=top+overflowingHeight+10;
		}else
		{
			pointerObj.css({top:pointerTop });
			top=top-pointerTop;
		} 
		jqEle.show().css({
				left:(left )+"px"
				, top: (top-pointerHeight)+"px"
			});
	}
}
/**
 * 
 * Method to Show New Event Form
 * @param {jQuery Element} element
 * @param {Array} options
 * 			1. container - jQuery Container Object
 * 			2. activeElement - New Event Element that was just created.
 * 			3. perspective - Left | Top
 *
 *  Note : This event is the first event that fires when creating a new event.
 *  Surpress for use with A5 V10 Grid
*/

Web2Cal.showNewEventForm=function(element, options)
{ 
  var useA5Grid=true;
  if (!useA5Grid) {
     if (options.asPopup) 
	{
		options.activeElement.style.display = "none"; 
 
		jQuery(element).show().dialog({ 
			title: "Create New Event",
			modal: true,
			autoOpen:true,
			minWidth:  Web2CalConstants.NEW_EVENT_POPUP_WIDTH ,
			minHeight: Web2CalConstants.NEW_EVENT_POPUP_HEIGHT,
			width:  Web2CalConstants.NEW_EVENT_POPUP_WIDTH ,
			height: Web2CalConstants.NEW_EVENT_POPUP_HEIGHT
		}); 
	}
	else 
	{ 
		var calbodyContainer=options.container.find("div.calbodyContainer"), bodyscrolltop= calbodyContainer.get(0).scrollTop;
		var as = GetBounds(options.activeElement), viewPort = getViewport(), delay = 0, pointerTop = 12, pointerDimension =10;
		var top = as.Top, left = as.Left, jqEle = jQuery(element).hide(), eleW = jqEle.width();
		var pointerObj = jqEle.find(".aPointer").css({top: pointerTop + "px"})
							.removeClass("p-left").removeClass("p-right").removeClass("p-bottom").removeClass("p-top");
		if(options.removeBodyScroll && options.removeBodyScroll!=false){
			 top=top-bodyscrolltop;  
		}
		options.heightOffset =options.heightOffset ||0; 
		top=top+options.heightOffset;
		
		if (options.perspective == "bottom" || options.perspective == "top") 
		{
			pointerObj.addClass("p-top").css({
				top: "-14px"
			});
			left = as.Left + (as.Width / 2) - eleW / 2 - 14;
			jqEle.show().css({
				left: (left) + "px",
				top: (top + as.Height  ) + "px"
			});
		}
		else 
		{
			if ((left + as.Width + eleW) > (viewPort.w)) 
			{
				left = Math.abs(as.Left - eleW - pointerDimension);
				pointerObj.addClass("p-right");
			}
			else 
			{
				left = left + as.Width - pointerDimension;
				pointerObj.addClass("p-left");
			}
			if (left < viewPort.l) 
			{
				left = as.Left + options.activeElement.offsetWidth;
			}
			top = top + (options.activeElement.offsetHeight / 2);
			var overflowingHeight = viewPort.h - (top + jqEle.height() )+options.heightOffset+getBodyScrollY();
			if (overflowingHeight < 0) 
			{ 
				pointerObj.css({
					top: -overflowingHeight
				});
				top = top + overflowingHeight;
			}
			else 
			{
				pointerObj.css({
					top: pointerTop
				});
				top = top - pointerTop;
			}
			jqEle.fadeIn( 500 ).css({
				left: (left) + "px",
				top: (top - pointerDimension) + "px"
			});
		} 
	}
  }
}



Web2CalConstants.HIGHLIGHT_TIME=1800;

Web2CalConstants.IMAGE_PATH="images/";

Web2CalConstants.USE_BASE_FOR_POPUP	= false;

Web2CalConstants.START_OF_WEEK = 0;

Web2CalConstants.NEW_EVENT_POPUP_WIDTH	= "500px";

Web2CalConstants.NEW_EVENT_POPUP_HEIGHT	= "350px;"; 

Web2CalConstants.MONTH_EVENT_HEIGHT = 20;	
Web2CalConstants.DAY_ALLDAY_EVENT_HEIGHT = 18;	
Web2CalConstants.NEW_EVENT_STYLE="grayTemplate";
Web2CalConstants.WEEK_ALLDAY_DEFAULT_HEIGHT=20;

/*Date and Time Formats*/
Web2CalConstants.DATE_FORMAT="MM/dd/yyyy";
Web2CalConstants.TIME_FORMAT="hh:mm tt";
Web2CalConstants.WEEK_TITLE_DATE_FORMAT1="MMM d"; //Format in Title. Example: "Apr 4 - Apr 10, 2010".  Applies to "Apr 4"
Web2CalConstants.WEEK_TITLE_DATE_FORMAT2="MMM d, yyyy"; //Format in Title. Example: "Apr 4 - Apr 10, 2010".  Applies to "Apr 10, 2010"
Web2CalConstants.WEEK_HEADER_DATE_FORMAT="ddd, MMM d"; //Format in week view header. Example: "Tue, Apr 6"
Web2CalConstants.MONTH_TITLE_DATE_FORMAT="MMMM, yyyy"; //Format for Title in Month. Example: "April, 2010"
Web2CalConstants.AGENDA_TITLE_DATE_FORMAT1="MMM d"; //Format in Title. Example: "Apr 4 - Apr 10, 2010".  Applies to "Apr 4"
Web2CalConstants.AGENDA_TITLE_DATE_FORMAT2="MMM d, yyyy"; //Format in Title. Example: "Apr 4 - Apr 10, 2010".  Applies to "Apr 10, 2010"
Web2CalConstants.WS_TITLE_DATE_FORMAT="MMM d, yyyy"; //Format in Title. Example: "Apr 10, 2010". 
Web2CalConstants.W2C_TITLE_DATE_FORMAT="MMM d, yyyy"; //Format in Title. Example: "Apr 10, 2010".
/*End of Formats*/ 
 

Web2Cal.colors=new Array();
Web2Cal.colors.push({color:"teal", css: "tealTemplate"});
Web2Cal.colors.push({color:"lightGreen", css: "lightGreenTemplate"});
Web2Cal.colors.push({color:"brown", css: "brownTemplate"});
Web2Cal.colors.push({color:"blue", css: "blueTemplate"});
Web2Cal.colors.push({color:"lightPurple", css: "lightPurpleTemplate"});
Web2Cal.colors.push({color:"brightGreen", css: "brightGreenTemplate"});
Web2Cal.colors.push({color:"dirtyYellow", css: "dirtyYellowTemplate"});
Web2Cal.colors.push({color:"green", css: "greenTemplate"});
Web2Cal.colors.push({color:"gray", css: "grayTemplate"});
Web2Cal.colors.push({color:"dirtyPink", css: "dirtyPinkTemplate"});
Web2Cal.colors.push({color:"purple", css: "purpleTemplate"});
Web2Cal.colors.push({color:"cyan", css: "cyanTemplate"});
Web2Cal.colors.push({color:"brick", css: "brickTemplate"});
Web2Cal.colors.push({color:"brightBlue", css: "brighBlueTemplate"});
Web2Cal.colors.push({color:"pink", css: "pinkTemplate"});

