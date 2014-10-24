//Run the whole thing only on WebGL capable browsers
var WebGLEnabled;
if (Detector.webgl)	WebGLEnabled = true;
else WebGLEnabled = false;

$(window).load(function()
{
	$(".section-content-frame").mCustomScrollbar(
	{
		scrollInertia: 200
	});
});