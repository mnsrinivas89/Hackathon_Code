import {Component} from 'angular2/core';

@Component({
	selector: 'Header',
    template : '{{title}}'
})
export class Header { 
	title = 'Collage';
}
