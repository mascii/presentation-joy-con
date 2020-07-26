(() => {
    const VENDOR_ID = '057e';
    const DEVICE_ID = '2006';
    const [LEFT_BUTTON, RIGHT_BUTTON] = [0, 3];
    const [LEFT_ARROW_KEY_CODE, RIGHT_ARROW_KEY_CODE] = [37, 39];

    let gamepadIndex, intervalID, isPressing = false;

    const pressKey = keyCode => {
        if (isPressing) {
            return;
        }

        const activeElement = document.activeElement;
        const targetDocument = activeElement.tagName === 'IFRAME' ? activeElement.contentDocument : document;
        ['keydown', 'keyup'].forEach(typeArg => {
            targetDocument.body.dispatchEvent(new KeyboardEvent(typeArg, { keyCode, bubbles: true }));
        });

        isPressing = true;
    };

    addEventListener('gamepadconnected', e => {
        const gamepadId = e.gamepad.id;
        if (gamepadIndex != null || !gamepadId.includes(VENDOR_ID) || !gamepadId.includes(DEVICE_ID)) {
            return;
        }
        gamepadIndex = e.gamepad.index;
        intervalID = setInterval(() => {
            const buttons = navigator.getGamepads()[gamepadIndex].buttons;
            if (buttons[LEFT_BUTTON].pressed) {
                pressKey(LEFT_ARROW_KEY_CODE);
                return;
            } else if (buttons[RIGHT_BUTTON].pressed) {
                pressKey(RIGHT_ARROW_KEY_CODE);
                return;
            }
            isPressing = false;
        }, 1000 / 60);
    });
    addEventListener('gamepaddisconnected', e => {
        if (gamepadIndex === e.gamepad.index) {
            clearInterval(intervalID);
            gamepadIndex = intervalID = null;
        }
    });

    if (navigator.wakeLock) {
        const requestWakeLock = (isFirstRequest) => {
            if (document.visibilityState !== 'visible') {
                return;
            }
            navigator.wakeLock.request('screen').then(() => {
                if (isFirstRequest) {
                    document.addEventListener('visibilitychange', requestWakeLock);
                    document.addEventListener('fullscreenchange', requestWakeLock);
                }
            }).catch(() => {});
        };
        requestWakeLock(true);
    }
})();
