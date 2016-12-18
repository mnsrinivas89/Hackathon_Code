import {Component} from 'angular2/core';
import {FacebookService} from './../services/fb.js';

@Component({
	selector: 'facebookSection',
    templateUrl : './app/templates/facebookTemplate.html',
	providers: [FacebookService]
})
export class facebookSection implements OnInit { 
	
	/**
		constructor function by implementing the utitlity services/utility
	**/
	constructor(private _facebookService: FacebookService) {
		this.resetValues();
		this.hideFBIcon();
		this.hideContent();
		this.showLoader("Checking Your FB status. This might take a few seconds depending on ur network.");
	}
	
	/**
		Inititalisation phase of the content class
	**/
	ngOnInit() {
		// load facebook SDK to use the properties of it
		let myPromise = this._facebookService.initFB(),
			_this = this;
		this.hideFBIcon();
		myPromise.then(function (response) {
			_this.authChangeCallback(response);
		},
		function () {
			_this.resetValues();
		});
		
		setTimeout(function () {
			// Check if loader is still available then show the appropriate message.
			let $this = _this;
			$this.hideLoader();
			if($this.fbSDKLoaded) {
				if($this.fbStatus && !$this.appStatus) {
					$this.showFBIcon();
					//$this.showErrorMessage("Please signon to application. wih the below Sign on button");
				}
				else if(!$this.fbStatus) {
					$this.showFBIcon();
					//$this.showErrorMessage("Please signon to FB and the application. wih the below Sign on button");
				}
			}
			else {
				$this.showErrorMessage("!!!! OOPS You Have Slow / No network Connectivity issues.!!!!");
			}
		}, 10000);
	}
	
	hideFBIcon () {
		$(".facebookLogoContainer").hide();
		$(".fbHeader").hide();
	}
	showFBIcon () {
		$(".facebookLogoContainer").show();
		$(".fbHeader").show();
	}
	
	hideContent() {
		$("#fbSrollWrapper").hide();
	}
	
	showContent () {
		$("#fbSrollWrapper").show();
	}
	
	showLoader(msg) {
		this.errorMessage = null;
		this.loaderMessage = msg;
		$("#facebookSection .loader").show();
	}
	
	hideLoader() {
		$("#facebookSection .loader").hide();
	}
	
	resetValues () {
		this.fbSDKLoaded = null;
		this.errorMessage = null;
		this.fbProfileDetailsURL = null;
		this.albumData = [];
		this.fbStatus = null;
		this.appStatus = null;
		this.fbFirstName = null;
		this.fbLastName = null;
		this.hideErrorMessage();
		$("#myCollage").hide();
	}
	
	showErrorMessage (msg) {
		this.errorMessage = msg;
		$("facebooksection .errorMessage").show();
	}
	
	hideErrorMessage () {
		$("facebooksection .errorMessage").hide();
	}
	
	authChangeCallback (response) {
		this.fbSDKLoaded = true;
		this.hideLoader();
		console.log("inside authChangeCallback");
		// The response object is returned with a status field that lets the
		// app know the current login status of the person.
		// Full docs on the response object can be found in the documentation
		// for FB.getLoginStatus().
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
			console.log("logged into facebook");
			console.log(this);
			this.fbStatus = true;
			this.appStatus = true;
			this.getUserDetails();
		} else if (response.status === 'not_authorized') {
			// The person is logged into Facebook, but not your app.
			console.log('Please log into this app.');
			this.fbStatus = true;
			this.appStatus = false;
		} else {
			// The person is not logged into Facebook, so we're not sure if
			// they are logged into this app or not.
			this.fbStatus = false;
			this.appStatus = false;
		}
		if(this.fbSDKLoaded) {
				if(this.fbStatus && !this.appStatus) {
					this.showFBIcon();
					this.showErrorMessage("Please signon to application. wih the below Sign on button");
				}
				else if(!this.fbStatus) {
					this.showFBIcon();
					this.showErrorMessage("Please signon to FB and the application. wih the below Sign on button");
				}
			else {
				this.showErrorMessage("!!!! OOPS You Have Slow / No network Connectivity issues.!!!!");
			}
		}
	}
	
	
	/**
	Fetch User Details 
	**/
	getUserDetails () {
		let userPromise = this._facebookService.getUserDetails(),
			_this = this;
		this.showLoader("Fetching User Details ...");	
		
		userPromise.then(function (response) {
			_this.fbFirstName = response.first_name;
			_this.fbLastName = response.last_name ;
			_this.getUserPicture(response.id);
		},
		function (response) {
			_this.showErrorMessage("Could not able to fetch the user Details");
		});
	}
	
	/**
	Get the Profile Picture of the user
	**/
	getUserPicture (userId) {
		let userPromise = this._facebookService.getProfilePicture(userId),
			_this = this;
		this.showLoader("Fetching Profile Picture Details ...");
		userPromise.then(function (response) {
			_this.fbProfileDetailsURL = response.data.url;
			console.log("profile details");
			console.log(response);
			_this.getAlbumsList();
		},
		function (response) {
			_this.showErrorMessage("Could not able to fetch the user Details");
		});
	}
	
	/**
	fetch the album list for the logged in user
	**/
	getAlbumsList () {
		this.showLoader("Fetching your Album Details ...");
		let albumPromise = this._facebookService.getListofAlbums(),
			_this = this;
		albumPromise.then(function(response){
			console.log("retreived Albums");
			console.log(response);
			_this.hideLoader();
			_this.albumData = response.data;
			_this.showContent();
			if(_this.albumData.length === 0) {
				_this.showFBIcon();
				_this.showErrorMessage("The logged in creds will not work in our application . Please do login with the mentioned creds at the top.");
				_this.hideContent();
			}
			
			_this.albumScroller = new IScroll('#fbSrollWrapper', { scrollX: true, scrollY: false, mouseWheel: true });
			setTimeout(function () {
				_this.albumScroller.refresh();
				console.log("scroll refreshed");
			}, 1000);
			
		}, function(response){
			_this.hideLoader();
			console.log("failed retreiving Albums");
			_this.showErrorMessage("Error while loading Album Data. Please refresh and  try again");
		});
	}

	getAlbumPhotos (albumID, albumName) {
		this.selectedAlbumName = albumName;
		let albumPhotosPromise = this._facebookService.getListofPhotos(albumID),
			_this = this;
		albumPhotosPromise.then(response => _this.loadAlbumPhotos(response), response => _this.errorWhileFetchingPhotos);
	}
	
	loadAlbumPhotos (response) {
	let _this = this;
		$('#modal-content').modal({
			show: true
		});
		this.selectedAlbumPhotos = response.data;
		this.photoScroller = new IScroll('#fbPhotoSrollWrapper');
		setTimeout(function () {
			_this.photoScroller.refresh();
		}, 1000);
	}
	
	errorWhileFetchingPhotos (response) {
		console.log("errorWhileFetchingPhotos");
	}
	
	toggleSelection (domElement) {
		$(domElement).toggleClass("selected");
	}
	
	hideLoaderMsg () {
		$("facebookSection .loaderMessage").hide();
	}
	
	loginToFB() {
		let loginPromise = this._facebookService.logintoFacebook(),
			_this = this;
		loginPromise.then(function (response) {
		console.log(response.authResponse.grantedScopes);
		if(response.authResponse.grantedScopes.substring("user_photos")) {
			$("#fbSrollWrapper").show();
			console.log("User has access");
			_this.hideFBIcon();
			_this.hideErrorMessage();
			_this.getUserDetails();
		}
		else {
			console.log("User doesn't have access");
			_this.showErrorMessage("The logged in creds will not work in our application . Please do login with the mentioned creds at the top.");
			$("#fbSrollWrapper").hide();
		}
			
		}, function (response) {
			_this.showErrorMessage("FaceBook login error");
		});
	}
	
	createCollage () {
		let itemsSelected = $("facebooksection .album-photos .item.selected").find("img");
		$("#myCollage").html(itemsSelected);
		$("#myCollage").show();
		$("#myCollage").collagePlus();
		console.log(itemsSelected);
		$('#modal-content').modal('hide');
		html2canvas($("#myCollage")[0], {
		  onrendered: function(canvas) {
			document.body.appendChild(canvas);
			let dataURL = canvas.toDataURL("image/png");
			dataURL.replace("data:image/png;", "data:application/octet-stream;");
			$('#downloadCollageRef').attr("href",dataURL);
			}
		});
		$('#modal-collage').modal({
			show: true
		});
	}
	
	downloadCollage () {
		
	}
}
