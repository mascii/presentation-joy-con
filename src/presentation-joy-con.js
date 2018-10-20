(() => {
    const [leftButton, rightButton] = [0, 3];
    const [leftArrowKey, rightArrowKey] = [37, 39];

    let isPressing = false;
    const keyPress = keyCode => {
        if (isPressing) {
            return;
        }

        const activeElement = document.activeElement;
        const global = document.activeElement.tagName === 'IFRAME' ? activeElement.contentWindow : window;
        [global, global.document].forEach(target => {
            ['keyup', 'keydown'].forEach(eventName => {
                target.dispatchEvent(new KeyboardEvent(eventName, { keyCode }));
            });
        });

        isPressing = true;
    };
    setInterval(() => {
        const gamepad = navigator.getGamepads()[0]
        if (gamepad) {
            const buttons = gamepad.buttons;
            if (buttons[leftButton].pressed) {
                keyPress(leftArrowKey);
                return;
            } else if (buttons[rightButton].pressed) {
                keyPress(rightArrowKey);
                return;
            }
        }
        isPressing = false;
    }, 1000 / 60);
})();
