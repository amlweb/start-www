import $ from 'jquery';
import Module from './modules/module';

class App {
    constructor() {
        this.init();
    }

    init() {
        this.initUI();
    }

    initUI() {
        this.module = new Module();
    }
}

document.addEventListener('DOMContentLoaded', () => new App());