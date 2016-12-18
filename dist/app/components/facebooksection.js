System.register(['angular2/core', './../services/fb.js'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, fb_js_1;
    var facebookSection;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (fb_js_1_1) {
                fb_js_1 = fb_js_1_1;
            }],
        execute: function() {
            facebookSection = (function () {
                /**
                    constructor function by implementing the utitlity services/utility
                **/
                function facebookSection(_facebookService) {
                    this._facebookService = _facebookService;
                    this.resetValues();
                    this.hideFBIcon();
                    this.hideContent();
                    this.showLoader("Checking Your FB status. This might take a few seconds depending on ur network.");
                }
                /**
                    Inititalisation phase of the content class
                **/
                facebookSection.prototype.ngOnInit = function () {
                    // load facebook SDK to use the properties of it
                    var myPromise = this._facebookService.initFB(), _this = this;
                    this.hideFBIcon();
                    myPromise.then(function (response) {
                        _this.authChangeCallback(response);
                    }, function () {
                        _this.resetValues();
                    });
                    setTimeout(function () {
                        // Check if loader is still available then show the appropriate message.
                        var $this = _this;
                        $this.hideLoader();
                        if ($this.fbSDKLoaded) {
                            if ($this.fbStatus && !$this.appStatus) {
                                $this.showFBIcon();
                            }
                            else if (!$this.fbStatus) {
                                $this.showFBIcon();
                            }
                        }
                        else {
                            $this.showErrorMessage("!!!! OOPS You Have Slow / No network Connectivity issues.!!!!");
                        }
                    }, 10000);
                };
                facebookSection.prototype.hideFBIcon = function () {
                    $(".facebookLogoContainer").hide();
                    $(".fbHeader").hide();
                };
                facebookSection.prototype.showFBIcon = function () {
                    $(".facebookLogoContainer").show();
                    $(".fbHeader").show();
                };
                facebookSection.prototype.hideContent = function () {
                    $("#fbSrollWrapper").hide();
                };
                facebookSection.prototype.showContent = function () {
                    $("#fbSrollWrapper").show();
                };
                facebookSection.prototype.showLoader = function (msg) {
                    this.errorMessage = null;
                    this.loaderMessage = msg;
                    $("#facebookSection .loader").show();
                };
                facebookSection.prototype.hideLoader = function () {
                    $("#facebookSection .loader").hide();
                };
                facebookSection.prototype.resetValues = function () {
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
                };
                facebookSection.prototype.showErrorMessage = function (msg) {
                    this.errorMessage = msg;
                    $("facebooksection .errorMessage").show();
                };
                facebookSection.prototype.hideErrorMessage = function () {
                    $("facebooksection .errorMessage").hide();
                };
                facebookSection.prototype.authChangeCallback = function (response) {
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
                    }
                    else if (response.status === 'not_authorized') {
                        // The person is logged into Facebook, but not your app.
                        console.log('Please log into this app.');
                        this.fbStatus = true;
                        this.appStatus = false;
                    }
                    else {
                        // The person is not logged into Facebook, so we're not sure if
                        // they are logged into this app or not.
                        this.fbStatus = false;
                        this.appStatus = false;
                    }
                    if (this.fbSDKLoaded) {
                        if (this.fbStatus && !this.appStatus) {
                            this.showFBIcon();
                            this.showErrorMessage("Please signon to application. wih the below Sign on button");
                        }
                        else if (!this.fbStatus) {
                            this.showFBIcon();
                            this.showErrorMessage("Please signon to FB and the application. wih the below Sign on button");
                        }
                        else {
                            this.showErrorMessage("!!!! OOPS You Have Slow / No network Connectivity issues.!!!!");
                        }
                    }
                };
                /**
                Fetch User Details
                **/
                facebookSection.prototype.getUserDetails = function () {
                    var userPromise = this._facebookService.getUserDetails(), _this = this;
                    this.showLoader("Fetching User Details ...");
                    userPromise.then(function (response) {
                        _this.fbFirstName = response.first_name;
                        _this.fbLastName = response.last_name;
                        _this.getUserPicture(response.id);
                    }, function (response) {
                        _this.showErrorMessage("Could not able to fetch the user Details");
                    });
                };
                /**
                Get the Profile Picture of the user
                **/
                facebookSection.prototype.getUserPicture = function (userId) {
                    var userPromise = this._facebookService.getProfilePicture(userId), _this = this;
                    this.showLoader("Fetching Profile Picture Details ...");
                    userPromise.then(function (response) {
                        _this.fbProfileDetailsURL = response.data.url;
                        console.log("profile details");
                        console.log(response);
                        _this.getAlbumsList();
                    }, function (response) {
                        _this.showErrorMessage("Could not able to fetch the user Details");
                    });
                };
                /**
                fetch the album list for the logged in user
                **/
                facebookSection.prototype.getAlbumsList = function () {
                    this.showLoader("Fetching your Album Details ...");
                    var albumPromise = this._facebookService.getListofAlbums(), _this = this;
                    albumPromise.then(function (response) {
                        console.log("retreived Albums");
                        console.log(response);
                        _this.hideLoader();
                        _this.albumData = response.data;
                        _this.showContent();
                        if (_this.albumData.length === 0) {
                            _this.showFBIcon();
                            _this.showErrorMessage("The logged in creds will not work in our application . Please do login with the mentioned creds at the top.");
                            _this.hideContent();
                        }
                        _this.albumScroller = new IScroll('#fbSrollWrapper', { scrollX: true, scrollY: false, mouseWheel: true });
                        setTimeout(function () {
                            _this.albumScroller.refresh();
                            console.log("scroll refreshed");
                        }, 1000);
                    }, function (response) {
                        _this.hideLoader();
                        console.log("failed retreiving Albums");
                        _this.showErrorMessage("Error while loading Album Data. Please refresh and  try again");
                    });
                };
                facebookSection.prototype.getAlbumPhotos = function (albumID, albumName) {
                    this.selectedAlbumName = albumName;
                    var albumPhotosPromise = this._facebookService.getListofPhotos(albumID), _this = this;
                    albumPhotosPromise.then(function (response) { return _this.loadAlbumPhotos(response); }, function (response) { return _this.errorWhileFetchingPhotos; });
                };
                facebookSection.prototype.loadAlbumPhotos = function (response) {
                    var _this = this;
                    $('#modal-content').modal({
                        show: true
                    });
                    this.selectedAlbumPhotos = response.data;
                    this.photoScroller = new IScroll('#fbPhotoSrollWrapper');
                    setTimeout(function () {
                        _this.photoScroller.refresh();
                    }, 1000);
                };
                facebookSection.prototype.errorWhileFetchingPhotos = function (response) {
                    console.log("errorWhileFetchingPhotos");
                };
                facebookSection.prototype.toggleSelection = function (domElement) {
                    $(domElement).toggleClass("selected");
                };
                facebookSection.prototype.hideLoaderMsg = function () {
                    $("facebookSection .loaderMessage").hide();
                };
                facebookSection.prototype.loginToFB = function () {
                    var loginPromise = this._facebookService.logintoFacebook(), _this = this;
                    loginPromise.then(function (response) {
                        console.log(response.authResponse.grantedScopes);
                        if (response.authResponse.grantedScopes.substring("user_photos")) {
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
                };
                facebookSection.prototype.createCollage = function () {
                    var itemsSelected = $("facebooksection .album-photos .item.selected").find("img");
                    $("#myCollage").html(itemsSelected);
                    $("#myCollage").show();
                    $("#myCollage").collagePlus();
                    console.log(itemsSelected);
                    $('#modal-content').modal('hide');
                    html2canvas($("#myCollage")[0], {
                        onrendered: function (canvas) {
                            document.body.appendChild(canvas);
                            var dataURL = canvas.toDataURL("image/png");
                            dataURL.replace("data:image/png;", "data:application/octet-stream;");
                            $('#downloadCollageRef').attr("href", dataURL);
                        }
                    });
                    $('#modal-collage').modal({
                        show: true
                    });
                };
                facebookSection.prototype.downloadCollage = function () {
                };
                facebookSection = __decorate([
                    core_1.Component({
                        selector: 'facebookSection',
                        templateUrl: './app/templates/facebookTemplate.html',
                        providers: [fb_js_1.FacebookService]
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof fb_js_1.FacebookService !== 'undefined' && fb_js_1.FacebookService) === 'function' && _a) || Object])
                ], facebookSection);
                return facebookSection;
                var _a;
            }());
            exports_1("facebookSection", facebookSection);
        }
    }
});
