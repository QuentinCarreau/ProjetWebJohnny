/*http://blog.niap3d.com/jsSimpleDatePickr*/
function jsSimpleDatePickr(){
var me = this;
me.jsSDPObj = Array();
me.jsSDPId = 1;
//
// ajoute un calendrier
//
me.CalAdd = function(data){
	var calDiv = document.getElementById(data.divId);
	var dateEl = document.getElementById(data.inputFieldId);
	// vÃ©rifie les donnÃ©es
	if(typeof(calDiv) == 'undefined') return 0;
	if(typeof(dateEl) == 'undefined') data.inputFieldId = '';
	if(typeof(data.hideOnClick) != 'boolean') data.hideOnClick = 1;
	
	var id = me.jsSDPId;
	if(data.buttonTitle == null || data.buttonTitle.length <= 0){
		if(dateEl != null){
			// attache la fonction CalToogle au champ de texte qui contiendra la date
			dateEl.addEventListener('click', function(){ me.CalDoFromField(data.inputFieldId, 'toogle'); }, false);
		}
		
	}else{
		// ajoute le bouton pour afficher, masquer le calendrier
		var bt = me.DomElementInit('input', {'parent': calDiv, 'value': data.buttonTitle, 'type': 'button'});
		bt.onclick = function(){
			me.CalToogle(id);
		};
	}
	// bloc div principal
	var divW = me.DomElementInit('div', {'parent': calDiv, 'id': 'calendarWrap'+id});
	// ajoute le paragraphe du titre
	if(data.navType != '00') divW.innerHTML += '<p id="calendarTitle'+id+'" class="calendarTitle"></p>';
	var divNav = me.DomElementInit('div', {'parent': divW, 'class': 'calendarNav'});
	// ajoute les boutons pour la navigation par an
	if(data.navType != null && data.navType.charAt(0) == 1){
		var i = me.DomElementInit('input', {'parent': divNav, 'class': 'calendarNavYL', 'type': 'button', 'value': '<<'});
		i.onclick = function(){
			me.CalYearNav(id, '-1');
		};
		i = me.DomElementInit('input', {'parent': divNav, 'class': 'calendarNavYR', 'type': 'button', 'value': '>>'});
		i.onclick = function(){
			me.CalYearNav(id, '+1');
		};
	}
	// ajoute les boutons pour la navigation par mois
	if(data.navType != null && data.navType.charAt(1) == 1){
		var i = me.DomElementInit('input', {'parent': divNav, 'class': 'calendarNavML', 'type': 'button', 'value': '<<'});
		i.onclick = function(){
			me.CalMonthNav(id, '-1');
		};
		i = me.DomElementInit('input', {'parent': divNav, 'class': 'calendarNavMR', 'type': 'button', 'value': '>>'});
		i.onclick = function(){
			me.CalMonthNav(id, '+1');
		};
	}
	// bloc div qui contiendra le calendrier
	me.DomElementInit('div', {'parent': divW, 'id': 'calendar'+id});
 	// masque le div principal
	divW.style.display = 'none';
	// sauvegarde l'objet
	me.jsSDPObj.push({
'divId': data.divId,
'inputFieldId': data.inputFieldId,
'callBack': data.callBack,
'id': id,
'displayNumber': parseInt(data.displayNumber) > 1 ? data.displayNumber:1,
'dateSel': new Date(),
'dateDisp': new Date(),
'dateCentury': data.dateCentury == null ? 20:data.dateCentury,
'dayLst': data.dayLst,
'monthLst': data.monthLst,
'dateMask': data.dateMask == null ? 'JJ/MM/AAAA':data.dateMask,
'titleMask': data.titleMask == null ? '':data.titleMask,
'hideOnClick': data.hideOnClick,
'classTable': data.classTable,
'classDay': data.classDay,
'classDaySelected': data.classDaySelected
});
	me.CalDateInit(id);
	me.jsSDPId++;
	if(data.showOnLaunch) me.CalToogle(id);
	return id;
}
//
// supprime un calendrier
//
me.CalDelete = function(id){
	var nb = me.CalId2Nb(id);
	if(nb < 0) return 0;
	document.getElementById(me.jsSDPObj[nb]['divId']).innerHTML = '';
	me.jsSDPObj.splice(nb, 1);
}
//
// supprime tous les calendriers
//
me.CalDeleteAll = function(){
	for(var i = 0; i < me.jsSDPObj.length; i++){
		document.getElementById(me.jsSDPObj[i]['divId']).innerHTML = '';
		me.jsSDPObj[i]['inputFieldId'] = 0;
	}
	me.jsSDPObj = Array();
	me.jsSDPId = 1;
}
//
// renvoi le numÃ©ro dans l'Array d'aprÃ¨s l'id
//
me.CalId2Nb = function(id){
	for(var i = 0; i < me.jsSDPObj.length; i++){
		if(me.jsSDPObj[i]['id'] == id){
			return i;
		}
	}
	return -1;
}
//
// affiche / masque le calendrier (clic depuis un champ de texte)
//
me.CalDoFromField = function(fieldId, action){
	for(var i = 0; i < me.jsSDPObj.length; i++){
		if(me.jsSDPObj[i]['inputFieldId'] == fieldId){
			if(action == 'toogle') me.CalToogle(me.jsSDPObj[i]['id']);
			if(action == 'show') me.CalShow(me.jsSDPObj[i]['id']);
			if(action == 'hide') me.CalHide(me.jsSDPObj[i]['id']);
			break;
		}
	}
}
//
// affiche / masque le calendrier
//
me.CalToogle = function(id){
	var nb = me.CalId2Nb(id);
	if(nb < 0) return 0;
	var e = document.getElementById('calendarWrap'+me.jsSDPObj[nb]['id']);
	if(e == 'undefined') return 0;
	if(e.style.display == 'block'){
		e.style.display = 'none';

	}else{
		if(me.jsSDPObj[nb]['inputFieldId'] != ''){
			var f = document.getElementById(me.jsSDPObj[nb]['inputFieldId']);
			if(f != null) me.CalDateInit(id, String(f.value));
		}
		me.CalShow(id);
	}
}
//
// affiche le calendrier
//
me.CalShow = function(id){
	var nb = me.CalId2Nb(id);
	if(nb < 0) return 0;
	var e = document.getElementById('calendarWrap'+me.jsSDPObj[nb]['id']);
	if(!e) return 0;
	me.CalContentInit(nb);
	me.CalShowTitle(nb);
	e.style.display = 'block';
}
//
// masque le calendrier
//
me.CalHide = function(id){
	var nb = me.CalId2Nb(id);
	if(nb < 0) return 0;
	var e = document.getElementById('calendarWrap'+me.jsSDPObj[nb]['id']);
	if(!e) return 0;
	e.style.display = 'none';
}
//
// navigation par mois
//
me.CalMonthNav = function(id, val){
	var nb = me.CalId2Nb(id);
	if(nb < 0) return 0;
	me.jsSDPObj[nb]['dateDisp'].setDate(1);
	var v = parseInt(val, 10);
	if(val.charAt(0) == '+' || val.charAt(0) == '-') v = me.jsSDPObj[nb]['dateDisp'].getMonth()+v;
	me.jsSDPObj[nb]['dateDisp'].setMonth(v);
	me.CalContentInit(nb);
	me.CalShowTitle(nb);
}
//
// navigation par annÃ©e
//
me.CalYearNav = function(id, val){
	var nb = me.CalId2Nb(id);
	if(nb < 0) return 0;
	var v = parseInt(val, 10);
	if(val.charAt(0) == '+' || val.charAt(0) == '-') v = me.jsSDPObj[nb]['dateDisp'].getFullYear()+v;
	me.jsSDPObj[nb]['dateDisp'].setFullYear(v);
	me.CalContentInit(nb);
	me.CalShowTitle(nb);
}
//
// change la date
//
me.CalDateInit = function(id, dateStr){
	var nb = me.CalId2Nb(id);
	if(nb < 0) return 0;
	var o = me.jsSDPObj[nb];
	if(!dateStr) dateStr = '';
	var m = o['dateMask'];
	// extrait la date d'aprÃ¨s le mask
	var pos, dY, dM, dD;
	pos = m.indexOf('JJ');
	if(pos != -1) dD = parseInt(dateStr.substr(pos, 2), 10);
	var pos = m.indexOf('AAAA');
	if(pos != -1) dY = parseInt(dateStr.substr(pos, 4), 10);
	else{
		pos = m.indexOf('AA');
		if(pos != -1) dY = parseInt(dateStr.substr(pos, 2), 10)+o['dateCentury']*100;
	}
	pos = m.indexOf('MM');
	if(pos != -1) dM = parseInt(dateStr.substr(pos, 2), 10)-1;
	today = new Date();
	if(isNaN(dD)) dD = today.getDate();
	if(isNaN(dM)) dM = today.getMonth();
	if(isNaN(dY)) dY = parseInt(today.getFullYear().toString().substr(2, 2), 10)+o['dateCentury']*100;
	o['dateSel'] = new Date(dY, dM, dD);
	o['dateDisp'] = new Date(dY, dM, dD);
}
//
// affiche le calendrier
//
me.CalContentInit = function(nb){
	var i, j;
	var cal = me.jsSDPObj[nb];
	var dayOrder = '1234560';
	var curDate = new Date(cal['dateDisp'].getFullYear(), cal['dateDisp'].getMonth(), 1);
	document.getElementById('calendar'+cal['id']).innerHTML = '';
	for(j = 0; j < cal['displayNumber']; j++){
		var num = today = 0;
		var month = curDate.getMonth();
		var year = curDate.getFullYear();
		if(month == cal['dateSel'].getMonth() && year == cal['dateSel'].getFullYear()) today = cal['dateSel'].getDate();
		var elT = me.DomElementInit('table', {'parent': document.getElementById('calendar'+cal['id']), 'class': cal['classTable']});
		var elTr = me.DomElementInit('tr', {'parent': elT});
		for(i = 0; i < 7; i++){
			me.DomElementInit('th', {'parent': elTr, 'content': cal['dayLst'][dayOrder[i]]});
		}
		elTr = me.DomElementInit('tr', {'parent': elT});
		var h, d = new Date(year, month, 1);
		for(num = 0; num < dayOrder.indexOf(d.getDay()); num++){
			me.DomElementInit('td', {'parent': elTr});
		}
		d.setMonth(month+1, 0);
		for(i = 1; i <= d.getDate(); i++){
			num++;
			if(num > 7){
				num = 1;
				elTr = me.DomElementInit('tr', {'parent': elT});
			}
			var cell = me.DomElementInit('td', {'parent': elTr, 'class': (i == today ? cal['classDaySelected']:cal['classDay']), 'content': i});
			cell.onclick = (function(v, m, y){
	            return function(){
					me.CalClick(nb, v+'/'+m+'/'+y);
				}
			})(i, month, year);
		}
		for(i = num; i < 7; i++){
			me.DomElementInit('td', {'parent': elTr});
		}
		curDate.setMonth(curDate.getMonth()+1);
	}
}
//
// callback : gÃ¨re une clic sur une date
//
me.CalClick = function(nb, dateStr){
	var dateArr = dateStr.split('/');
	var cal = me.jsSDPObj[nb];
	cal['dateSel'] = new Date(dateArr[2], dateArr[1], dateArr[0]);
	if(cal['inputFieldId'] != ''){
		dateArr[1]++;
		var m = cal['dateMask'];
		m = m.replace('AAAA', dateArr[2]);
		m = m.replace('AA', dateArr[2].toString().substr(2,2));
		m = m.replace('MM', parseInt(dateArr[1], 10) < 10 ? '0'+dateArr[1]:dateArr[1]);
		m = m.replace('M', dateArr[1]);
		m = m.replace('JJ', parseInt(dateArr[0], 10) < 10 ? '0'+dateArr[0]:dateArr[0]);
		m = m.replace('J', dateArr[0]);
		f = document.getElementById(cal['inputFieldId']);
		if(f != null) f.value = m;
		if(cal['hideOnClick']) document.getElementById('calendarWrap'+cal['id']).style.display = 'none';
		else me.CalContentInit(nb);

	}else{
		me.CalContentInit(nb);
	}
	// callback
	if(typeof cal['callBack'] === "function") cal['callBack'](dateStr);
}
//
// affiche le titre
//
me.CalShowTitle = function(nb){
	if(typeof me.jsSDPObj[nb] == 'undefined') return 0;
	var e = document.getElementById('calendarTitle'+me.jsSDPObj[nb]['id']);
	if(!e) return 0;
	var cal = me.jsSDPObj[nb];
	var m = cal['titleMask'];
	if(m == '') return 0;
	var d = cal['dateDisp'].getMonth();
	m = m.replace('MM', parseInt(d, 10) < 10 ? '0'+[d]:[d]);
	m = m.replace('M', cal['monthLst'][d]);
	d = cal['dateDisp'].getFullYear();
	m = m.replace('AAAA', d);
	m = m.replace('AA', d.toString().substr(2,2));
	e.innerHTML = m;
}
//
// crÃ©e un element DOM
//
me.DomElementInit = function(type, opt){
	var e = document.createElement(type);
	if(opt.id != undefined) e.id = opt.id;
	if(opt.class != undefined) e.className = opt.class;
	if(opt.type != undefined) e.type = opt.type;
	if(opt.value != undefined) e.value = opt.value;
	if(opt.content != undefined) e.innerHTML = opt.content;
	if(opt.parent != undefined) opt.parent.appendChild(e);
	return e;
}
return me;
}
