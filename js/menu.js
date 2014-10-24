var currentSection = 0;
var numberOfSections = 5;
var windowWidth = $(window).width();

var canChangeSection = false;

updateCurrentSection();

$("#menu-0").click(function()
{
	changeSection(0);
});
$("#menu-1").click(function()
{
	changeSection(1);
});
$("#menu-2").click(function()
{
	changeSection(2);
});
$("#menu-3").click(function()
{
	changeSection(3);
});
$("#menu-4").click(function()
{
	changeSection(4);
});

// Functions

function changeSection(newSection)
{
	if(currentSection != newSection && canChangeSection)
	{
		canChangeSection = false;
		
		//Rotate 3D camera and move glow
		switch(newSection)
		{
			case 0:
				if(WebGLEnabled) changeCameraAngle(0.0);
				$("#menu_selection_glow").animate({ left: 83 }, 2000);
				break;
			case 1:
				if(WebGLEnabled) changeCameraAngle(-0.25);
				$("#menu_selection_glow").animate({ left: 252 }, 2000);
				break;
			case 2:
				if(WebGLEnabled) changeCameraAngle(-0.5);
				$("#menu_selection_glow").animate({ left: 421 }, 2000);
				break;
			case 3:
				if(WebGLEnabled) changeCameraAngle(-0.75);
				$("#menu_selection_glow").animate({ left: 590 }, 2000);
				break;
			case 4:
				if(WebGLEnabled) changeCameraAngle(-1.0);
				$("#menu_selection_glow").animate({ left: 759 }, 2000);
				break;
		}
		
		var oldSectionDiv = "#section-" + currentSection;
		var newSectionDiv = "#section-" + newSection;
		
		//Move sections right to left
		if(newSectionDiv > oldSectionDiv)
		{
			//Make disappear current section
			$(oldSectionDiv).animate({ left: -1920  - 960 }, 2000, function()
			{
				$(oldSectionDiv).css("display", "none");
			});
			
			$(newSectionDiv).css("left", windowWidth + 1920);
		}
		
		//Move sections left to right
		if(newSectionDiv < oldSectionDiv)
		{
			//Make disappear current section
			$(oldSectionDiv).animate({ left: windowWidth + 1920 }, 2000, function()
			{
				$(oldSectionDiv).css("display", "none");
			});
			
			$(newSectionDiv).css("left", -1920 - 960);
		}
		
		//Make appear the new section
		$(newSectionDiv).css("display", "inline");
		$(newSectionDiv).animate({ left: getSectionCenter() }, 2000, function()
		{
			//Animation finished, so we can change section again
			canChangeSection = true;
		});
		
		currentSection = newSection;
	}
}

function updateCurrentSection()
{
	$("#section-" + currentSection).css("left", getSectionCenter());
}

function getSectionCenter()
{
	return (windowWidth / 2) - 480;
}


//Handle window resize
$(window).resize(function()
{
	windowWidth = $(window).width();
	updateCurrentSection();
});