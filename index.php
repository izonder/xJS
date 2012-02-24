<?php

define('BR', "\n");
$x = new xJSDemo;

class xJSDemo
{
	function __construct()
	{
		//добавим реалистичности
		sleep(3);
		$fn = $_REQUEST['fn'];
		$this->$fn();
	}

	function __call($f, $p)
	{
		$this->_log();
	}

	function _log()
	{
		$log = date('Y-m-d H:i:s') . " - " . json_encode($_REQUEST) . BR;
		file_put_contents('xjs.log', $log, FILE_APPEND);
	}

	function autocomplete()
	{
		$t = $_REQUEST['term'];
		$list = array(
			"ActionScript",
			"AppleScript",
			"Asp",
			"BASIC",
			"C",
			"C++",
			"Clojure",
			"COBOL",
			"ColdFusion",
			"Erlang",
			"Fortran",
			"Groovy",
			"Haskell",
			"Java",
			"JavaScript",
			"Lisp",
			"Perl",
			"PHP",
			"Python",
			"Ruby",
			"Scala",
			"Scheme"
		);

		$result = array();
		foreach($list as $v) {
			if(preg_match("`^{$t}`si", $v)) $result[] = $v;
		}

		echo json_encode($result);
	}

	function submit()
	{
		switch($_REQUEST['handler']) {

			case 'default.default':
				echo '<h1>Ваша форма успешно отправлена!</h1>';
				echo '<p>Параметры формы: </p><pre>'; print_r($_REQUEST); echo '</pre>';
				break;

			default: echo file_get_contents('ajax.html');
		}
	}

	function autosave()
	{
		$r = array();
		$v = $_REQUEST['value'];
		if(preg_match('`^[0-9]+$`si', $v)) $r['result'] = true;
			else $r['result'] = false;
		echo json_encode($r);
	}
}