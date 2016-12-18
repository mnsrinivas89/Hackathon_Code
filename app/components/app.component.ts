import {Component, ViewEncapsulation} from 'angular2/core';
import {Header} from './header.js'
import {Content} from './content.js'
import {Footer} from './footer.js'

@Component({
    selector: 'my-app',
    template: '<Header></Header><Content></Content><Footer></Footer>',
	styleUrls : ['styles/app.css'],
	directives : [Header, Content, Footer],
	encapsulation: ViewEncapsulation.None
})
export class PhotoCollage implements OnInit {
	/**
		Inititalisation phase of the content class
	**/
	ngOnInit() {
	}
}
