if(WebGLEnabled)
{
	//Start blinking
	FadeOut();
}
else
{
	finishLoading();
	//$("#loading").css("display", "none");
	//$("#loading-bg").css("display", "none");
	//$("#section-0").css("display", "inline");
}

function FadeOut()
{
	$("#loading").fadeTo(500, 0.5, FadeIn);
}
function FadeIn()
{
	$("#loading").fadeTo(500, 1.0, FadeOut);
}

function finishLoading()
{
	$("#loading").stop(true, false);
	
	$("#loading").fadeOut(500, function()
	{
		if(WebGLEnabled) initialZoomOut();
		$("#loading-bg").fadeOut(1000);
		$("#section-0").delay(1500).fadeIn(1000, function()
		{
			canChangeSection = true;
		});
	});
}