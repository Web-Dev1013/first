// Define constants
// var PODCAST = '.podcast';

var id = [];  //When click podcast__episode, push "data-id" attribute of Selected element in Array called "id" due to identify which podcast is selected. 
var flag = true;  // when Click again selected podcast, flag = true, if no, flag = false
var EPISODE = '.podcast__episode';
// Open state constants
// var OPEN_STATE = 'podcast__episode__open';
// var OPEN_STATE_CLASS = '.podcast__episode__open';
var THUMBNAIL_IMG_CONTAINER = '.podcast__episode__thumbnail-container__img-container';
// var THUMBNAIL_IMG = '.podcast__episode__thumbnail-container__img-container__img';
var HOVER_CONTAINER = 'podcast__episode__thumbnail-container__img-container__hover';
// var PLAY_BUTTON = '.podcast__episode__thumbnail-container__img-container__play';
// var PAUSE_BUTTON = 'podcast__episode__thumbnail-container__img-container__play__paused';

// var PC_EPISODE = document.('podcast__episode');
var PC_AUDIO_ALL = document.querySelectorAll('.podcast__episode__audio');
var PC_EPISODE_ALL = document.querySelectorAll('.podcast__episode');
var PC_DURATION_ALL = document.querySelectorAll('.podcast__episode__content-container__points-container__duration');
// var PC_EPISODE = document.querySelector('.podcast__episode');
// var PC_AUDIO = document.querySelector('.podcast__episode__audio'); // id for audio element
var PC_BUTTON = document.querySelectorAll('.podcast__episode__thumbnail-container__img-container__button'); // play button
var PC_PLAYHEAD = document.querySelectorAll('.podcast__episode__audio-player__timeline__playhead'); // playhead
var PC_PLAYHEAD_PROGRESS = document.querySelectorAll('.podcast__episode__audio-player__timeline__progress'); // background
var PC_TIMELINE = document.querySelectorAll('.podcast__episode__audio-player__timeline'); // timeline
var PC_TOTAL_TIME = document.querySelectorAll('.podcast__episode__audio-player__time-container__total-time');
var pcTimelineWidth;
// Define variables
// var clickCount = 1;
// on page load initialise all episodes
// loop through all
// attach listeners to each player
// switch between closed and open podcasts
// event listener metadata loaded
// attach listener to audio files
// add total time to inner html


window.addEventListener('load', init);

// ABOVE COMPLETED, need to add the below in
// ensure currentime is set
// link up warning pop up when you click another podcast
// disable podcasts when metadata not loaded
/////When Brower is building, Init function is called automatically.
function init() {
    for(var i = 0; i < PC_AUDIO_ALL.length; i++){
        PC_DURATION_ALL.item(i).innerHTML = PC_AUDIO_ALL.item(i).duration;
    }

}


$(function () {

    id.push($(".podcast__episode:eq(0)").attr("data-id"));
    $(".podcast__warning").addClass("hide"); //When building, Hide Wrong Popup. 
    ///When click in PodCast.
    $(".podcast__episode").click(function (e) {
        if ($(e.target).hasClass("podcast__episode")) {  /// identify current podcast__dpisode is alerady display. 
            if (id[id.length - 1] === ($(e.target).attr("data-id"))) { // when "data-id" of selected element is equal last value of "id" array, it's mean currently selected element is selected again. So flag  = true.
                flag = true;
            }
            else {
                id.push($(e.target).attr("data-id"));   ///Not equal, flag = false
                flag = false;
            }
            /// in above code, to use if ~ else statement, it is the value of e.target is podcast__episode or at least its'finds.
        }
        else {
            if (id[id.length - 1] === ($(e.target).parents(".podcast__episode").attr("data-id"))) {
                flag = true;
            }
            else {
                id.push($(e.target).parents(".podcast__episode").attr("data-id"));
                flag = false;
            }
        }
        if (e.target.className.indexOf("podcast__episode__thumbnail-container__img-container__play") > -1) {
            // identify selected element is play button.
            if (flag === false && id.length > 2) {  // identify When click play button, after building, identify it is first click.
                $(".podcast__warning").removeClass("hide");  // if not so, display warning popup.
                $("audio").each(function () {  //every Audio element is paused.
                    this.pause();  
                });
            }
            else {
                for (var i = 0; i < $(".podcast__episode").length; i++) {   
                    $(".podcast__episode:eq(" + i + ")").removeClass("podcast__episode__open");
                }
                $(e.target).parents("div.podcast__episode").onclick = elmClicked;
                $(e.target).parents("div.podcast__episode").addClass("podcast__episode__open");        
                playAudio();
            }
        }
        else if (e.target.className.indexOf("podcast__episode__audio-player__timeline") > -1) {
            moveplayhead(e);
            var selectedTime = ($("[data-id=" + id[id.length - 1] + "]").find("audio")[0].duration) * clickPercent(e);
            $("[data-id=" + id[id.length - 1] + "]").find("audio")[0].currentTime = selectedTime;
        }
        else {
            if (flag !== true) {
                for (var j = 0; j < $(".podcast__episode").length; j++) {
                    if ($(".podcast__episode:eq(" + j + ")").hasClass("podcast__episode__open")) {
                        $(".podcast__warning").removeClass("hide");
                        $("audio").each(function () {
                            this.pause();
                        });
                    }
                }
            }
        }
    })
//// When click stop button on warning Popup.
    $(".podcast__warning__popup__close").click(function () {
        $(".podcast__warning").addClass("hide");
        for (var i = 0; i < $(".podcast__episode").length; i++) {
            if ($(".podcast__episode:eq(" + i + ")").hasClass("podcast__episode__open")) {
                $(".podcast__episode:eq(" + i + ")").removeClass("podcast__episode__open");
            }
        }
        $("[data-id=" + id[id.length - 1] + "]").find("audio")[0].pause();
        $("[data-id=" + id[id.length - 1] + "]").find("audio")[0].onclick = elmClicked;
        $("[data-id=" + id[id.length - 1] + "]").addClass("podcast__episode__open");
        playAudio();
    });
/// When click continue button on warning Popup.
    $(".podcast__warning__popup__button").click(function () {
        id.pop();
        $(".podcast__warning").addClass("hide");
        $("[data-id=" + id[id.length - 1] + "]")[0].onclick = elmClicked;
        playAudio();
    });


    /////////Dragable Timeline header//////////////
    var draggable = $('.podcast__episode__audio-player__timeline__playhead'); // Timeline Header element 

    draggable.on('mousedown', function (e) {
        var dr = $(this).addClass("drag").css("cursor", "move");
        // width = dr.outerWidth();
        // xpos = dr.offset().left + width - e.pageX;
        $("body").on('mousemove', function (e) {
            var getPos = $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline")[0].getBoundingClientRect().left;
            if (dr.hasClass("drag")) {
                $("[data-id=" + id[id.length - 1] + "]").find("audio")[0].currentTime = $("[data-id=" + id[id.length - 1] + "]").find("audio")[0].duration * (e.pageX - getPos) / 720;

                var newMargLeft = e.pageX - getPos;
                if (newMargLeft >= 0 && newMargLeft <= 732) {
                    $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline__progress").css("width", newMargLeft*100/window.innerWidth + "%");
                    $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline__playhead").css("left",  newMargLeft + "px");
                }
                if (newMargLeft < 0) {
                    $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline__progress").css("width", 0);
                    $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline__playhead").css("left",  0);
                }
                if (newMargLeft > pcTimelineWidth) {
                    $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline__progress").css("width", pcTimelineWidth*100/window.innerWidth + "px");
                    $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline__playhead").css("left", pcTimelineWidth + "px") ;
                }
            }
        }).on('mouseup', function () {
            dr.removeClass("drag");
        });
    });
////////////////////////////////////////////
    // Countdown
    setInterval(function () {
        var timeleft = $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__time-container__time-left")[0];
        var duration = parseInt($("[data-id=" + id[id.length - 1] + "]").find("audio")[0].duration);
        var currentTime = parseInt($("[data-id=" + id[id.length - 1] + "]").find("audio")[0].currentTime);
        var timeLeft = duration - currentTime;
        var s;
        var m;

        s = timeLeft % 60;
        m = Math.floor(timeLeft / 60) % 60;

        s = s < 10 ? "0" + s : s;
        m = m < 10 ? "0" + m : m;

        timeleft.innerHTML = m + ":" + s;

    }, 10);

    // Countup
    setInterval(function () {
        var timeline = $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__time-container__current-time")[0];
        var s = parseInt($("[data-id=" + id[id.length - 1] + "]").find("audio")[0].currentTime % 60);
        var m = parseInt(($("[data-id=" + id[id.length - 1] + "]").find("audio")[0].currentTime / 60) % 60);

        if (s < 10) {
            timeline.innerHTML = m + ':0' + s;
        } else {
            timeline.innerHTML = m + ':' + s;
        }

    }, 10);
});

function elmClicked() {
    this.setAttribute('data-pc-playing', 'true');
    this.classList.add("podcast__episode__open");
}

// when not focused on player stop audio
// window.addEventListener('blur', stopAudio);


// timeupdate event listener
// PC_AUDIO_ALL.item(id).addEventListener("timeupdate", timeUpdate(), false);
setInterval(timeUpdate, 10);

// makes timeline clickable
$("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline").click(function (event) {
    moveplayhead(event);
    $("[data-id=" + id[id.length - 1] + "]").find("audio")[0].currentTime = $("[data-id=" + id[id.length - 1] + "]").find("audio")[0].duration * clickPercent(event);
}, false);

// returns click as decimal (.77) of the total timelineWidth
function clickPercent(event) {
    return (event.clientX - getPosition($("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline")[0])) / 720;
}

// makes playhead draggable
// PC_PLAYHEAD.item(id[id.length - 1]).addEventListener('mousedown', mouseDown, false);
// window.addEventListener('mouseup', mouseUp, false);

// Boolean value so that audio position is updated only when the playhead is released
// var onplayhead = false;

// mouseDown EventListener
// function mouseDown() {
//     onplayhead = true;
//     window.addEventListener('mousemove', moveplayhead, true);
//     PC_AUDIO_ALL.item(id[id.length - 1]).removeEventListener('timeupdate', timeUpdate, false);
// }

// mouseUp EventListener
// getting input from all mouse clicks
// function mouseUp(event) {
//     console.log("U123")
//     if (onplayhead == true) {
//         moveplayhead(event);
//         window.removeEventListener('mousemove', moveplayhead, true);
//         // change current time
//         PC_AUDIO_ALL.item(id[id.length - 1]).currentTime = PC_AUDIO_ALL.item(id[id.length - 1]).duration * clickPercent(event);
//         PC_AUDIO_ALL.item(id[id.length - 1]).addEventListener('timeupdate', timeUpdate, false);
//     }
//     onplayhead = false;
// }
// mousemove EventListener
// Moves playhead as user drags
function moveplayhead(event) {
    var newMargLeft = event.clientX - getPosition($("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline")[0]);
    if (newMargLeft >= 0 && newMargLeft <= pcTimelineWidth) {
        $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline__progress").css("width", newMargLeft*100/window.innerWidth + "%");
        $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline__playhead").css("left", newMargLeft*100/window.innerWidth + "%");
    }
    if (newMargLeft < 0) {
        $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline__progress").css("width", 0);
        $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline__playhead").css("left", 0);
    }
    if (newMargLeft > pcTimelineWidth) {
        $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline__progress").css("width", pcTimelineWidth*100/window.innerWidth + "%");
        $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline__playhead").css("left", pcTimelineWidth*100/window.innerWidth + "%"); 
    }
}

// timeUpdate
// Synchronizes playhead position with current point in audio
function timeUpdate() {
    var playPercent = 720 * ($("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio")[0].currentTime / $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio")[0].duration);
    $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline__progress").css("width", playPercent + "px");
    $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__audio-player__timeline__playhead").css("margin-left", playPercent + "px");

    if ($("[data-id=" + id[id.length - 1] + "]").find("audio")[0].currentTime == $("[data-id=" + id[id.length - 1] + "]").find("audio")[0].duration) {
    $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__thumbnail-container__img-container__button").removeClass("podcast__episode__thumbnail-container__img-container__paused");
    }
}

//Play and Pause
function playAudio() {
    // start PC_AUDIO
    if ($("[data-id=" + id[id.length - 1] + "]").find("audio")[0].paused) {
        $("[data-id=" + id[id.length - 1] + "]").find("audio")[0].play();

        // remove play, add pause
        $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__thumbnail-container__img-container__button").addClass("podcast__episode__thumbnail-container__img-container__paused");
    } else { // pause PC_AUDIO
        $("[data-id=" + id[id.length - 1] + "]").find("audio")[0].pause();

        // remove pause, add play
        $("[data-id=" + id[id.length - 1] + "]").find(".podcast__episode__thumbnail-container__img-container__button").removeClass("podcast__episode__thumbnail-container__img-container__paused");
    }
}

// getPosition
// Returns elements left position relative to top-left of viewport
function getPosition(el) {
    return el.getBoundingClientRect().left;
}

// Stops audio on unfocus
function stopAudio() {
    $("[data-id=" + id[id.length - 1] + "]").find("audio")[0].pause();
    $("[data-id=" + id[id.length - 1] + "]").find("audio")[0].currentTime = -1;
    // PC_AUDIO_ALL.item(id).volume = 0;
}

// if above 769px action function
if ($(window).width() > 769) {
    // On episode hover add hover class to thumbnail container
    $(EPISODE).hover(
        function () {
            $(this).find(THUMBNAIL_IMG_CONTAINER).addClass(HOVER_CONTAINER);
        },
        function () {
            $(this).find(THUMBNAIL_IMG_CONTAINER).removeClass(HOVER_CONTAINER);
        }
    );
}