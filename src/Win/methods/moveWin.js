import { Win } from "..";

// 公共处理函数，获取客户端坐标
function getClientCoordinates(event) {
    if (event.touches && event.touches.length > 0) {
        return {
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY
        };
    }
    return {
        clientX: event.clientX,
        clientY: event.clientY
    };
}

// 公共处理函数，获取元素相对坐标
function getOffsetCoordinates(event, element) {
    const rect = element.getBoundingClientRect();
    const coords = getClientCoordinates(event);
    return {
        offsetX: coords.clientX - rect.left,
        offsetY: coords.clientY - rect.top
    };
}
export default function (win, status, winEl, endCallback) {
    // 处理移动开始（鼠标和触摸）
    const handleMoveStart = (event) => {
        win.setTop();
        if (status === "max") {
            console.warn("最大化窗口无法移动");
            return;
        }

        const { offsetX, offsetY } = getOffsetCoordinates(event, winEl.move);
        const tW = winEl.title.offsetWidth;
        const hX = offsetX + tW;
        const hY = offsetY;

        if (winEl.box.parentNode === document.body) {
            Win.Shade.style.position = "fixed";
        } else {
            Win.Shade.style.position = "absolute";
        }

        if (winEl.box.parentNode) {
            winEl.box.parentNode.appendChild(Win.Shade);
        }

        const handleMove = (moveEvent) => {
            const { clientX, clientY } = getClientCoordinates(moveEvent);
            const sX = clientX - Win.Shade.getBoundingClientRect().left;
            const sY = clientY - Win.Shade.getBoundingClientRect().top;

            let left = sX - hX;
            let top = sY - hY;

            if (top <= win.config.toTop) top = win.config.toTop;
            winEl.box.style.left = `${left}px`;
            winEl.box.style.top = `${top}px`;
        };

        const handleEnd = () => {
            Win.Shade.parentNode?.removeChild(Win.Shade);
            Win.Shade.onmousemove = null;
            Win.Shade.ontouchmove = null;
            endCallback();
        };

        Win.Shade.onmousemove = handleMove;
        Win.Shade.ontouchmove = (e) => {
            e.preventDefault();
            handleMove(e);
        };

        Win.Shade.addEventListener("mouseup", handleEnd);
        Win.Shade.addEventListener("touchend", handleEnd);
    };

    // 绑定鼠标和触摸事件
    winEl.move.addEventListener("mousedown", handleMoveStart);
    winEl.move.addEventListener("touchstart", (e) => {
        e.preventDefault();
        handleMoveStart(e);
    });

    /************/

    // 调整窗口大小处理逻辑增强
    const createResizeHandler = (resizeType) => (startEvent) => {
        startEvent.preventDefault();
        win.setTop();
        if (status === "max") return;

        const { clientX: startX, clientY: startY } = getClientCoordinates(startEvent);
        const rect = winEl.box.getBoundingClientRect();
        const windowDoms = document.querySelectorAll('.new-windows-box');

        const handleMove = (moveEvent) => {
            const { clientX, clientY } = getClientCoordinates(moveEvent);
            const deltaX = startX - clientX;
            const deltaY = startY - clientY;

            let newWidth, newHeight, newLeft, newTop;

            switch (resizeType) {
                case 'left':
                    newWidth = rect.width + deltaX;
                    newLeft = rect.left - deltaX;
                    if (newWidth >= (win.config.miniWidth || 0)) {
                        winEl.box.style.width = `${newWidth}px`;
                        winEl.box.style.left = `${newLeft}px`;
                    }
                    break;
                // 类似处理其他方向...
            }

            windowDoms.forEach(dom => dom.style.pointerEvents = 'none');
        };

        const handleEnd = () => {
            windowDoms.forEach(dom => dom.style.pointerEvents = 'auto');
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchend', handleEnd);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', (e) => {
            e.preventDefault();
            handleMove(e);
        });
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd);
    };

    // 绑定调整大小事件
    if (win.__config.resize) {
        const directions = {
            leftBorder: 'left',
            rightBorder: 'right',
            topBorder: 'top',
            bottomBorder: 'bottom'
        };

        Object.entries(directions).forEach(([element, type]) => {
            const handler = createResizeHandler(type);
            winEl[element].addEventListener("mousedown", handler);
            winEl[element].addEventListener("touchstart", (e) => {
                e.preventDefault();
                handler(e);
            });
        });
    }
    /************/

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
    winEl.boxMask.addEventListener('click', function () {
        win.dragSingle = true;
        winEl.boxMask.style.backgroundColor = 'transparent';
        win.setTop();
    });
    winEl.boxMask.addEventListener('dragleave', (event) => {
        winEl.boxMask.style.backgroundColor = 'transparent';
        winEl.boxMaskWrapper.style.display = 'none';
    });
    winEl.boxMask.addEventListener('dragover', (event) => {
        event.preventDefault(); // 阻止默认行为，允许放置
        winEl.boxMask.style.backgroundColor = '#ffffffc0'; // 提示用户可以放置
        winEl.boxMaskWrapper.style.display = 'block';
        var ObjData;
        const data = localStorage.getItem('currentDrapData');
        const fileData = event.dataTransfer.files
        if (data) {
            ObjData = JSON.parse(data)
            ObjData.type = 'innerSystem'
            ObjData.target = win.iframeInfo
        } else {
            const filedata = {
                type: 'outerSystem',
                source: 'System',
                target: win.iframeInfo,
                data: fileData ? fileData : 'empty'
            }
            ObjData = filedata
        }
        win.handledragover(ObjData)
    });
    winEl.boxMask.addEventListener('drop', (event) => {
        event.preventDefault();
        win.dragSingle = true;
        setTimeout(() => {
            winEl.boxMask.style.backgroundColor = 'transparent';
            winEl.boxMaskWrapper.style.display = 'none';
        }, 0)
        var ObjData;
        // 获取拖拽的数据
        const data = event.dataTransfer.getData('text');
        const fileData = event.dataTransfer.files
        if (data) {
            ObjData = JSON.parse(data)
            ObjData.type = 'innerSystem'
            ObjData.target = win.iframeInfo
        } else {
            const filedata = {
                type: 'outerSystem',
                data: fileData,
                source: 'System',
                target: win.iframeInfo,
            }
            ObjData = filedata
        }
        localStorage.removeItem('currentDrapData')
        win.handleDrop(ObjData);
    });
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
                // winEl.box.style.width = rect.width + (prevX - e.clientX) + 'px';
                // winEl.box.style.left = rect.left - (prevX - e.clientX) + 'px';
                var temporaryWidth = rect.width + (prevX - e.clientX);
                if ((win.config.miniWidth || 0) <= temporaryWidth) {
                    winEl.box.style.width = temporaryWidth + 'px'
                    winEl.box.style.left = rect.left - (prevX - e.clientX) + 'px';
                } else {
                    mouseup();
                    return
                }
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
                var temporaryWidth = rect.width - (prevX - e.clientX);
                if ((win.config.miniWidth || 0) <= temporaryWidth) {
                    winEl.box.style.width = temporaryWidth + 'px'
                } else {
                    mouseup();
                    return
                }
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
                var temporaryHeight = rect.height + (prevY - e.clientY);
                var temporaryTop = rect.top - (prevY - e.clientY);
                if ((win.config.miniHeight || 0) <= temporaryHeight) {
                    winEl.box.style.height = temporaryHeight + 'px'
                } else {
                    mouseup();
                    return
                }
                if ((win.config.toTop || 0) <= temporaryTop) {
                    winEl.box.style.top = temporaryTop + 'px'
                }
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
                var temporaryHeight = rect.height - (prevY - e.clientY);
                if ((win.config.miniHeight || 0) <= temporaryHeight) {
                    winEl.box.style.height = temporaryHeight + 'px'
                } else {
                    mouseup();
                    return
                }
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
