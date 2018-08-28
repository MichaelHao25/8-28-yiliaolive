require.config({
	paths: {
		'jquery': "jquery",
		//jquery默认加载
		"js": "js"
	}
})



define(['jquery'], function($) {
	var media = document.createElement('style')
	media.innerHTML = ".cp{cursor: pointer;}";
	document.getElementsByTagName('head')[0].appendChild(media);
	$('body *[href]').addClass('cp');
	$('body *[href]').on('click', function() {
		if ($(this).attr('target')) {
			window.open($(this).attr('href'));
		} else {
			window.location.href = $(this).attr('href');
		}
	});
})
