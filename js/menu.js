var currentSection = 0;
var windowWidth = $(window).width();

var canChangeSection = false;
var sectionPositions = [83, 252, 412, 590, 759];
var sectionNames = ['main', 'download', 'guides', 'screenshots', 'about'];
var numberOfSections = sectionPositions.length;
var totalSections = sectionPositions.length;

updateCurrentSection();

$('.menuitem').click(function(e) {
    var index = parseInt($(e.target).data('index'));
    changeSection(index);
});

if (true) {
    $('.menuitem').on('mouseover', function(e) {
        var index = parseInt($(e.target).data('index'));
        $("#menu_selection_hover").animate({ left: sectionPositions[index] }, 0).show(0);
    }).on('mouseout', function(e) {
        var index = parseInt($(e.target).data('index'));
        $("#menu_selection_hover").hide(0);
    });
}

// Functions

function showInitialSection() {
    var sectionName = document.location.hash.replace(/^#/, '');
    if (sectionName == '') {
        currentSection = 0;
        $("#section-0").delay(1500).fadeIn(1000, function()
        {
            canChangeSection = true;
        });
    } else {
        currentSection = sectionNames.indexOf(sectionName);
        currentSection = Math.min(Math.max(currentSection, 0), totalSections -1);

        //currentSection = 2;

        $("#section-" + currentSection).delay(0).fadeIn(0, function()
        {
            canChangeSection = true;
        });

        $("#menu_selection_glow").animate({ left: sectionPositions[currentSection] }, 0);
        updateCurrentSection();
    }
}

function changeSection(newSection)
{
	if (currentSection == newSection || !canChangeSection) return;

    canChangeSection = false;

    var cameraAngle = -1.0 * newSection / totalSections;

    //Rotate 3D camera and move glow
    if(WebGLEnabled) changeCameraAngle(cameraAngle);
    $("#menu_selection_glow").animate({ left: sectionPositions[newSection] }, 2000);

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