import { WinEl } from "./WinEl";
import createElement from "../utils/createElement";
import { chromeSvg } from "../svg/button";
import setConfig from "./methods/setConfig";
import moveWin from "./methods/moveWin";
export var defaultConfig = {
    title: "新窗口",
    width: "800px",
    height: "600px",
    miniBtn: false,
    maxBtn: false,
    resize: false,
    icon: chromeSvg,
    startExist: false,
    url: "http://www.bauble.vip",
    sandbox: [],
};
var Win = (function () {
    const loadingIcon = createElement({ name: 'img' })
    loadingIcon.setAttribute('src', require('../assets/loading.png'))
    function Win(config) {
        this.config = defaultConfig;
        this.zIndex = Win.zIndex;
        this.children = {};
        this.callbacks = {};
        this.iframeInfo = {}
        this.dragSingle = true
        this.dragOption = {
            dragIcon: '',
            dragText: ''
        }
        Win.zIndex += 1;
        if (!config.loadingIcon) {
            config.loadingIcon = loadingIcon
        }
        config.isLoading = !!config.isLoading
        this.__config = config || defaultConfig;
        var component = this.__config.component;
        this.upStatus = "initial"
        this.status = this.__config.startExist ? "mini" : "initial"
        this.id = this.__config.id ? this.__config.id : component && component.id ? component.id : Win.createId();
        if (Win.WinIdMap[this.id]) {
            var errMsg = "相同ID窗口已存在！无法继续创建";
            console.error(errMsg);
            throw new Error(errMsg);
        }
        this.elements = new WinEl(this.__config);
        this.addMoveEvent();
        this.addButtonEvent();
        this.__init__show();
        this.__zIndex = Win.zIndex;
        if (Win.showMiniList && !Win.baseMiniEl) {
            Win.baseMiniEl = createBaseMiniEl();
        }
    }

    Object.defineProperty(Win.prototype, "_dragOption", {
        get: function () {
            return this.dragOption;
        },
        set: function (v) {
            this.dragOption = v;
            setTimeout(() => {
                this.elements.__set__drap_option(this.dragOption)
            }, 0)
        },
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Win.prototype, "__config", {
        get: function () {
            return this.config;
        },
        set: function (config) {
            this.config = setConfig(config, defaultConfig);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Win.prototype, "__status", {
        get: function () {
            return this.status;
        },
        set: function (v) {
            this.upStatus = this.status;
            this.setTop();
            switch (v) {
                case "initial":
                    this.elements.setInitial(this.upStatus);
                    break;
                case "max":
                    this.elements.setMax(this.upStatus);
                    break;
                case "mini":
                    this.elements.setMini();
                    break;
                case "close":
                    this.toClose();
                    break;
            }
            this.status = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Win.prototype, "__zIndex", {
        get: function () {
            return this.zIndex;
        },
        set: function (v) {
            this.elements.box.style.zIndex = String(v);
            this.zIndex = v;
            setTimeout(() => {
                this.elements.__init__zindex_top()
            }, 10)
        },
        enumerable: false,
        configurable: true
    });
    Win.prototype.__init__show = function () {
        var _this = this;
        if (this.config.parentId) {
            var parentWin = Win.WinIdMap[this.config.parentId];
            if (!parentWin) {
                return console.error("没有找到上级窗口！");
            }
            parentWin.elements.content.appendChild(this.elements.box);
            parentWin.children[this.id] = this;
        }
        else {
            if (!Win.defaultContentBox || !Win.defaultContentBox.nodeName) {
                Win.defaultContentBox = document.body;
            }
            Win.defaultContentBox.appendChild(this.elements.box);
        }
        this.elements.setPosition(this.__config);
        this.elements.setContent(this.__config);
        Win.WinIdMap[this.id] = this;
        this.elements.setProps(this.__config)
        this.elements.setParentInstance(_this, this.__config)
        requestAnimationFrame(function () {
            if (_this.callbacks.mounted) {
                _this.callbacks.mounted(_this);
            }
        });
    };
    Win.prototype.addMoveEvent = function () {
        var _this = this;
        moveWin(this, this.__status, this.elements, function () {
            requestAnimationFrame(function () {
                if (_this.callbacks.move) {
                    _this.callbacks.move(_this);
                }
            });
        });
    };
    Win.prototype.addButtonEvent = function () {
        var _this = this;
        this.elements.minimize.addEventListener("click", function () {
            _this.setMini();
        });
        this.elements.maximize.addEventListener("click", function () {
            _this.setMax();
        });
        this.elements.close.addEventListener("click", function () {
            _this.close();
        });
    };
    Win.prototype.toClose = function () {
        var childrenIds = Object.keys(this.children);
        if (childrenIds.length) {
            for (var _i = 0, childrenIds_1 = childrenIds; _i < childrenIds_1.length; _i++) {
                var key = childrenIds_1[_i];
                if (this.children[key]) {
                    this.children[key].toClose();
                }
            }
        }
        var parentElement = this.elements.box.parentElement;
        if (parentElement && !this.__config.startExist) {
            parentElement.removeChild(this.elements.box);
        } else {
            this.setMini()
        }
        delete Win.WinIdMap[this.id];
        if (this.__config.parentId) {
            delete Win.WinIdMap[this.__config.parentId].children[this.id];
        }
    };
    Win.prototype.appendMiniList = function () {
        if (!Win.showMiniList) {
            return;
        }
        var parentNode, parentMiniEl;
        if (this.__config.parentId && Win.WinIdMap[this.__config.parentId]) {
            parentNode = Win.WinIdMap[this.__config.parentId].elements.content;
            parentMiniEl = Win.WinIdMap[this.__config.parentId].elements.miniEl;
        }
        else {
            parentNode = Win.defaultContentBox;
            parentMiniEl = Win.baseMiniEl;
        }
        if (this.__status === "mini") {
            parentMiniEl.appendChild(this.elements.box);
        }
        else {
            parentNode.appendChild(this.elements.box);
        }
    };
    Win.prototype.setTop = function () {
        var _this = this;
        requestAnimationFrame(function () {
            if (!_this.__zIndex || _this.__zIndex < Win.zIndex) {
                Win.zIndex += 1;
                _this.__zIndex = Win.zIndex;
                if (_this.callbacks.top) {
                    _this.callbacks.top(_this);
                }
            }
        });
    };
    Win.prototype.setIframeInfo = function (iframeInfo) {
        var _this = this;
        _this.iframeInfo = iframeInfo;
        return this;
    };
    Win.prototype.setDrapOption = function (dragOption) {
        var _this = this;
        _this._dragOption = dragOption;
        return this;
    };
    Win.prototype.setMax = function () {
        var _this = this;
        if (this.__status === "max") {
            this.__status = "initial";
        }
        else {
            this.__status = "max";
        }
        requestAnimationFrame(function () {
            if (_this.callbacks.max) {
                _this.callbacks.max(_this);
            }
        });
        return this;
    };
    Win.prototype.setMini = function () {
        var _this = this;
        if (this.__status === "mini") {
            this.__status = this.upStatus;
        }
        else {
            this.__status = "mini";
        }
        requestAnimationFrame(function () {
            if (_this.callbacks.mini) {
                _this.callbacks.mini(_this);
            }
        });
        return this;
    };
    Win.prototype.handleDrop = function (data) {
        var _this = this;
        requestAnimationFrame(function () {
            if (_this.callbacks.dropfn) {
                _this.callbacks.dropfn(_this, data);
            }
        });
        return this;
    };
    Win.prototype.handledragover = function (data) {
        var _this = this;
        requestAnimationFrame(function () {
            if (_this.callbacks.dragoverfn && _this.dragSingle) {
                _this.dragSingle = false
                _this.callbacks.dragoverfn(_this, data);
            }
        });
        return this;
    };
    Win.prototype.toMini = function () {
        var _this = this;
        if (this.__status !== "mini") {
            this.__status = "mini";
        }
        requestAnimationFrame(function () {
            if (_this.callbacks.minifn) {
                _this.callbacks.minifn(_this);
            }
        });
        return this;
    };
    Win.prototype.close = function () {
        var _this = this;
        if (_this.__config.startExist) {
            _this.__status = "mini";
        } else {
            _this.__status = "close";
        }
        requestAnimationFrame(function () {
            if (_this.callbacks.close && !_this.__config.startExist) {
                _this.callbacks.close();
            } else if (_this.callbacks.shut && _this.__config.startExist) {
                _this.callbacks.shut();
            }
        });
    };
    Win.prototype.changeProps = function (props) {
        this.__config.props.data = props
        this.elements.setProps(this.__config)
        return this;
    };
    Win.prototype.changeLoading = function (loading) {
        this.__config.isLoading = loading
        this.elements.setLoading(loading)
        return this
    };
    Win.prototype.onmounted = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.mounted = fn;
        }
        return this;
    };
    Win.prototype.ondragover = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.dragoverfn = fn;
        }
        return this;
    };
    Win.prototype.ondrop = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.dropfn = fn;
        }
        return this;
    };
    Win.prototype.onmini = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.mini = fn;
        }
        return this;
    };
    Win.prototype.minied = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.minifn = fn;
        }
        return this;
    };
    Win.prototype.onmax = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.max = fn;
        }
        return this;
    };
    Win.prototype.onclose = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.close = fn;
        }
        return this;
    };
    Win.prototype.onshut = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.shut = fn;
        }
        return this;
    };
    Win.prototype.ontop = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.top = fn;
        }
        return this;
    };
    Win.prototype.onmove = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.move = fn;
        }
        return this;
    };
    Win.createId = function () {
        var random = "abcdefghijklmnopqrstuvwxyz";
        var rdStr = "";
        for (var i = 0; i < 8; i++) {
            rdStr += random[parseInt(String(Math.random() * random.length))];
        }
        return "new-dream-".concat(rdStr, "-").concat(Date.now());
    };
    Win.WinIdMap = {};
    Win.Shade = createElement({ id: "new-windows-shade" });
    Win.zIndex = 0;
    Win.showMiniList = true;
    return Win;
}());
export { Win };
function createBaseMiniEl() {
    var el = createElement("new-windows-mini-list-box");
    Win.defaultContentBox.appendChild(el);
    return el;
}
export var $Win = Win;
