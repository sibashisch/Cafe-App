function validateRegistrationForm () {
	try {
		$('#unameAlert').hide();
		$('#emailAlert').hide();

		var uname = $('#uname').val();
		var mail = $('#email').val();

		if (uname.replace(/ /g, '') === '') {
			$('#uname').select();
			$('#uname').focus();
			$('#unameAlert').show();
			return false;
		} else if(mail.replace(/ /g, '') === '' || mail.indexOf('@') === -1 || mail.indexOf('.') === -1) {
			$('#email').select();
			$('#email').focus();
			$('#emailAlert').show();
			return false;
		} else if($('#utype').val() === 'ADMIN') {
			var choice = confirm ('Are you sure that you want to create an admin user?');
			if (choice) {
				$('#loginSubmit').attr ('disabled', 'disabled');
				$('#loginSubmit').addClass ('disabled');
			}
			return choice;
		} else {
			$('#loginSubmit').attr ('disabled', 'disabled');
			$('#loginSubmit').addClass ('disabled');
			return true;
		}
	} catch (err) {
		try {
			console.log (err);
		} catch (ignore) {}
		return false;
	}
}

function validateLoginForm () {
	try {
		$('#unameAlert').hide();
		$('#pswdAlert').hide();

		var uname = $('#uname').val();
		var pswd = $('#pswd').val();

		if (uname.replace(/ /g, '') === '') {
			$('#uname').select();
			$('#uname').focus();
			$('#unameAlert').show();
			return false;
		} else if(pswd.replace(/ /g, '') === '') {
			$('#pswd').select();
			$('#pswd').focus();
			$('#pswdAlert').show();
			return false;
		} else {
			$('#loginSubmit').attr ('disabled', 'disabled');
			$('#loginSubmit').addClass ('disabled');
			return true;
		}
	} catch (err) {
		try {
			console.log (err);
		} catch (ignore) {}
		return false;
	}
}

function chkFrm () {

	var qTxt = $('#questionText').val();
	var aTxt = $('#optnAText').val();
	var bTxt = $('#optnBText').val();
	var cTxt = $('#optnCText').val();
	var dTxt = $('#optnDText').val();

	var qExpr = $('#quesSvg').val();
	var aExpr = $('#optnASvg').val();
	var bExpr = $('#optnBSvg').val();
	var cExpr = $('#optnCSvg').val();
	var dExpr = $('#optnDSvg').val();

	if (qTxt.replace(/ /g, '') === '' && qExpr.replace(/ /g, '') === '') {
		alert ('Please Enter Question Text or Expression and convert expression (if any)');
		return false;
	}

	if (aTxt.replace(/ /g, '') === '' && aExpr.replace(/ /g, '') === '') {
		alert ('Please Enter Option A Text or Expression and convert expression (if any)');
		return false;
	}

	if (bTxt.replace(/ /g, '') === '' && bExpr.replace(/ /g, '') === '') {
		alert ('Please Enter Option B Text or Expression and convert expression (if any)');
		return false;
	}

	if (cTxt.replace(/ /g, '') === '' && cExpr.replace(/ /g, '') === '') {
		alert ('Please Enter Option C Text or Expression and convert expression (if any)');
		return false;
	}

	if (dTxt.replace(/ /g, '') === '' && dExpr.replace(/ /g, '') === '') {
		alert ('Please Enter Option D Text or Expression and convert expression (if any)');
		return false;
	}

	return confirm ('Are you sure that you want to save this question?');
}

function previewQs (srcTxt, destDiv, svgId) {
	var mathMlExpr = $('#' + srcTxt).val();
	if (mathMlExpr === '') {
		$('#' + svgId).val ('');
		$('#' + destDiv).html ('');
	} else {
		$('#' + destDiv).html ('Loading Preview');
		$.ajax ({
			url: '/mathpreview',
			method: 'post',
			data: {mml: mathMlExpr},
			success: function (data) {
				$('#' + destDiv).html (data);
				$('#' + svgId).val (data);
			},
			error: function (jqXhr, exception) {
				$('#' + destDiv).html ('Failed To Load Preview');
				console.log (jqXhr);
				console.log (exception);
			}
		});
	}
}

function chg (opn) {
	$('#'+opn+"Svg").val ('');
	$('#'+opn+"Preview").html ('');
}