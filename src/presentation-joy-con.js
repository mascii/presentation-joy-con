((document, navigator, addEventListener) => {
    const VENDOR_ID = '057e';
    const DEVICE_ID = '2006';
    const LEFT_BUTTON = 0
    const RIGHT_BUTTON = 3;
    const CAPTURE_BUTTON = 16;
    const LEFT_ARROW_KEY_CODE = 37;
    const RIGHT_ARROW_KEY_CODE = 39;

    const pressKey = keyCode => {
        const activeElement = document.activeElement;
        const targetDocument = activeElement.tagName === 'IFRAME' ? activeElement.contentDocument : document;
        ['keydown', 'keyup'].forEach(typeArg => {
            targetDocument.body.dispatchEvent(new KeyboardEvent(typeArg, { keyCode, bubbles: true }));
        });
    };

    const playEffect = ({ vibrationActuator }, startDelay, duration) => {
        if (vibrationActuator) {
            return vibrationActuator.playEffect(vibrationActuator.type, {
                startDelay,
                duration,
                strongMagnitude: 0.8,
            });
        }
        return Promise.resolve();
    };

    let gamepadIndex, intervalID;

    addEventListener('gamepadconnected', ({ gamepad }) => {
        if (gamepadIndex != null || !gamepad.id.includes(VENDOR_ID) || !gamepad.id.includes(DEVICE_ID)) {
            return;
        }
        gamepadIndex = gamepad.index;

        let isPressing = false;
        intervalID = setInterval(() => {
            isPressing = (gamepad => {
                const buttons = gamepad.buttons;
                if (buttons[LEFT_BUTTON].pressed) {
                    !isPressing && pressKey(LEFT_ARROW_KEY_CODE);
                    return true;
                } else if (buttons[RIGHT_BUTTON].pressed) {
                    !isPressing && pressKey(RIGHT_ARROW_KEY_CODE);
                    return true;
                } else if (buttons[CAPTURE_BUTTON].pressed) {
                    !isPressing && playEffect(gamepad, 0, 10);
                    return true;
                }
                return false;
            })(navigator.getGamepads()[gamepadIndex]);
        }, 1000 / 60);
    });
    addEventListener('gamepaddisconnected', e => {
        if (gamepadIndex === e.gamepad.index) {
            clearInterval(intervalID);
            gamepadIndex = intervalID = null;
        }
    });

    if (navigator.wakeLock) {
        const requestWakeLock = isFirstRequest => {
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
})(document, navigator, addEventListener);
