jQuery(document).ready(function($) {
	var o = {
		url: "index.php?option=com_xjs&task=ajax",
		handler: 'default.default',
		wrapper: 'body',
		title: document.title,
		width: 480,
		height: 360,

		lang: {
			clear: 'Очистить',
			attention: 'Внимание!',
			required: 'Обязательное поле',
			requiredAlert: 'Форма заполнена некорректно. Заполните все обязательные поля формы!',
			autocomplete: 'Автозаполнение',
			autocompleteProcess: 'Поиск...',
			autosave: 'Автосохранение',
			autosaveProcess: 'В процессе...',
			autosaveSuccess: 'OK',
			autosaveFail: 'Ошибка'
		}
	}

	//Button init
	$("button, input[type=submit], input[type=button], .button").button().css('outline', 'none');
	$(".checkbox, .radio").buttonset();

	//Modal init
	$("<div />", {id: '-xjs-dialog'}).appendTo('body').dialog({autoOpen: false});
	$("a.modal").click(function(){
		var p = $.extend({}, o, $(this).data('xjs') || {});
		var u = $(this).attr('href');
		$.get(u, function(xhr){ $("#-xjs-dialog").html(xhr); });
		$("#-xjs-dialog").dialog('option', 'width', p.width).dialog('option', 'height', p.height).dialog('option', 'title', p.title).dialog('open');
		return false;
	});

	//Input init
	$("input[type=text], input[type=password], textarea").wrap('<div class="-xjs-textfield" />').after('<div class="-xjs-textfield-control" />');
	$("<a />", {"class": "-xjs-icon -xjs-icon-circle-close -xjs-textfield-control-clear", "data-title": o.lang.clear}).appendTo(".-xjs-textfield-control");
	$(".-xjs-textfield-control-clear").live('click', function(){
		$(this).parent(".-xjs-textfield-control").parent(".-xjs-textfield").find("input, textarea").val('');
	});

	//Other controls init
	$("select, input:radio, input:checkbox").wrap('<div class="-xjs-extra" />').after('<div class="-xjs-extra-control" />');

	//Required init
	$("<div />", {id: '-xjs-required-alert'})
	.appendTo('body')
	.dialog({
		autoOpen: false, 
		modal: true, 
		title:o.lang.attention,
		buttons: {
				OK: function() {
					$(this).dialog("close");
				}
			}
	})
	.html(o.lang.requiredAlert);

	$(".required", "form").each(function(){
	//$(".required", "body").each(function(){
		var r = $(this).parent(".-xjs-textfield, .-xjs-extra").find(".-xjs-textfield-control, .-xjs-extra-control");
		$("<a />", {"class": "-xjs-icon -xjs-icon-star -xjs-textfield-control-required", "data-title": o.lang.required}).appendTo(r);
	});
	$("form").submit(function(){
		var s = true;
		$(".required", this).each(function(){
			if(!$(this).val()) {
				$("#-xjs-required-alert").dialog('open');
				s = false;
			}
		});
		if(!s) return false;
	});

	//Autocomplete init
	$("input[type=text].autocomplete").each(function(){
		var r = $(this).parent(".-xjs-textfield, .-xjs-extra").find(".-xjs-textfield-control, .-xjs-extra-control");
		$("<a />", {"class": "-xjs-icon -xjs-icon-pencil -xjs-textfield-control-autocomplete", "data-title": o.lang.autocomplete}).appendTo(r);
		var p = $.extend({}, o, $(this).data('xjs') || {});
		var u = p.url + "&handler=" + p.handler + "&fn=autocomplete&token=" + $("#-xjs-token").val() + "&salt=" + Math.random();
		$(this).autocomplete({ 
			source: u,
			search: function(){
				var r = $(this).parent(".-xjs-textfield, .-xjs-extra").find(".-xjs-textfield-control-autocomplete");
				r.removeClass("-xjs-icon-pencil").addClass("-xjs-icon-loading").attr("data-title", o.lang.autocompleteProcess);
			},
			open: function(){
				var r = $(this).parent(".-xjs-textfield, .-xjs-extra").find(".-xjs-textfield-control-autocomplete");
				r.removeClass("-xjs-icon-loading").addClass("-xjs-icon-pencil").attr("data-title", o.lang.autocomplete);
			}
		});
	});

	//Submit init
	$(".submit").live('click', function(){
		//$(this).parents("form").eq(0).submit(function(){ return false; });
		var s = true;
		var p = $.extend({}, o, $(this).data('xjs') || {});
		$(".required", p.wrapper).each(function(){
			if(!$(this).val()) {
				$("#-xjs-required-alert").dialog('open');
				s = false;
			}
		});
		if(s) {
			var u = p.url + "&handler=" + p.handler + "&fn=submit&token=" + $("#-xjs-token").val() + "&salt=" + Math.random() + "&" + $(p.wrapper).serialize();
			$(p.wrapper).html('').addClass("-xjs-icon-loading");
			$.post(u, function(xhr){ $(p.wrapper).removeClass("-xjs-icon-loading").html(xhr); });
		}
	});

	//Autosave init
	$(".autosave").each(function(){
		var r = $(this).parent(".-xjs-textfield, .-xjs-extra").find(".-xjs-textfield-control, .-xjs-extra-control");
		$("<a />", {"class": "-xjs-icon -xjs-icon-refresh -xjs-textfield-control-autosave", "data-title": o.lang.autosave}).appendTo(r);
	})
	.live('change', function(){
		var r = $(this).parent(".-xjs-textfield, .-xjs-extra").find(".-xjs-textfield-control-autosave");
		r.removeClass("-xjs-icon-refresh -xjs-icon-check -xjs-icon-close").addClass("-xjs-icon-loading").attr("data-title", o.lang.autosaveProcess);
		var p = $.extend({}, o, $(this).data('xjs') || {});
		var u = p.url + "&handler=" + p.handler + "&fn=autosave&token=" + $("#-xjs-token").val() + "&salt=" + Math.random() + "&name=" + $(this).attr('name')  + "&value=" + $(this).val();
		if($(this).is(":checkbox")) u += "&checked=" + $(this).attr('checked');
		$.post(u, function(xhr){ 
			r.removeClass("-xjs-icon-loading");
			if(xhr && xhr.result) r.addClass("-xjs-icon-check").attr("data-title", o.lang.autosaveSuccess)
			else r.addClass("-xjs-icon-close").attr("data-title", o.lang.autosaveFail);
		}, "json");
	});

	//Tooltip init
	//NOTE: must be last!
	$("*[data-title]").addClass('-xjs-tooltip');
});