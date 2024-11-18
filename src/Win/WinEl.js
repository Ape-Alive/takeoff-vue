import createElement from "../utils/createElement";
import { closeSvg, maxSvg, unmaxSvg, miniSvg } from "../svg/button";
import Vue from "vue";
var WinEl = (function () {
    function WinEl(config) {
        this.box = createElement(["new-windows-box", "initial"]);
        this.header = createElement("new-windows-header");
        this.title = createElement("new-windows-title");
        this.icon = createElement("new-windows-icon");
        this.name = createElement("new-windows-name");
        this.move = createElement("new-windows-move");
        this.btnbox = createElement("new-windows-btnbox");
        this.minimize = createElement(["new-windows-btn", "new-windows-minimize"]);
        this.maximize = createElement(["new-windows-btn", "new-windows-maximize"]);
        this.close = createElement(["new-windows-btn", "new-windows-close"]);
        this.content = createElement("new-windows-content");
        this.miniEl = createElement("new-windows-mini-list-box");

        this.boxMask = createElement("new-windows-box-mask");

        if (config.resize) {
            this.leftBorder = createElement("new-windows-left-border");
            this.rightBorder = createElement("new-windows-rigth-border");
            this.topBorder = createElement("new-windows-top-border");
            this.bottomBorder = createElement("new-windows-bottom-border");
        }
        this.__init__attribute__content(config);
        this.__init__correlation(config);
    }
    WinEl.prototype.__init__attribute__content = function (config) {
        this.minimize.innerHTML = miniSvg;
        this.maximize.innerHTML = maxSvg;
        this.close.innerHTML = closeSvg;
        if (typeof config.icon === "string") {
            this.icon.innerHTML = config.icon;
        }
        else if (config.icon) {
            this.icon.appendChild(config.icon);
        }
        if (config.title) {
            this.name.innerText = config.title;
        }
        if (!config.miniBtn) {
            this.minimize.style.display = "none";
        }
        if (!config.maxBtn) {
            this.maximize.style.display = "none";
        }
        // if (config.resize) {
        //     this.box.style.resize = "both";
        // }
        if (config.width) {
            this.box.style.width = config.width;
        }
        if (config.height) {
            this.box.style.height = config.height;
        }
        if (config.startExist) {
            this.box.style.display = "none"
        }
    };

    WinEl.prototype.__init__zindex_top = function (config) {
        const elements = document.querySelectorAll('div.new-windows-box');
        let maxZIndex = -Infinity;
        let maxElement = null;
        elements.forEach((element, index) => {
            const zIndex = parseInt(window.getComputedStyle(element).zIndex, 10);
            if (!isNaN(zIndex) && zIndex > maxZIndex) {
                maxZIndex = zIndex;
                maxElement = element;
            }
        });
        if (maxElement) {
            const maskElement = maxElement.querySelector('.new-windows-box-mask');
            if (maskElement) {
                maskElement.style.display = 'none';
            } else {
                console.log('No child with class new-windows-box-mask found.');
            }
        } else {
            console.log('No valid z-index found.');
        }
        elements.forEach((element ,index)=> {
            if (element !== maxElement) {
                const maskElement = element.querySelector('.new-windows-box-mask');
                if (maskElement) {
                    maskElement.style.display = 'block';
                } else {
                    console.log('No child with class new-windows-box-mask found.');
                }
            }
        });
    };

    WinEl.prototype.__init__correlation = function (config) {
        this.title.appendChild(this.icon);
        this.title.appendChild(this.name);
        this.btnbox.appendChild(this.minimize);
        this.btnbox.appendChild(this.maximize);
        this.btnbox.appendChild(this.close);
        this.header.appendChild(this.title);
        this.header.appendChild(this.move);
        this.header.appendChild(this.btnbox);
        this.box.appendChild(this.header);
        this.content.appendChild(this.miniEl);
        this.box.appendChild(this.content);
        this.box.appendChild(this.boxMask);
        if (config.resize) {
            this.box.appendChild(this.leftBorder)
            this.box.appendChild(this.rightBorder)
            this.box.appendChild(this.topBorder)
            this.box.appendChild(this.bottomBorder)
        }
        setTimeout(() => {
            this.__init__zindex_top(config)
        }, 0)
    };
    WinEl.prototype.setPosition = function (config) {
        var _a, _b;
        var top = 0, left = 0;
        var reg = /[^\d]/g;
        var width = (_a = config.width) === null || _a === void 0 ? void 0 : _a.replace(reg, ""), height = (_b = config.height) === null || _b === void 0 ? void 0 : _b.replace(reg, "");
        var parentElement = this.box.parentElement;
        if (parentElement === document.body) {
            this.box.style["position"] = "fixed";
            top = (window.innerHeight - Number(height)) / 2;
            left = (window.innerWidth - Number(width)) / 2;
        }
        else if (parentElement) {
            this.box.style["position"] = "absolute";
            top = (parentElement.offsetHeight - Number(height)) / 2;
            left = (parentElement.offsetWidth - Number(width)) / 2;
        }
        this.box.style.top = "".concat(top <= config.toTop ? config.toTop : top, "px");
        this.box.style.left = "".concat(left < 0 ? left : left, "px");
    };
    WinEl.prototype.setProps = function (config) {
        if (config.props.iframeId) {
            const selectId = '#' + config.props.iframeId
            const iframeDom = this.box.querySelector(selectId)
            iframeDom.contentWindow.props = config.props.data;
            iframeDom.contentWindow.postMessage(config.props.data, '*')
            localStorage.setItem(`${config.props.iframeId}`, JSON.stringify(config.props.data))
        }
    }
    WinEl.prototype.setContent = function (config) {
        if (config.component) {
            var props = config.props ? config.props : {};
            var Profile = Vue.extend(config.component);
            var instance = new Profile({
                propsData: props,
            });
            var div = createElement();
            this.content.appendChild(div);
            instance.$mount(div);
        }
        else if (config.url) {
            var iframe = createElement({
                class: "new-windows-html",
                name: "iframe",
            });
            if (config.sandbox && config.sandbox.length) {
                var sandbox = config.sandbox.join(" ");
                iframe.setAttribute("sandbox", sandbox);
            }
            if (config.props.iframeId) {
                iframe.setAttribute("id", config.props.iframeId);
            }
            iframe.setAttribute("src", config.url);
            this.content.appendChild(iframe);
        }
    };
    WinEl.prototype.setInitial = function (upStatus) {
        this.box.classList.add("initial");
        this.box.classList.remove("mini");
        this.box.classList.remove("max");
        this.box.style.display = "block"

        if (upStatus === "mini") {
            this.minimize.innerHTML = miniSvg;
        }
        else {
            this.maximize.innerHTML = maxSvg;
        }
    };
    WinEl.prototype.setMax = function (upStatus) {
        this.box.classList.add("max");
        this.box.classList.remove("initial");
        this.box.classList.remove("mini");
        this.box.style.display = "block"

        this.maximize.innerHTML = unmaxSvg;
        if (upStatus === "mini") {
            this.minimize.innerHTML = miniSvg;
        }
    };
    WinEl.prototype.setMini = function () {
        this.box.classList.add("mini");
        this.box.classList.remove("initial");
        this.box.classList.remove("max");
        this.box.style.display = "none"

        this.minimize.innerHTML = maxSvg;
    };
    return WinEl;
}());
export { WinEl };
