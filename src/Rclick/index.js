import { dirSvg, disSvg, indSvg } from "../svg/button";
import createElement from "../utils/createElement";
var Menu = (function () {
    function Menu(el, options) {
        this.options = defaultMenus;
        this.width = 220;
        this.height = 6;
        this.left = 0;
        this.top = 0;
        if (Array.isArray(el)) {
            var parentElement_1 = null;
            el.forEach(function (e) {
                if (parentElement_1 && e.parentElement !== parentElement_1) {
                    throw "多个元素必须是兄弟关系";
                }
                else {
                    parentElement_1 = e.parentElement;
                }
            });
            this.els = el;
        }
        else {
            this.els = [el];
        }
        this.__options = options;
        this.menu = this.__create__menu();
        this.__set__event();
    }
    Object.defineProperty(Menu.prototype, "__options", {
        get: function () {
            return this.options;
        },
        set: function (v) {
            if (!v || !Array.isArray(v) || !v.length) {
                v = defaultMenus;
            }
            this.height = v.length * 30 + 6;
            this.options = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Menu.prototype, "__left", {
        get: function () {
            return this.left;
        },
        set: function (v) {
            this.menu.style.left = "".concat(v, "px");
            this.left = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Menu.prototype, "__top", {
        get: function () {
            return this.top;
        },
        set: function (v) {
            this.menu.style.top = "".concat(v, "px");
            this.top = v;
        },
        enumerable: false,
        configurable: true
    });
    Menu.prototype.__create__menu = function () {
        var _this = this;
        var menuBox = createElement("windows-right-menus");
        menuBox.style.width = "".concat(this.width, "px");
        var menus = [];
        this.__options.forEach(function (item) {
            var menu = createElement("window-right-menus-item");
            menu.addEventListener("click", function () {
                item.method(_this.el);
            });
            var leftMenuBox = createElement("window-left-menus-item-box");
            var rightMenuBox = createElement("window-right-menus-item-box");
            var icon = createElement("window-right-menus-item-icon");
            if (typeof item.icon === "string") {
                icon.innerHTML = item.icon;
            }
            else if (item.icon && item.icon.nodeName) {
                icon.appendChild(item.icon);
            }
            if (typeof item.shortcut === "string" && item.shortcut) {
                rightMenuBox.innerText = item.shortcut
            }
            var name = createElement("window-right-menus-item-name");
            name.innerText = item.name;
            leftMenuBox.appendChild(icon)
            leftMenuBox.appendChild(name)
            menu.appendChild(leftMenuBox);
            menu.appendChild(rightMenuBox);
            menus.push(menu);
        });
        menus.forEach(function (menu) {
            menuBox.appendChild(menu);
        });
        return menuBox;
    };
    Menu.prototype.__set__event = function () {
        var _this = this;
        this.menu.onmousedown = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };
        this.els.forEach(function (el) {
            el.oncontextmenu = function (e) {
                e.stopPropagation();
                e.preventDefault();
                _this.el = el;
                var vw = window.innerWidth, vh = window.innerHeight;
                var left = e.pageX, top = e.pageY;
                if (vw - left < _this.width) {
                    left = vw - _this.width;
                }
                if (vh - top < _this.height) {
                    top = vh - _this.height - 30;
                }
                _this.__left = left;
                _this.__top = top;
                if (_this.els.length > 1) {
                    var parentElement = el.parentElement;
                    if (parentElement) {
                        parentElement.appendChild(_this.menu);
                        parentElement.onclick = function () { _this.closeMenu(); };
                        parentElement.setAttribute("tabindex", "1");
                        parentElement.onblur = function () { _this.closeMenu(); };
                    }
                }
                else {
                    el.appendChild(_this.menu);
                    el.onclick = function () { _this.closeMenu(); };
                    el.setAttribute("tabindex", "1");
                    el.onblur = function () { _this.closeMenu(); };
                }
            };
        });
    };
    Menu.prototype.closeMenu = function () {
        var parentElement = this.menu.parentElement;
        if (parentElement) {
            parentElement.removeChild(this.menu);
        }
    };
    return Menu;
}());
export { Menu };
export function installMenu(Vue) {
    Vue.directive("Rclick", function (el, options) {
        new Menu(el, options.value);
    });
}
export var $Menu = Menu;
var defaultMenus = [
    {
        id: 0,
        icon: dirSvg,
        shortcut: 'Ctrl+D',
        name: "新建文件夹",
        method: function () {
            console.log("你点击了【新建文件夹】");
        }
    },
    {
        id: 1,
        name: "查看(V)",
        method: function () {
            console.log("你点击了【查看】");
        }
    },
    {
        id: 2,
        name: "排序方式(O)",
        method: function () {
            console.log("你点击了【排序方式】");
        }
    },
    {
        id: 3,
        name: "刷新",
        method: function () {
            console.log("你点击了【刷新】");
        }
    },
    {
        id: 4,
        icon: disSvg,
        name: "显示设置",
        method: function () {
            console.log("你点击了【显示设置】");
        }
    },
    {
        id: 4,
        icon: indSvg,
        name: "个性化",
        method: function () {
            console.log("你点击了【个性化】");
        }
    },
];
