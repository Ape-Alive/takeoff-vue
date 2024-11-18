import { Win } from "..";
export default function (win, status, winEl, endCallback) {
    winEl.move.addEventListener("mousedown", function (move) {
        win.setTop();
        if (status === "max") {
            console.warn("最大化窗口无法移动");
            return;
        }
        var tW = winEl.title.offsetWidth;
        var hX = move.offsetX + tW, hY = move.offsetY;
        if (winEl.box.parentNode === document.body) {
            Win.Shade.style["position"] = "fixed";
        }
        else {
            Win.Shade.style["position"] = "absolute";
        }
        if (winEl.box.parentNode) {
            winEl.box.parentNode.appendChild(Win.Shade);
        }
        Win.Shade.onmousemove = function (shade) {
            var sX = shade.offsetX, sY = shade.offsetY;
            var left = sX - hX, top = sY - hY;
            if (top <= win.config.toTop) {
                top = win.config.toTop;
            }
            // if (left < 0) {
            //     left = 0;
            // }
            winEl.box.style["left"] = "".concat(left, "px");
            winEl.box.style["top"] = "".concat(top, "px");
        };
    });
    // winEl.box.addEventListener('click', function () {
    //     win.setTop();
    // })
    winEl.boxMask.addEventListener('click', function () {
        win.setTop();
    })
    if (win.__config.resize) {
        const leftBorderMousedown = function (mousedown) {
            win.setTop();
            if (status === "max") {
                console.warn("最大化窗口无法拉伸");
                return;
            }
            var prevX = mousedown.clientX;
            var prevY = mousedown.clientY;
            const windowDoms = document.querySelectorAll('.new-windows-box');
            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);
            function mousemove(e) {
                const rect = winEl.box.getBoundingClientRect();
                winEl.box.style.width = rect.width + (prevX - e.clientX) + 'px';
                winEl.box.style.left = rect.left - (prevX - e.clientX) + 'px';
                windowDoms.forEach(dom => {
                    dom.style.pointerEvents = 'none';
                });
                prevX = e.clientX;
                prevY = e.clientY;
            }
            function mouseup() {
                windowDoms.forEach(dom => {
                    dom.style.pointerEvents = 'auto';
                });
                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
            }

        }
        const rigthBorderMousedown = function (mousedown) {
            win.setTop();
            if (status === "max") {
                console.warn("最大化窗口无法拉伸");
                return;
            }
            var prevX = mousedown.clientX;
            var prevY = mousedown.clientY;
            const windowDoms = document.querySelectorAll('.new-windows-box');
            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);
            function mousemove(e) {
                const rect = winEl.box.getBoundingClientRect();
                winEl.box.style.width = rect.width - (prevX - e.clientX) + 'px';
                windowDoms.forEach(dom => {
                    dom.style.pointerEvents = 'none';
                });
                prevX = e.clientX;
                prevY = e.clientY;
            }
            function mouseup() {
                windowDoms.forEach(dom => {
                    dom.style.pointerEvents = 'auto';
                });
                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
            }

        }
        const topBorderMousedown = function (mousedown) {
            win.setTop();
            if (status === "max") {
                console.warn("最大化窗口无法拉伸");
                return;
            }
            var prevX = mousedown.clientX;
            var prevY = mousedown.clientY;
            const windowDoms = document.querySelectorAll('.new-windows-box');
            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);
            function mousemove(e) {
                const rect = winEl.box.getBoundingClientRect();
                winEl.box.style.height = rect.height + (prevY - e.clientY) + 'px';
                winEl.box.style.top = rect.top - (prevY - e.clientY) + 'px';
                windowDoms.forEach(dom => {
                    dom.style.pointerEvents = 'none';
                });
                prevX = e.clientX;
                prevY = e.clientY;
            }
            function mouseup() {
                windowDoms.forEach(dom => {
                    dom.style.pointerEvents = 'auto';
                });
                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
            }

        }
        const bottomBorderMousedown = function (mousedown) {
            win.setTop();
            if (status === "max") {
                console.warn("最大化窗口无法拉伸");
                return;
            }
            var prevX = mousedown.clientX;
            var prevY = mousedown.clientY;
            const windowDoms = document.querySelectorAll('.new-windows-box');
            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);
            function mousemove(e) {
                const rect = winEl.box.getBoundingClientRect();
                winEl.box.style.height = rect.height - (prevY - e.clientY) + 'px';
                windowDoms.forEach(dom => {
                    dom.style.pointerEvents = 'none';
                });
                prevX = e.clientX;
                prevY = e.clientY;
            }
            function mouseup() {
                windowDoms.forEach(dom => {
                    dom.style.pointerEvents = 'auto';
                });
                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
            }

        }
        winEl.leftBorder.addEventListener("mousedown", leftBorderMousedown);
        winEl.leftBorder.removeEventListener("mouseup", leftBorderMousedown);
        winEl.rightBorder.addEventListener("mousedown", rigthBorderMousedown);
        winEl.rightBorder.removeEventListener("mouseup", rigthBorderMousedown);
        winEl.topBorder.addEventListener("mousedown", topBorderMousedown);
        winEl.topBorder.removeEventListener("mouseup", topBorderMousedown);
        winEl.bottomBorder.addEventListener("mousedown", bottomBorderMousedown);
        winEl.bottomBorder.removeEventListener("mouseup", bottomBorderMousedown);
    }
    Win.Shade.addEventListener("mouseup", function () {
        var parentNode = Win.Shade.parentNode;
        if (parentNode) {
            parentNode.removeChild(Win.Shade);
        }
        Win.Shade.onmousemove = null;
        endCallback();
    });
}
