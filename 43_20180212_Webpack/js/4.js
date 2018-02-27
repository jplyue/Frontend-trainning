import $ from 'jquery';
import a from '../asset/a.jpg';

$(function(){
	$('.box').click(function(){
		/*
		* 
		* background: `url(dist/${a})`
		* dist目录可能会改变，使用webpack-dev-server后，自动指向dist目录
		*/
		$('.box').css({
			width: '360px',
			height: '360px',
			background: `url(${a})`
		});
	});
});