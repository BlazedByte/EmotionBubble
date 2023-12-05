var gradient = "linear-gradient(90deg, #ff9a9e 0%, #fad0c4 50%, #fad0c4 100%)";

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('click-emotion')) {
        event.target.parentNode.classList.add('status-on');
        if (event.target.classList.contains('happy')) {
            // Edit the style of an element
            document.getElementById('bubble').style.background = gradient;
        }
        else if (event.target.classList.contains('sad')) {
            document.getElementById('bubble').style.background = 'blue';
        }
        else if (event.target.classList.contains('angry')) {
            document.getElementById('bubble').style.background = 'red';
        }
        else if (event.target.classList.contains('calm')) {
            document.getElementById('bubble').style.background = 'grey';
        }
        else if (event.target.classList.contains('tired')) {
            document.getElementById('bubble').style.background = 'yellow';
        }
    }
    else {
        console.log("not clicked on a truc : ->" + event.target.classList);
    }
});
