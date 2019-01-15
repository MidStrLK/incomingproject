/**
 * Created by eds on 22.11.2017.
 */
(function (global) {
    System.config({
        paths: {
            'npm:': 'node_modules/'
        },
        map: {
            app: 'app',

            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

            'rxjs': 'npm:rxjs',

            'ng2-select': 'node_modules/ng2-select',
            'ng-select': 'node_modules/ng-select',

            "ngx-dropdown": "node_modules/ngx-dropdown",

            "@ng-dynamic-forms/core": "npm:@ng-dynamic-forms/core/bundles/core.umd.js",
            "@ng-dynamic-forms/ui-bootstrap": "npm:@ng-dynamic-forms/ui-bootstrap/bundles/ui-bootstrap.umd.js",

            'ng5-validation': 'npm:ng5-validation/bundles/ng5-validation.umd.js'
        },
        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
            'ng2-select': {
                defaultExtension: 'js',
                main: 'ng2-select.js'
            },
            'ng-select': {
                defaultExtension: 'js',
                main: 'index.js'
            },
            "ngx-dropdown": {
                "main": "index.js",
                "defaultExtension": "js"
            }
        }
    });
})(this);