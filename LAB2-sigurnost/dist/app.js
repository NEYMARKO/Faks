"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.static('public'));
app.set("views", path_1.default.join(__dirname, "views"));
app.set('view engine', 'pug');
app.get('/', function (req, res) {
    res.render('index');
});
const hostname = '127.0.0.1';
const port = 4072;
app.listen(port, hostname, () => {
    console.log(`SPA hosted at http://${hostname}:${port}/`);
});
