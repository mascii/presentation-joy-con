(() => {
    const [LEFT_BUTTON, RIGHT_BUTTON] = [0, 3];
    const [LEFT_ARROW_KEY_CODE, RIGHT_ARROW_KEY_CODE] = [37, 39];

    let isPressing = false;
    const pressKey = keyCode => {
        if (isPressing) {
            return;
        }

        const activeElement = document.activeElement;
        const global = activeElement.tagName === 'IFRAME' ? activeElement.contentWindow : window;
        ['keydown', 'keyup'].forEach(typeArg => {
            [global.document, global].forEach(target => {
                target.dispatchEvent(new KeyboardEvent(typeArg, { keyCode }));
            });
        });

        isPressing = true;
    };
    setInterval(() => {
        const gamepad = [].find.call(navigator.getGamepads(), gamepad => gamepad !== null);
        if (gamepad) {
            const buttons = gamepad.buttons;
            if (buttons[LEFT_BUTTON].pressed) {
                pressKey(LEFT_ARROW_KEY_CODE);
                return;
            } else if (buttons[RIGHT_BUTTON].pressed) {
                pressKey(RIGHT_ARROW_KEY_CODE);
                return;
            }
        }
        isPressing = false;
    }, 1000 / 60);
})();
