import $ from 'jquery'

$(function(){
	$('.box').click(function(){
		$(this).css('background', 'red');
	});
});