export { Win } from "./Win/index";
export { Menu } from "./Rclick/index";
export { Message } from "./Message/index";
export { MessageBox } from "./MessageBox/index";
export { Screen } from "./Screen/index";
export { Loading } from "./Loading/index";
import { $Win } from "./Win/index";
import { $Menu, installMenu } from "./Rclick/index";
import { $MessageBox } from "./MessageBox/index";
import { $Message } from "./Message/index";
import { $Screen } from "./Screen/index";
import { $Loading } from "./Loading/index";
export default {
    Win: $Win,
    Menu: $Menu,
    install: installMenu,
    MessageBox: $MessageBox,
    Message: $Message,
    Screen: $Screen,
    Loading: $Loading,
};
window.$takeoff = {
    Win: $Win,
    Menu: $Menu,
    MessageBox: $MessageBox,
    Message: $Message,
    Screen: $Screen,
    Loading: $Loading,
};
