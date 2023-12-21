
		Web2Cal.defaultPlugins=function(){}
		/**
		 * Utility function. Invoked when creating a new event. Populates Date fields. 
		 * Loads the list of categories (groups). If event is all day, Changes time automatically.
		 * 
		 * @param {Object} obj - Event
		 * @param {Object} groups - List of groups 
		 * @param {Object} allday - Boolean to indicate if event is all day
		 * 
		 */
		Web2Cal.defaultPlugins.onNewEvent=function(obj, groups, allday)
		{	  
			var newevt=jQuery("#defaultNewEventTemplate"); 
			//Clear out and reset form
			newevt.find("#eventDesc").val("").end()
				.find("#eventName").val("").focus().end()
				.find("#eventStartDate").val( obj.startTime.toString("MM/dd/yyyy")).end() 
			 	.find("#eventEndDate").val(obj.endTime.toString("MM/dd/yyyy")).end();
				 
		 	if(allday) 
				newevt.find("#allDayEvent").attr("checked", true).end()				
					  .find("#eventStartTime").val("").end()
					  .find("#eventEndTime").val(""); 
			else 
				newevt.find("#allDayEvent").attr("checked", false).end()
					.find("#eventStartTime").val( obj.startTime.toString("hh:mm tt") ).end()
					.find("#eventEndTime").val( obj.endTime.toString("hh:mm tt") ); 

			//display a list of groups to select from.
			var groupDD=newevt.find("#eventGroup").get(0);
			removeAllOptions(groupDD);
			for(var g in groups)
			{	
				if(!groups.hasOwnProperty(g))continue;
				var gId = groups[g].groupId;
				addOption(groupDD, groups[g].groupName,groups[g].groupId,false);
			} 
			if(obj.group && obj.group.groupId)	
				newevt.find("#eventGroup").val(obj.group.groupId); 
			
		}
		/**
		 * Utility Function. Reads user's input into New Event form.
		 * Constructs an object with a random event id and returns
		 * 
		 * @return Event Object
		 */
		Web2Cal.defaultPlugins.getNewEventObject=function()
		{
			var newEventContainer = jQuery("#defaultNewEventTemplate"); 
			var name=newEventContainer.find( "#eventName").val();
			var grp=newEventContainer.find("#eventGroup").val();
			var grpName=newEventContainer.find("#eventGroup  option:selected").text(); 
			var strtTime=newEventContainer.find("#eventStartTime").val();
			var endTime=newEventContainer.find("#eventEndTime").val();
			var startDate=newEventContainer.find("#eventStartDate").val();
			var endDate=newEventContainer.find("#eventEndDate").val();
			var description=newEventContainer.find("#eventDescription").val();
			 
			if(name=="")
			{
				name=HtmlEncode("No Title");
			}
			
			var alldaybox=jQuery("#allDayEvent", newEventContainer).get(0);
			var allday=alldaybox.checked;
			var start	=	getDateFromStrings(startDate, strtTime);
			var end		=	getDateFromStrings(endDate, endTime);			 
			if(allday)
			{
				start.setHours(0,0,0);
				end.setHours(0,0,0);
			} 
			var newev={name:name,  startTime:start, endTime:end
						, allDay:allday
						, group:{groupId:grp, name: grpName}  
						, eventId: Math.ceil(999*Math.random()) 
						, description: description
						};
			return newev; 
		} 
		/**
		 * Utility function to create date object from date string and time string
		 * @param dateString - Date String mm/dd/yyyy
		 * @param timeString - Time String HH:MM AM/PM
		 * @return Date Object
		 */
		function getDateFromStrings(dateString, timeString)
		{
		    var dt = Date.parse(dateString + " "+timeString);
		    return dt;
		}
		
		/**
		 * Creates default HTML Elements required by calendar. 
		 * All templates can be overwritten in the HTML document and ID of the element can be provided to web2cal.
		 * 
		 * @param {Object} opts
		 */
		Web2Cal.defaultPlugins.load=function(opts)
		{
			var options = opts || new Array();
			var createWeekEventTemplate=function()
			{
				var _html='<div class="calendarTemplate"  id="dayWeekEventTemplate" style="display:none;"> '
							+''
							+' <div class="header" style="">'
							+' 	${formattedStartTime} - ${formattedEndTime}'
							+' </div>	'
							+' <div class="body"  style="padding:1px;">'
							+' 	${eventName}<br>${eventDesc}'
							+' </div> '
							+''
						+' </div>';
				return _html;
			}
			var createRecurEventOptions=function()
			{
				var _html='	'
						+'<div id="editRecurEventOptions"> '
						+'	<P>'
						//+'		Would you like to change only this event or all events in the series?'
						+Web2Cal.LANG.LABEL_EDIT_RECUR_EVENT_DESC
						+'	</P>'
						+'	<input type="button" tabindex="1" class="button" value="Only this instance" id="recurEvent_SAVEONE" />'
						+'	<input type="button" tabindex="2" class="button" value="All events in the series" id="recurEvent_SAVEALL" />'
						//+'	<input type="button" tabindex="3" class="button" value="All following" id="recurEvent_SAVEFOLLOWING" />'
						+'	<input type="button" tabindex="4" class="button" value="Cancel" id="recurEvent_CANCEL" />'
						+'</div>';
				return _html;
			}
			var createWeekSlotTemplate= function()
			{
				var _html='<div class="calendarTemplate"  id="wsSlotTemplate" style="display:none;"> '
							+'		<div>'
							+'			${name}  '
							+'		</div>'
							+'	</div>';
				return _html;
			}
			var createMonthEventTemplate=function()
			{
				var _html='<div class="calendarTemplate"  id="monthEventTemplate" style="display:none;"> '
						+'			<div  style="">'
						+'					${formattedStartTime} - ${eventName} : ${eventDesc}'
						+'			</div>	'
						+'	</div>';
				return _html;
			}
			var createWorkshiftTemplate=function()
			{
				
				var _html = '<div class="calendarTemplate"  id="workshiftEventTemplate" style="display:none;"> '
								+'<div class="header" style="">'
								+'	${formattedStartTime} - ${formattedEndTime} - ${eventName}'
								+'</div>	'
								+'<div class="body"  style="padding:1px;">'
								+'	${name}   '
								+'</div> '
							+'</div>';
				return _html;
			}
			var createDefaultPreview = function()
			{
				var _html='<div id="previewTemplate"  class="calendarTemplate fullPreviewTemplate " style="display:none">'
						+'		<div class="aPointer p-left" style="display: block; z-index: 2; "></div>'
						+'		<div id="ds-right" class="dshadow ds-right"></div>'
						+'		<div id="ds-bottom" class="dshadow ds-bottom"></div>'
						+'		<div id="ds-corner" class="dshadow ds-corner"></div>' 
						+'		<div class="header">'
						+'			${eventName}'
						+'		</div>'
						+'		<table width="100%">'
						+'			<tr>'
						+'				<td valign="top">'
						+'					<span class="TextSizeXSmall">Start: </SPAN><span class="startTime">${formattedStartTime}</span>'
						+'					<br/>'
						+'					<span class="TextSizeXSmall">End: </SPAN><span class="startTime">${formattedEndTime}</span>'
						+'				</td>'
						+'				<td valign="top"> '
						+'				</td>'
						+'			</tr>'
						+'			<tr> '
						+'				<td colspan="2" align="left">'
						+'					<span class="callabel TextSizeXSmall">'
						+'						Description:'
						+'					</span>			'
						+'					<div  class="EventDescription">'
						+'						${eventDesc}'
						+'					</div>'
						+'				</td>'
						+'			</tr> '
						+'		</table>'
						+'		<ul class="actions">'
						+'			<li> <a href="javascript:rzEditEvent(\'${eventId}\');" name="edit" class="websbutton"> Edit event </a> </li>'
						+'			<li> <a href="javascript:rzDeleteEvent(\'${eventId}\');" name="delete" class="websbutton"> Delete event </a> </li> '
						+'		</ul>' 
						+'</div>';
					return _html;
			}
			var createMonthAllDayTemplate=function()
			{
				var _html='<div class="calendarTemplate"  id="monthAllDayTemplate" style="display:none;">'
							+'	<a href="#" eventId="${eventId}">'
							+'			<span>${formattedStartTime}</span> - <span>${formattedEndTime}</span>	'
							+'			<span>${eventName}</span></a> '
							+'</div>';
				return _html;
			} 
			var createQuickFilterTemplate=function()
			{
				var _html='<div id="quickFilterTemplate" style="display:none;">'
							+'	<div class="grp">'
							+'			<div class="grpName">'
							+'				<input type="checkbox" id="chkGrp${groupId}" value="${groupId}" class="grpChkBx">${groupName}'
							+'			</div>'
							+'			<div class="grpColr ${color.css}"><div class="filterBoxColor">A</div></div>'
							+' </div>'
						+'</div>';
				return _html;
			} 
			var createNewEventTemplate = function()
			{
				var _html='<div id="defaultNewEventTemplate" class="calendarTemplate newEventTemplate">	'
							+'	<div class="aPointer p-left " style="display: block; z-index: 2; " ></div> 	'
							+'	<div class="acalclosebtn topright closeNewEvent"></div>	'
							+'	<div class="header" >	'
							+'		Create New Event	'
							+'	</div>	'
							+'	<div style="padding:1px;height:80%;margin-bottom:30px;overflow:auto;">	'
							+'	<table cellpadding="0"  width="100%">		'
							+'		<tr>	'
							+'			<td valign="top">			'
							+'			<div>	'
							+'				<div class="label">Event Name</div>	'
							+'				<div class="value">	'
							+'					<textarea  class="inputbox" rows="4" cols="20" name="eventName" id="eventName"></textarea>'
							+'				</div>	'
							+'			</div> 	'


							+'	<div>	'
							+'		<div class=" label" >	'
							+'			Group	'
							+'		</div>	'
							+'		<div class="selectGroup">	'
							+'			<select name="eventGroup" style="width:10em; border:1px solid #C3D9FF;"  id="eventGroup"></select>	'
							+'		</div>			'
							+'	</div>	'

							+'			<div>	'
							+'				<div class="label">All day? '
							+'					<input type="checkbox" class="inputbox" id="allDayEvent"/>'
							+'				</div>	'
							+'			</div> 	'
							+'			</td>	'
							+'			<td  valign="top">	'
							+'			<div>	'
							+'				<div class="label ">	'
							+'					Start Date:'
							+'				</div>	'
							+'				<div class="startDate">	'
							+'					<input type="Text" name="eventStartDate" style="width:6em; border:1px solid #C3D9FF;" id="eventStartDate"/>	'
							+'				</div>			'
							+'			</div>	'
							+'			<div>	'
							+'				<div class="label " >	'
							+'					Start Time:'
							+'				</div>	'
							+'				<div class="startTime">	'
							+'					<input type="Text" name="eventStartTime" style="width:5em; border:1px solid #C3D9FF;" id="eventStartTime"/>	' 
							+'				</div>	 	'
							+'			</div> 	'
							+'			<div>	'
							+'				<div class="label ">	'
							+'					End Date:'
							+'				</div>	'
							+'				<div class="endDate">	'
							+'					<input type="Text" name="eventEndDate" style="width:6em; border:1px solid #C3D9FF;" id="eventEndDate"/>	'
							+'				</div>			'
							+'			</div>	  	'
							
							+'			<div>	'
							+'				<div class="label" >	'
							+'					End Time: '
							+'				</div>	'
							+'				<div class="endTime">	'
							+'					<input type="Text" name="eventEndTime" style="width:5em; border:1px solid #C3D9FF;" id="eventEndTime"/> 	'
							+'				</div>		 	'
							+'			</div>	'
							+'			</td>	'
							+'		</tr>	'
							+'	</table>   	'
							+'			<ul class="actions">'
							+'				<li id="addEventBtn"> <a href="javascript:rzAddEvent();" name="edit" class="websbutton"> Create event </a> </li>'
							+'				<li style="display:none;" id="updateEventBtn"> <a href="javascript:rzUpdateEvent();" name="Update" class="websbutton"> Update event </a> </li>'
							+'				<li> <a href="javascript:rzCloseAddEvent();" name="Close" class="websbutton"> Close </a> </li> '
							+'			</ul>'
							+'	</div>';
					return _html;
			}

			var createAgendaTemplate=function()
			{
				var _html=''
					+'	<div class="calendarTemplate"  id="agendaViewTemplate" style="display:none;">'
					+'		<div class="agendaDateEvents">'
					+'		<div class="dateTitle">'
					+'			${date.toFullDateString()}'
					+'		</div>'
					+'		<div class="agendaEventsForDate">'
					+'			<div field="events">'
					+'			<div class="agendaViewEvent" id="agendaViewEvent${eventId}${_localId}">'
					+'				<table width="100%" >'
					+'					<tr>'
					+'						<td width="60%">'
					+'							<div class="arrowExpand evtDtlArrowIcon" id="eventIcon${eventId}${_localId}"></div>'
					+'							<a href="javascript:void(0)" onclick="agendaShowEventDetail(\'${eventId}${_localId}\')"><span style="font-weight:bold; ">${eventName}</span> </a>'
					+'						</td>'
					+'						<td width="28%"> '
					+'							(<span class="TextSizeXSmall"><span>${formattedStartTime}</span> - <span>${formattedEndTime}</span> </span>)  '
					+'						</td>'
					+'						<td width="10%">'
					+'							<span>${function:extractEventColor}</span>'
					+'						</td>'
					+'					</tr>'
					+'				</table>'
					+'			</div>'
					+'			<div id="eventDetail${eventId}${_localId}" class="agendaEventDetail" style="display:none;clear:both;">'
					+'				<table width="100%" cellpadding="2"  cellspacing="2" >'
					+'				<tr>'
					+'					<td valign="top">'
					+'						<span class="TextSizeXSmall">Start: </SPAN><span class="startTime">${formattedStartTime}</span>'
					+'						<br/>'
					+'						<span class="TextSizeXSmall">End: </SPAN><span class="startTime">${formattedEndTime}</span>'
					+'					</td> '
					+'				<tr> '
					+'					<td colspan="2" align="left">'
					+'						<span class="callabel TextSizeXSmall">'
					+'							Description:'
					+'						</span>			'
					+'						<div  class="EventDescription">'
					+'							${eventDesc}'
					+'						</div>'
					+'					</td>'
					+'				</tr>  '
					+'				</table>'
					+'			</div>'
					+'		</div>'
					+'		</div>'
					+'		</div>'
					+'	</div> ';

					return _html;
			}
			var load=function()
			{

				if(_windowDefaultPluginLoaded == false) //Load only once per page.
				{ 
					jQuery("body").append(createWeekEventTemplate())
								.append(createWeekSlotTemplate())
								.append(createMonthEventTemplate())
								.append(createDefaultPreview())	
								.append(createWorkshiftTemplate())	
								.append(createRecurEventOptions())								
								.append(createQuickFilterTemplate()) 							
								.append(createMonthAllDayTemplate()) 
								.append(createAgendaTemplate())
								.append(createNewEventTemplate())
					
					_windowDefaultPluginLoaded=true;
				}
			}
			var _windowDefaultPluginLoaded=false;
			  load();
		}
 
function removeAllOptions(from){if(!hasOptions(from)){return;}for(var i=(from.options.length-1);i>=0;i--){from.options[i] = null;}from.selectedIndex = -1;}
function addOption(obj,text,value,selected){if(obj!=null && obj.options!=null){obj.options[obj.options.length] = new Option(text, value, false, selected);}}
function hasOptions(obj){if(obj!=null && obj.options!=null){return true;}return false;}
		
