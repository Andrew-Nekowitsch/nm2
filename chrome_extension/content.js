const friendButton = document.querySelector("#left-sidebar-menu > div:nth-child(1) > a:nth-child(3)")

if (friendButton) {
    friendButton.addEventListener('click', () => toggleFriendChallengeErrors());
}

const toggleFriendChallengeErrors = () => {
    const elems = document.getElementsByClassName('c-overlay-message');
    for (let i = 0; i < elems.length; i++) {
        if (elems[i]) {
            elems[i].style.display = 'none';
        }
    }

    const elems2 = document.getElementsByClassName('c-overlay');
    for (let i = 0; i < elems2.length; i++) {
        if (elems2[i]) {
            elems2[i].style.display = 'none';
        }
    }
}


const rKeyHandler = () => {
    let retryButton = document.getElementsByClassName('pm-battle-buttons__retry')[0];
    if (retryButton) {
        retryButton.click();
    }
}
const sKeyHandler = () => {
    let skipButton = document.getElementsByClassName('pm-battle-buttons__skip')[0];
    if (skipButton) {
        skipButton.click();
    }
}
const fKeyHandler = () => {
    let finishButton = document.getElementsByClassName('pm-battle-buttons__finish')[0];
    if (finishButton) {
        finishButton.click();
    }
}
const spaceKeyHandler = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    let closeButton = document.getElementsByClassName('c-overlay-message__close')[0];
    if (closeButton) {
        closeButton.click();
    }
}

document.addEventListener('keypress', function (e) {
    if (e.key === 'r' || e.key === 'R') {
        rKeyHandler();
    } else if (e.key === 's' || e.key === 'S') {
        sKeyHandler();
    } else if (e.key === 'f' || e.key === 'F') {
        fKeyHandler();
    } else if (e.key === ' ' || e.key === 'Space') {
        spaceKeyHandler(e);
    }
});