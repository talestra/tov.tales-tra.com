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

//Guías
function loadGuide(url, id)
{
	$.ajax( url ).done(function(v)
	{
		$("#guide_container").css('position', 'relative');
		$("#guide_container").animate({ opacity: 0, left: '20px'}, 200, function()
		{
			$("a[data-type='guide']").each(function(i, e)
			{
				$(e).toggleClass('selected', ($(e).data('id') == id));
			});
			$( "#guide_container").css('left', '-20px');
			//$( ".mCSB_container").css('top', 0);
			$( "#guide_container").html(v);
			$( "#guide_container").animate({ opacity: 1, left: 0}, 200);
		});
		$(e).toggleClass('selected', ($(e).data('id') == id));
	}).fail(function(e)
	{
		$( "#guide_container").html('error:' + e);
	});
}

$("a[data-type='guide']").click(function(e)
{
	var element = $(e.target);
	loadGuide(element.attr('href'), element.data('id'));
	return false;
});

loadGuide("content/guides/secondary_missions.html", 'secondary_missions');