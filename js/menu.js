var currentSection = 0;
var windowWidth = $(window).width();

var canChangeSection = false;
var sectionPositions = [83, 252, 421, 590, 759];
var sectionNames = ['main', 'download', 'guides', 'screenshots', 'about'];
var numberOfSections = sectionPositions.length;
var totalSections = sectionPositions.length;
var DEVEL = document.location.host == '127.0.0.1:9090';

updateCurrentSection();

$('.menuitem').click(function(e) {
    var index = parseInt($(e.target).data('index'));
    changeSection(index);
});

if (true) {
    $('.menuitem').on('mouseover', function(e) {
        var index = parseInt($(e.target).data('index'));
		if(index != currentSection) $("#menu_selection_hover").animate({ left: sectionPositions[index] }, 0).show(0);
    }).on('mouseout', function(e) {
        var index = parseInt($(e.target).data('index'));
        $("#menu_selection_hover").hide(0);
    });
}

// Functions

function showInitialSection() {
    var sectionName = document.location.hash.replace(/^#/, '');
    var delayTime = 1500;
    var transitionTime = 1000;

    if (DEVEL) {
        delayTime = 0;
        transitionTime = 200;
    }

    if (sectionName == '' || sectionName == 'main') {
        currentSection = 0;
        $("#section-0").delay(delayTime).fadeIn(transitionTime, function()
        {
            canChangeSection = true;
        });
    } else {
        currentSection = sectionNames.indexOf(sectionName);
        currentSection = Math.min(Math.max(currentSection, 0), totalSections -1);

        //currentSection = 2;

        $("#section-" + currentSection).delay(delayTime).fadeIn(transitionTime, function()
        {
            canChangeSection = true;
        });
		
		if(WebGLEnabled) changeCameraAngle(-1.0 * currentSection / totalSections);
    }

    $("#menu_selection_glow").css("left", sectionPositions[currentSection]);
    $('.menuitem').toggleClass('selected', false);
    $(".menuitem[data-index='" + currentSection + "']").toggleClass('selected', true);
    updateCurrentSection();
}

function changeSection(newSection)
{
	if (currentSection == newSection || !canChangeSection) return;

    canChangeSection = false;

    var transitionTime = 2000;

    if (DEVEL) {
        transitionTime = 300;
    }

    //Rotate 3D camera and move glow
	var cameraAngle = -1.0 * newSection / totalSections;
    if(WebGLEnabled) changeCameraAngle(cameraAngle, transitionTime);
    $('.menuitem').toggleClass('selected', false);
    $("#menu_selection_glow").animate({ left: sectionPositions[newSection] }, transitionTime);
    setTimeout(function() {
        $(".menuitem[data-index='" + newSection + "']").toggleClass('selected', true);
    }, transitionTime - 400);

    var oldSectionDiv = "#section-" + currentSection;
    var newSectionDiv = "#section-" + newSection;

    //Move sections right to left
    if(newSectionDiv > oldSectionDiv)
    {
        //Make disappear current section
        $(oldSectionDiv).animate({ left: -1920  - 960 }, transitionTime, function()
        {
            $(oldSectionDiv).css("display", "none");
        });

        $(newSectionDiv).css("left", windowWidth + 1920);
    }

    //Move sections left to right
    if(newSectionDiv < oldSectionDiv)
    {
        //Make disappear current section
        $(oldSectionDiv).animate({ left: windowWidth + 1920 }, transitionTime, function()
        {
            $(oldSectionDiv).css("display", "none");
        });

        $(newSectionDiv).css("left", -1920 - 960);
    }

    //Make appear the new section
    $(newSectionDiv).css("display", "block");
    $(newSectionDiv).animate({ left: getSectionCenter() }, transitionTime, function()
    {
        //Animation finished, so we can change section again
        canChangeSection = true;
    });

    currentSection = newSection;
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