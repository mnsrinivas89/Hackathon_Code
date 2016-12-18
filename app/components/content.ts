import {Component} from 'angular2/core';
import {UtilityService} from './../services/utility.js';
import {facebookSection} from './facebooksection.js';
import {staticAlbum} from './staticalbum.js'

@Component({
	selector: 'Content',
    templateUrl : './app/templates/contentTemplate.html',
	providers: [UtilityService],
	directives : [facebookSection, staticAlbum]
	
})
export class Content implements OnInit { 
	
	/**
		constructor function by implementing the utitlity services/utility
	**/
	constructor(private _utilityService: UtilityService) { }
	
	/**
		Inititalisation phase of the content class
	**/
	ngOnInit() {
		let _this = this;
		this.setContentHeight();
	}
	
	setContentHeight () {
		this._utilityService.setContentHeight($("content"));
	}
	
}
