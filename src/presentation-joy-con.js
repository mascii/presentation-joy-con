(() => {
    const [leftButton, rightButton] = [0, 3];
    const [leftArrowKeyCode, rightArrowKeyCode] = [37, 39];

    let isPressing = false;
    const pressKey = keyCode => {
        if (isPressing) {
            return;
        }

        const activeElement = document.activeElement;
        const global = document.activeElement.tagName === 'IFRAME' ? activeElement.contentWindow : window;
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
            if (buttons[leftButton].pressed) {
                pressKey(leftArrowKeyCode);
                return;
            } else if (buttons[rightButton].pressed) {
                pressKey(rightArrowKeyCode);
                return;
            }
        }
        isPressing = false;
    }, 1000 / 60);
})();
