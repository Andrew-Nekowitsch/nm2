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


const challengeFriends = (friends) => {
    if (!friends) {
        console.error('Friends list not found');
        return;
    }
    const friend = friends.getElementsByClassName('-color-yes')[0];
    if (friend) {
        friend.click();
    }
}
const challengeReturn = () => {
    const returnButtons = document.getElementsByClassName('-icon-challenge-return');
    if (!returnButtons || returnButtons.length === 0) {
        console.error('No challenges to return');
        return;
    }

    const challengeButton = returnButtons[0];
    if (challengeButton) {
        challengeButton.click();
    }
}


const qKeyHandler = () => {
    const friends = document.getElementById('friends-list');
    if (friends) {
        challengeFriends(friends);
    } else {
        challengeReturn();
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
const spaceKeyHandler = () => {
    let closeButton = document.getElementsByClassName('c-overlay-message__close')[0];
    if (closeButton) {
        closeButton.click();
    }
}

document.addEventListener('keypress', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const key = e.key.toLowerCase();
    const keyHandler = keyFactory(key);
    keyHandler(e);
});

const handlers = {
    'q': qKeyHandler,
    'r': rKeyHandler,
    's': sKeyHandler,
    'f': fKeyHandler,
    ' ': spaceKeyHandler
}

const keyFactory = (key) => {
    return (e) => {
        if (e.key === key || e.key === key.toUpperCase()) {
            handlers[key.toLowerCase()]();
        }
    };
}