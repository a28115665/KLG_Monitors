angular.module('app.controllers', [])
	.factory('settings', ['$rootScope', function($rootScope){
		// supported languages
		
		var settings = {
			languages: [
				{
					language: 'English',
					translation: 'English',
					langCode: 'en',
					flagCode: 'us'
				},
				{
					language: 'Espanish',
					translation: 'Espanish',
					langCode: 'es',
					flagCode: 'es'
				},
				{
					language: 'German',
					translation: 'Deutsch',
					langCode: 'de',
					flagCode: 'de'
				},
				{
					language: 'Korean',
					translation: '한국의',
					langCode: 'ko',
					flagCode: 'kr'
				},
				{
					language: 'French',
					translation: 'français',
					langCode: 'fr',
					flagCode: 'fr'
				},
				{
					language: 'Portuguese',
					translation: 'português',
					langCode: 'pt',
					flagCode: 'br'
				},
				{
					language: 'Russian',
					translation: 'русский',
					langCode: 'ru',
					flagCode: 'ru'
				},
				{
					language: 'Chinese',
					translation: '中國的',
					langCode: 'zh',
					flagCode: 'cn'
				}
			],
			
		};

		return settings;
		
	}])

	.controller('PageViewController', ['$scope', '$route', '$animate', function($scope, $route, $animate) {
		// controler of the dynamically loaded views, for DEMO purposes only.
		/*$scope.$on('$viewContentLoaded', function() {
			
		});*/
	}])

	.controller('SmartAppController', ['$scope', function($scope) {
		// your main controller
	}])

	.controller('LangController', ['$scope', 'settings', 'localize', function($scope, settings, localize) {
		$scope.languages = settings.languages;
		$scope.currentLang = settings.currentLang;
		$scope.setLang = function(lang) {
			settings.currentLang = lang;
			$scope.currentLang = lang;
			localize.setLang(lang);
		};

		// set the default language
		$scope.setLang($scope.currentLang);

	}])
	
;

angular.module('app.demoControllers', [])
	.controller('WidgetDemoCtrl', ['$scope', '$sce', function($scope, $sce) {
		$scope.title = 'SmartUI Widget';
		$scope.icon = 'fa fa-user';
		$scope.toolbars = [
			$sce.trustAsHtml('<div class="label label-success">\
				<i class="fa fa-arrow-up"></i> 2.35%\
			</div>'),
			$sce.trustAsHtml('<div class="btn-group" data-toggle="buttons">\
				<label class="btn btn-default btn-xs active">\
					<input type="radio" name="style-a1" id="style-a1"> <i class="fa fa-play"></i>\
				</label>\
				<label class="btn btn-default btn-xs">\
					<input type="radio" name="style-a2" id="style-a2"> <i class="fa fa-pause"></i>\
				</label>\
				<label class="btn btn-default btn-xs">\
					<input type="radio" name="style-a2" id="style-a3"> <i class="fa fa-stop"></i>\
				</label>\
			</div>')
		];

		$scope.content = $sce.trustAsHtml('\
						Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\
						tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\
						quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\
						consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\
						cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\
						proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
	}])

	.controller('ActivityDemoCtrl', ['$scope', function($scope) {
		var ctrl = this;
		ctrl.getDate = function() {
			return new Date().toUTCString();
		};

		$scope.refreshCallback = function(contentScope, done) {

			// use contentScope to get access with activityContent directive's Control Scope
			console.log(contentScope);

			// for example getting your very long data ...........
			setTimeout(function() {
				done();
			}, 3000);

			$scope.footerContent = ctrl.getDate();
		};

		$scope.items = [
			{
				title: 'Msgs',
				count: 14, 
				src: 'ajax/notify/mail.html',
				onload: function(item) {
					console.log(item);
					alert('[Callback] Loading Messages ...');
				}
			},
			{
				title: 'Notify',
				count: 3,
				src: 'ajax/notify/notifications.html'
			},
			{
				title: 'Tasks',
				count: 4,
				src: 'ajax/notify/tasks.html',
				//active: true
			}
		];

		$scope.total = 0;
		angular.forEach($scope.items, function(item) {
			$scope.total += item.count;
		});

		$scope.footerContent = ctrl.getDate();
		
	}])
;

angular.module('app.forumControllers', [])
	.constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            logoutFailed: 'auth-logout-failed',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
        admin: 'Admin',
        user: 'User',
        guest: 'Guest'
    })

    .constant('INITIATE', {
        _URL: 'http://127.0.0.1:8085/KLG_Monitors/',
    })

    .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
        GoogleMapApi.configure({
            // key: 'your api key',
            v: '3.17',
            libraries: 'places',
            china: true
        });
    }])

    .factory('AuthService',
        function ($rootScope, $http, Session, forumService, toaster) {
            var authService = {};

            authService.login = function (credentials) {
				// console.log(credentials);
                var login = {
                    title: "Login",
                    jspUrl: "jsp/",
                    handler: "DBSelect.jsp",
                    addr: $rootScope._URL,
                    queryname: 'SelectAllUserInfo',
                    query: {
                        U_ID    : credentials.U_ID,
                        U_PW    : credentials.U_PW,
                        U_Check : 1
                    }
                };
            	var promise = forumService.searchMSSQLData(login);
            	promise.then(function(res) {
                	// console.log('testinlogin', res.selectObject);
                    if(res.selectObject.length == 0){
                        // logger.logError("帳號或密碼錯誤");
                        // console.log('帳號或密碼錯誤');
                        toaster.pop('error', "", "帳號或密碼錯誤", 3000);
                    }else{
                        if(res.selectObject[0].U_ID == credentials.U_ID && res.selectObject[0].U_PW == credentials.U_PW){
                            // logger.logSuccess(res.response.docs[0].User_Name+' 登入成功');
                            // console.log(res.response.docs[0].U_Name+' 登入成功');
                            toaster.pop('success', "", "登入成功", 3000);
                            Session.create(res.selectObject[0].U_ID, res.selectObject[0].U_Name, res.selectObject[0].U_Role/*res.user.role*/);
                            return res.selectObject[0];
                        }
                    };
                }, function(data) {
                    return console.log('loginFailed');
                });

                return promise;
            };

            authService.register = function (register) {
                return forumService.applyInsert('jsp/DBInsert.jsp', JSON.stringify(register));
            };

            authService.logout = function () {
                return Session.destroy();
            };

            authService.isAuthenticated = function () {
                // console.log("is:", localStorage.getItem('loginStatusForMonitors'));
                if(JSON.parse(localStorage.getItem('loginStatusForMonitors')) != null)
                    return !!JSON.parse(localStorage.getItem('loginStatusForMonitors')).U_Name;
                else
                    return null;
            };
         
            authService.isAuthorized = function (authorizedRoles) {
                // console.log("authorizedRoles:",authorizedRoles);
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                // console.log(authService.isAuthenticated(), authorizedRoles.indexOf(JSON.parse(localStorage.getItem('loginStatusForMonitors')).userRole) !== -1);
                return (authService.isAuthenticated() && authorizedRoles.indexOf(JSON.parse(localStorage.getItem('loginStatusForMonitors')).userRole) !== -1);
            };
         
            return authService;
    })

    .service('Session', function () {
        this.create = function (sessionId, userId, userRole) {
            localStorage.setItem('loginStatusForMonitors', JSON.stringify({
                id : sessionId,
                userId : userId,
                userRole : userRole
            }));
            // this.id = sessionId;
            // this.userId = userId;
            // this.userRole = userRole;
        };
        this.destroy = function () {
            localStorage.removeItem('loginStatusForMonitors');
            // this.id = null;
            // this.userId = null;
            // this.userRole = null;
        };
        return this;
    })

	.service("forumService", function ($rootScope, $http, $q, $modal, $cookieStore, $location, toaster, INITIATE) {

		// this.changePermissions = function () {
		// 	$rootScope.UserInfo = JSON.parse(localStorage.getItem('loginStatusForMonitors'))
		// },
		$rootScope.UserInfo = JSON.parse(localStorage.getItem('loginStatusForMonitors')),
		//$rootScope.folderName = $rootScope.UserInfo == null?'':encodeURI($rootScope.UserInfo['U_Name']+$rootScope.UserInfo['U_PublishDT'].replace(/\s/g,"").replace(/:/g,"_"))+'/',
		$rootScope.folderName = 'uploads',
        $rootScope.createFolderPath = '/KLG_Monitors/jsp/createFolder.jsp?file-upload-path=', //C:/Users/User/Desktop/example/jetty_demo/webapps/root
		$rootScope.uploadURL='/KLG_Monitors/jsp/uploadFile.jsp?file-upload=',//C:/Users/User/Desktop/example/jetty_demo/webapps/root/ESVC/uploads/',
		$rootScope._URL= INITIATE._URL,

		$rootScope.forumTopicRelation = JSON.parse(localStorage.getItem('forumTopicRelation')),
		$rootScope.forumPostRelation = JSON.parse(localStorage.getItem('forumPostRelation')),
		$rootScope.readyToResolved = JSON.parse(localStorage.getItem('readyToResolved')),
		$rootScope.questionRateData = JSON.parse(localStorage.getItem('questionRateData')),
		$rootScope.readyToFAQ = JSON.parse(localStorage.getItem('readyToFAQ')),
		// $rootScope.forumPost = localStorage.getItem('forumPost'),

		this.searchMSSQLData = function (dataSrc) {
            // var query = $rootScope.appCtrl.query? $rootScope.appCtrl.query:"*:*";
            // console.log("dataSrc:", JSON.stringify(dataSrc.query));
            var deferred = $q.defer();

		    $http({
                method: 'GET',
                //dataType: 'JSON',
                url: dataSrc.jspUrl + dataSrc.handler,
                params: { 
                    'table': dataSrc.table,
                    'queryname': dataSrc.queryname,
                    'query': encodeURI(JSON.stringify(dataSrc.query)),
                    'whouse': $rootScope.UserInfo != null ? encodeURI(JSON.stringify($rootScope.UserInfo.U_ID)) : 'Guest'
                }
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
		    }).error(function(data, status, headers, config) {
                deferred.reject(data);
		    });
            return deferred.promise;
        },

        this.insertMSSQLData = function (dataSrc) {
            // var query = $rootScope.appCtrl.query? $rootScope.appCtrl.query:"*:*";
            // console.log("dataSrc:", dataSrc.insert);
            // console.log(dataSrc.jspUrl + dataSrc.handler);
            var deferred = $q.defer();

            $http({
                method: 'GET',
                //dataType: 'JSON',
                url: dataSrc.jspUrl + dataSrc.handler,
                params: { 
                    'table': dataSrc.table,
                    'insertname': dataSrc.insertname,
                    'insert': dataSrc.insert,//encodeURI(JSON.stringify(dataSrc.insert))
                    'whouse': $rootScope.UserInfo != null ? encodeURI(JSON.stringify($rootScope.UserInfo.U_ID)) : 'Guest'
                }
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        },

        this.updateMSSQLData = function (dataSrc) {
            // var query = $rootScope.appCtrl.query? $rootScope.appCtrl.query:"*:*";
            // console.log("dataSrc:", JSON.stringify(dataSrc));
            var deferred = $q.defer();

            $http({
                method: 'GET',
                //dataType: 'JSON',
                url: dataSrc.jspUrl + dataSrc.handler,
                params: { 
                    'table': dataSrc.table,
                    'updatename': dataSrc.updatename,
                    'update': dataSrc.update,//encodeURI(JSON.stringify(dataSrc.update)),
                    'query': dataSrc.query,//encodeURI(JSON.stringify(dataSrc.query))
                    'whouse': $rootScope.UserInfo != null ? encodeURI(JSON.stringify($rootScope.UserInfo.U_ID)) : 'Guest'
                }
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred;
        },

        this.deleteMSSQLData = function (dataSrc) {
            // var query = $rootScope.appCtrl.query? $rootScope.appCtrl.query:"*:*";
            // console.log("dataSrc:", JSON.stringify(dataSrc.query));
            var deferred = $q.defer();

            $http({
                method: 'GET',
                //dataType: 'JSON',
                url: dataSrc.jspUrl + dataSrc.handler,
                params: { 
                    'table': dataSrc.table,
                    'query': dataSrc.query,//encodeURI(JSON.stringify(dataSrc.query))
                    'whouse': $rootScope.UserInfo != null ? encodeURI(JSON.stringify($rootScope.UserInfo.U_ID)) : 'Guest'
                }
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        },

        this.applyInsert = function (url, jsonData){
            // console.log("URL: " + url + "\nCommand: " + jsonData);
            // console.log(JSON.parse(jsonData));
            var xmlhttp = getXMLHttpObject();   
            // console.log(xmlhttp);
            xmlhttp.onreadystatechange=function(){
                if (xmlhttp.readyState == 4) {
                    if(xmlhttp.status == 200 && xmlhttp.responseText.trim() !== "null"){
	        			toaster.pop('note', "", "更新成功!!", 3000);
	        			return 'Success';
                    }
                        // alert('已更新資料！\n' + xmlhttp.responseText);
                    else{
	        			toaster.pop('error', "", "更新失敗!!", 3000);
                        return 'Fail';
                    }
                        // alert('update result: '+xmlhttp.status+'  '+xmlhttp.responseText);
                }
            }       

            // url += '?table=0&insertname=Insert&insert=' + encodeURI(encodeURI(jsonData));
            url += '?table=0&insertname=Insert&insert=' + encodeURIComponent(encodeURIComponent(jsonData)) + '&whouse=' + ($rootScope.UserInfo != null ? encodeURI(JSON.stringify($rootScope.UserInfo.U_ID)) : 'Guest');
            // console.log(url);
            xmlhttp.open('POST', url, true);
            // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlhttp.setRequestHeader("Content-type", "text/html; charset=UTF-8");
            xmlhttp.send();

            return 'Success';
        },

		this.formatBytes = function (bytes) {
		    if(bytes < 1024) return bytes + " Bytes";
		    else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KB";
		    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MB";
		    else return(bytes / 1073741824).toFixed(3) + " GB";
		};

        function getXMLHttpObject (){
            var xmlhttp;
            if (window.XMLHttpRequest){
                xmlhttp = new XMLHttpRequest();
            }
            else{
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            return xmlhttp;
        };

        //VM LocalTime Set To YYYY-MM-DD HH:mm:ss
        this.SetTimeToSQL = function(time){
            return  [time.getFullYear(), time.getMonth()+1, time.getDate()].join('-')+' '+
                    [time.getHours(), time.getMinutes(), time.getSeconds()].join(':');
        };

        //VM LocalTime Set To YYYY/MM/DD
        this.SetDateToSort = function(time){
            return  [time.getFullYear(), time.getMonth()+1 < 10 ? ("0" + (time.getMonth()+1)) : time.getMonth()+1, time.getDate() < 10 ? ("0" + time.getDate()) : time.getDate()].join('-');
        };

		function definedTypeOf (defined) {
            return typeof defined == 'undefined' ? true : false;
        };

        this.DeleteAdditionalKey = function(data){
			for (var i in data){
        		for (var j in data[i]) {
        			switch(j){
        				case 'B_Class'    : delete data[i]['B_Class'];     break;
        				case 'B_ClassLock': delete data[i]['B_ClassLock']; break;
        				case 'F_HasChange': delete data[i]['F_HasChange']; break;
        				case '_version_'  : delete data[i]['_version_'];   break;
        				case 'timestamp'  : delete data[i]['timestamp'];   break;
        				case '$$hashKey'  : delete data[i]['$$hashKey'];   break;
        			}
        		}
        	}
        	return data;
        };

        // Only use in MasterPage and Setting
        this.SearchFromDatePicker = function(from, to, filterStores, oriStores, dateKey){
        	from = definedTypeOf(from)?0:new Date(from).getTime();
        	to = definedTypeOf(to)?9999999999999:new Date(to).getTime();
            filterStores = [];
        	for(var i=0;i<oriStores.length;i++){
        		var time = new Date(ChangeDateType(oriStores[i][dateKey])).getTime();
        		// console.log(from, time, to);
        		if (from <= time && time <= to){
        			filterStores.push(oriStores[i]);
        		}
        	}
            return filterStores;
        };

        function ChangeDateType(date){
			var pattern=/(上午|下午)(\d+)/,
				k = date.match(pattern),
				time;
			if(date.match(/上午/g)){
				time = parseInt(k[0].replace(/上午/g,''));
			}
			if(date.match(/下午/g)){
				time = parseInt(k[0].replace(/下午/g,''))+12;
        	}
        	date = date.replace(/(上午|下午)(\d+)/g,time);

        	return date.replace(/(年|月|日 )/g,',');
        };

        // Grid下拉式選單
        // constant->值, columnName->欄位名稱
        this.editDropdownOptions = function(constant, columnName) {
            // console.log(constant);
            var f_constant = [];
            for (var i in constant) {
                f_constant.push({
                    id: parseInt(i)
                });
                f_constant[i][columnName] = constant[i];
            }
            // console.log(f_constant);
            return f_constant;
        };

	})

	.controller('UpLoadCtrl', ['$scope', function ($scope) {

		$scope.UserID      = 'User1/';
		$scope.StroePath   = ''
		$scope.CurrentPath = $scope.StroePath + $scope.UserID;
		
	}])

	.controller('EditorCtrl', ['$scope', '$http', function ($scope, $http) {

		$scope.SaveEditor = function() {
			console.log(angular.element(document.querySelector('.note-editable')).html());
		};

	}])

	.controller('LoginPageCtrl', ['$scope', '$rootScope', '$location', 'Session', 'forumService', 'AuthService', 'AUTH_EVENTS', 'toaster', 
		function ($scope, $rootScope, $location, Session, forumService, AuthService, AUTH_EVENTS, toaster) {

			//預設為Guest
			// Session.create('Guest', '訪客', 'Guest');
			// forumService.changePermissions();

			// $scope.ChangePermissions = function(id, name, Permissions) {
			// 	Session.create(id, name, Permissions);
			// 	forumService.changePermissions();
			// };

			$scope.credentials = {
				U_ID: $rootScope.UserInfo == null ? '' : $rootScope.UserInfo.U_ID,
	            U_PW: $rootScope.UserInfo == null ? '' : $rootScope.UserInfo.U_PW
			};
			$scope.login = function (credentials) {
				// console.log('credentials:',credentials);
				// console.log('UserInfo:',$rootScope.UserInfo);

				if(credentials != null && $rootScope.UserInfo == null){
					//如果是訪客
					if(credentials.U_ID == ''){
				    	if (!$.root_.hasClass("menu-on-top")){
							$('html').toggleClass("hidden-menu-mobile-lock");
							$.root_.toggleClass("hidden-menu");
							$.root_.removeClass("minified");
				    	} else if ( $.root_.hasClass("menu-on-top") && $.root_.hasClass("mobile-view-activated") ) {
				    		$('html').toggleClass("hidden-menu-mobile-lock");
							$.root_.toggleClass("hidden-menu");
							$.root_.removeClass("minified");
				    	}
					}else{
						AuthService.login(credentials).then(function (user) {
			                // console.log("user:",user);
			                if(user.selectObject.length > 0){
			                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			                    localStorage.setItem('loginStatusForMonitors', JSON.stringify({
			                        U_ID        : user.selectObject[0].U_ID,
			                        U_Name      : user.selectObject[0].U_Name, 
			                        U_Branch    : user.selectObject[0].U_Branch, 
                                    U_Police    : user.selectObject[0].U_Police, 
			                        U_PW        : user.selectObject[0].U_PW, 
			                        U_Role      : user.selectObject[0].U_Role, 
			                        U_CK_TIME   : user.selectObject[0].U_CK_TIME,
		                            U_CR_TIME   : user.selectObject[0].U_CR_TIME,
		                            U_Check     : user.selectObject[0].U_Check,
                                    B_Name      : user.selectObject[0].B_Name, 
                                    P_Name      : user.selectObject[0].P_Name 
			                    }));
			                    $rootScope.UserInfo = [JSON.parse(localStorage.getItem('loginStatusForMonitors'))];
			                    // console.log("UserInfo:",$scope.UserInfo);
			                    // $scope.$watch("UserInfo",function (newValue, oldValue){
			                    //     console.log("value:", newValue, oldValue);
			                    // },true);
			                    // $location.path('/MasterPage');
			                    // toaster.pop('success', "", "登入成功", 3000);
			                    // location.href='/KLG/#/VM10';
			                }
			            }, function () {
			            	toaster.pop('error', "", "登入失敗", 3000);
			                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
			            });
					}
				}
	        };

			$scope.signupORforgotpw = '';
			$scope.clickSF = function(which){
				// console.log(which=='註冊');
				switch (which) {
	                case '註冊':
	                    return $scope.signupORforgotpw = true;
	                break;
	                case '忘記密碼':
	                    return $scope.signupORforgotpw = false;
	                break;
	            }
			};

			$scope.SendMail = function(userEmail){
				console.log(userEmail);
			};
		}
	])

	.controller('RegisterController', ["$scope", "$rootScope", "$location", "AUTH_EVENTS", "AuthService", "USER_ROLES", 'forumService', 
        function ($scope, $rootScope, $location, AUTH_EVENTS, AuthService, USER_ROLES, forumService) {
            var d = new Date();
            $scope.registers = {
            	U_ID          : '',
                U_Role        : USER_ROLES.user,
                U_Name        : '',
                U_PW          : '',
                U_Branch      : null,
                U_Police      : null,
                U_CR_TIME     : forumService.SetTimeToSQL(d),
                //U_CK_TIME     : null,
                U_Check       : 0
            };

            $scope.register = function (registers) {
                $scope.show = {
                    Success:{
                        bool: false,
                        Messages: ''
                    },
                    Error:{
                        bool: false,
                        Messages: ''
                    }
                };

                // console.log("registers:",registers);
                var emailRegxp = /^([\w]+)(.[\w]+)*$/;
                var passwordRegxp = /^.*(?=.{6,12})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/;
                if(registers.U_Name == '' || registers.U_Password == '' || registers.U_Branch == null || registers.U_Police == null){
                	$scope.show['Error'].bool = true;
                	$scope.show['Error'].Messages = '註冊資料尚有錯誤或輸入不完整';
                }else if(passwordRegxp.test(registers.U_Password) != true){
                	$scope.show['Error'].bool = true;
                	$scope.show['Error'].Messages = '密碼長度需6~12英數大小寫特殊符號數字混合';
                }else{
                	// registers.U_ID = registers.U_Name.replace(/\s/g,"") +'_'+registers.U_Password+'_'+registers.U_PublishTime;

                    var 確認信箱重複否 = {
                        active: true,
                        title: "Login",
                        jspUrl: "jsp/",
                        handler: "DBSelect.jsp",
                        addr: $rootScope._URL,
                        queryname: 'SelectAllUserInfo',
                        query: {
                            U_ID : registers.U_ID
                        }
                    };
                    var promise = forumService.searchSolrData(確認信箱重複否);
                    promise.then(function(res) {
                        if(res.response.numFound > 0){
                            $scope.show['Error'].bool = true;
                            $scope.show['Error'].Messages = '此信箱已有人註冊';
                            console.log('註冊失敗');
                        }else{
                            if(AuthService.register(registers) == 'success'){
                                $scope.show['Error'].bool = false;
                                $scope.show['Success'].bool = true;
                                $scope.show['Success'].Messages = '註冊成功 等待管理員確認名單';
                                console.log('註冊成功');
                                // $location.path('/pages/signin');
                            }else{
                                console.log('註冊失敗');
                            }
                            
                        }
                    }, function(data) {
                        return 'fail';
                    });
                }
                
            };
        }
    ])

	.controller('HeaderCtrl', ['$scope', '$rootScope', 'Session', 'forumService', '$modal', 'AuthService', 'AUTH_EVENTS', 'toaster', function ($scope, $rootScope, Session, forumService, $modal, AuthService, AUTH_EVENTS, toaster) {
		$scope.logout = function(){
			Session.destroy();
		};

		$scope.openLogin = function(data) {
            var modalInstance;
            modalInstance = $modal.open({
                templateUrl: "login.html",
                controller: "myModalOpenLoginCtrl",
                size: 'sm',
                resolve: {
                    items: function() {
                        return data
                    }
                }
            }), modalInstance.result.then(function(credentials) {
            	// console.log(credentials);
                AuthService.login(credentials).then(function (user) {
	                // console.log("user:",user);
	                if(user.selectObject.length > 0){
	                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
	                    localStorage.setItem('loginStatusForMonitors', JSON.stringify({
	                        U_ID        : user.selectObject[0].U_ID,
	                        U_Name      : user.selectObject[0].U_Name, 
	                        U_Branch    : user.selectObject[0].U_Branch, 
                            U_Police    : user.selectObject[0].U_Police,
	                        U_PW        : user.selectObject[0].U_PW, 
	                        U_Role      : user.selectObject[0].U_Role, 
	                        U_CK_TIME   : user.selectObject[0].U_CK_TIME,
                            U_CR_TIME   : user.selectObject[0].U_CR_TIME,
                            U_Check     : user.selectObject[0].U_Check,
                            B_Name      : user.selectObject[0].B_Name, 
                            P_Name      : user.selectObject[0].P_Name
	                    }));
	                    $rootScope.UserInfo = [JSON.parse(localStorage.getItem('loginStatusForMonitors'))];
	                    // console.log("UserInfo:",$scope.UserInfo);
	                    // $scope.$watch("UserInfo",function (newValue, oldValue){
	                    //     console.log("value:", newValue, oldValue);
	                    // },true);
	                    // $location.path('/MasterPage');
	                    // toaster.pop('success', "", "登入成功", 3000);
	                    // location.href='/KLG/#/VM10';
	                    location.reload();
	                }
	            }, function () {
	            	toaster.pop('error', "", "登入失敗", 3000);
	                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
	            });
            }, function() {
                // $log.info("Modal dismissed at: " + new Date)
            })
        };

        $scope.openRegister = function(data) {
            var modalInstance;
            modalInstance = $modal.open({
                templateUrl: "register.html",
                controller: "myModalOpenRegisterCtrl",
                size: 'sm',
                resolve: {
                    items: function() {
                        return data
                    }
                }
            }), modalInstance.result.then(function(registers) {
            	// console.log(registers);　
            	toaster.pop('success', "", "註冊成功，等待管理員確認名單", 3000);

                
            }, function() {
                // $log.info("Modal dismissed at: " + new Date)
            })
        };
	}])

	.controller("myModalOpenLoginCtrl", ["$scope", "$modalInstance", "items",
        function($scope, $modalInstance, items) {
            $scope.credentials = items, 
            // $scope.selected = {
            //     topic: "",
            //     content: ""
            // }, 
            $scope.ok = function() {
                $modalInstance.close($scope.credentials)
            }, $scope.cancel = function() {
                $modalInstance.dismiss("cancel")
            }
        }
    ])

    .controller("myModalOpenRegisterCtrl", ["$scope", "$rootScope", "$modalInstance", "items", "forumService", "AuthService", "$q", "BranchConstant",
        function($scope, $rootScope, $modalInstance, items, forumService, AuthService, $q, BranchConstant) {

            $scope.registerBranch = forumService.editDropdownOptions(BranchConstant.bData, 'U_Branch');
            $scope.registerPolice = {
                police : [],
                filterPolice : function(branch, fullPolice) {
                    // console.log(fullPolice, fullPolice[branch]);
                    $scope.registerPolice.police = fullPolice[branch];
                },
            };

            $scope.loadBranchAndPolice = function() {
                var 派出所完整資訊 = {
                    title: "loadPolice",
                    jspUrl: "jsp/",
                    handler: "DBSelect.jsp",
                    addr: $rootScope._URL,
                    queryname: 'SelectAllPolice'
                };
                $scope.policeFilterData = [];
                var promise1 = forumService.searchMSSQLData(派出所完整資訊);
                var 分局完整資訊 = {
                    title: "loadBranch",
                    jspUrl: "jsp/",
                    handler: "DBSelect.jsp",
                    addr: $rootScope._URL,
                    queryname: 'SelectAllBranch'
                };
                var promise2 = forumService.searchMSSQLData(分局完整資訊);
                $q.all([promise1, promise2]).then(function(res) {
                    if(res[0].selectObject.length == 0){
                        toaster.pop('warning', "", "無任何派出所資料", 3000);
                    }else if(res[1].selectObject.length == 0){
                        toaster.pop('warning', "", "無任何分局資料", 3000);
                    }else{
                        // Policy備用
                        $scope.registerFullPolice = {};
                        for (var i in res[1].selectObject){
                            $scope.registerFullPolice[i] = [];
                        }
                        for (var i in res[0].selectObject) {
                            if(res[0].selectObject[i].P_Exist == "1"){
                                $scope.registerFullPolice[res[0].selectObject[i].B_ID].push({
                                    id       : res[0].selectObject[i].P_ID,
                                    U_Police : res[0].selectObject[i].P_Name
                                });
                            }
                        }
                        // console.log($scope.registerFullPolice);
                    };
                }, function(data) {
                    return console.log('讀取派出所或分局資料Failed');
                });
            }

            $scope.registers = items, 
            // $scope.selected = {
            //     topic: "",
            //     content: ""
            // }, 
            $scope.ok = function(registers) {
            	$scope.show = {
                    Success:{
                        bool: false,
                        Messages: ''
                    },
                    Error:{
                        bool: false,
                        Messages: ''
                    }
                };

                //^.*(?=.{6,12})(?=.*(\d|[a-z]|[A-Z]|[@#$%^&+=])).*$
                var passwordRegxp = /^.*(?=.{6,12})(?=.*(\d|[a-z]|[A-Z]|[@#$%^&+=])).*$/;
                if(registers.U_Name == '' || registers.U_PW == '' || registers.U_ID == '' || registers.U_Branch == null || registers.U_Police == null){
                	$scope.show['Error'].bool = true;
                	$scope.show['Error'].Messages = '註冊資料尚有錯誤或輸入不完整';
                }else if(passwordRegxp.test($scope.registers.U_PW) != true){
                	$scope.show['Error'].bool = true;
                	$scope.show['Error'].Messages = '密碼長度需6-12(不含特殊符號)';
                }else{
                	var 確認帳號重複否 = {
	                    active: true,
	                    title: "Login",
	                    jspUrl: "jsp/",
	                    handler: "DBSelect.jsp",
	                    addr: $rootScope._URL,
	                    queryname: 'SelectAllUserInfo',
	                    query: {
	                        U_ID : $scope.registers.U_ID
	                    }
	                };
	                var promise = forumService.searchMSSQLData(確認帳號重複否);
	                promise.then(function(res) {
	                	// console.log(res);
	                    if(res.selectObject.length > 0){
	                        $scope.show['Error'].bool = true;
	                        $scope.show['Error'].Messages = '帳號已有人使用';
	                    }else{
	                    	console.log($scope.registers);
	                        if(AuthService.register($scope.registers) == 'Success'){
	                            $scope.show['Error'].bool = false;
	                            // $scope.show['Success'].bool = true;
	                            // $scope.show['Success'].Messages = '註冊成功 等待管理員確認名單';
		            			$modalInstance.close($scope.registers)
	                            // $location.path('/pages/signin');
	                        }else{
	                            console.log('註冊失敗');
	                        }
	                        
	                    }
	                }, function(data) {
	                    return 'fail';
	                });
		        }
            }, $scope.cancel = function() {
                $modalInstance.dismiss("cancel")
            }
        }
    ])

	.controller('MasterPageCtrl', ['$scope', '$rootScope', '$q', '$location', '$http', '$filter', '$cookieStore', '$modal', 'forumService', 'toaster', '$templateCache', 'uiGmapGoogleMapApi', 'uiGridConstants', 'DirectionConstant', 'BooleanConstant', 'MonitorConstant', 'BranchConstant', 'PoliceConstant',
        function ($scope, $rootScope, $q, $location, $http, $filter, $cookieStore, $modal, forumService, toaster, $templateCache, GoogleMapApi, uiGridConstants, DirectionConstant, BooleanConstant, MonitorConstant, BranchConstant, PoliceConstant) {

        GoogleMapApi.then(function(maps) {
            maps.visualRefresh = true;
            $scope.defaultBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(40.82148, -73.66450),
                new google.maps.LatLng(40.66541, -74.31715)
            );

            $scope.map.bounds = {
                northeast: {
                    latitude:$scope.defaultBounds.getNorthEast().lat(),
                    longitude:$scope.defaultBounds.getNorthEast().lng()
                },
                southwest: {
                    latitude:$scope.defaultBounds.getSouthWest().lat(),
                    longitude:-$scope.defaultBounds.getSouthWest().lng()
                }
            }
            $scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());
        });

        angular.extend($scope, {
            selected: {
                options: {
                    visible:false
                },
                templateurl:'window.tpl.html',
                templateparameter: {}
            },
            centers: {
                latitude: 25.1285109,
                longitude: 121.7452075
            },
            map: {
                control: {},
                center: {
                    latitude: 25.1285109,
                    longitude: 121.7452075
                    // latitude: 25.1299145,
                    // longitude: 121.7506363
                },
                zoom: 17,
                actualZoom: null,
                dragging: false,
                showMarkers: true,
                doCluster: true,
                doFit: true,
                bounds: {},
                markers: [],
                idkey: 'place_id',
                events: {
                    //不斷更新
                    idle: function (map) {
                        // $scope.map.actualZoom = map.getZoom();
                        // if ($scope.addMarkers)
                        // $scope.addMarkers($scope.monitorData);
                    },
                    dragend: function(map) {
                        //update the search box bounds after dragging the map
                        var bounds = map.getBounds();
                        var ne = bounds.getNorthEast();
                        var sw = bounds.getSouthWest(); 
                        $scope.searchbox.options.bounds = new google.maps.LatLngBounds(sw, ne);
                        $scope.searchbox.options.visible = true;
                    },
                    refresh: function (map) {
                        $scope.map.control.refresh(map);
                        $scope.map.zoom = map.zoom;
                    }
                }
            },
            searchbox: {
                template:'searchbox.tpl.html',
                //position:'top-right',
                position:'top-left',
                options: {
                    bounds: {}
                },
                //parentdiv:'searchBoxParent',
                events: {
                    places_changed: function (searchBox) {

                        places = searchBox.getPlaces()

                        if (places.length == 0) {
                            return;
                        }
                        // For each place, get the icon, place name, and location.
                        newMarkers = [];
                        var bounds = new google.maps.LatLngBounds();
                        for (var i = 0, place; place = places[i]; i++) {
                            // Create a marker for each place.
                            var marker = {
                                key:i,
                                place_id: place.place_id,
                                name: place.name,
                                coords:{
                                    latitude: place.geometry.location.lat(),
                                    longitude: place.geometry.location.lng()
                                },
                                latitude: place.geometry.location.lat(),
                                longitude: place.geometry.location.lng(),
                                options: {
                                    visible:false
                                },
                                templateurl:'window.tpl.html',
                                templateparameter: place
                            };
                            // newMarkers.push(marker);

                            bounds.extend(place.geometry.location);
                        }

                        $scope.map.bounds = {
                            northeast: {
                                latitude: bounds.getNorthEast().lat(),
                                longitude: bounds.getNorthEast().lng()
                            },
                            southwest: {
                                latitude: bounds.getSouthWest().lat(),
                                longitude: bounds.getSouthWest().lng()
                            }
                        }

                        // _.each(newMarkers, function(marker) {
                        //     marker.closeClick = function() {
                        //         $scope.selected.options.visible = false;
                        //         marker.options.visble = false;
                        //         return $scope.$apply();
                        //     };
                        //     marker.onClicked = function() {
                        //         $scope.selected.options.visible = false;
                        //         $scope.selected = marker;
                        //         $scope.selected.options.visible = true;
                        //     };
                        // });

                        // $scope.map.markers = newMarkers;
                    }
                }
            },
            au: {
                right: false,
                events: {
                    changed: function(department){
                        if(department == null){
                            $scope.au.right = false;
                        }else{
                            $scope.au.right = true;
                        }
                    }
                }    
            }
        });

        $scope.addMarkers = function (monitorData, radioModel) {

            monitorData = filterMarkers(monitorData, radioModel)
            countMarkers(monitorData)

            $scope.map.markers = [];
            for (var i in monitorData) {
                $scope.map.markers.push({
                    coords: {
                        latitude: monitorData[i].M_Latitude,
                        longitude: monitorData[i].M_Longitude
                    },
                    key: monitorData[i].M_MakerKey,
                    icon: mTypeWithTF(monitorData[i].M_Type, monitorData[i].M_Malfunction),
                    latitude: monitorData[i].M_Latitude,
                    longitude: monitorData[i].M_Longitude,
                    options: {
                        visible:false
                    },
                    templateurl:'window.monitor.html',
                    templateparameter: monitorData[i]
                });
            }

            _.each($scope.map.markers, function(marker) {
                marker.closeClick = function() {
                    $scope.selected.options.visible = false;
                    marker.options.visble = false;
                    return $scope.$apply();
                };
                marker.onClicked = function() {
                    $scope.selected.options.visible = false;
                    $scope.selected = marker;
                    $scope.selected.options.visible = true;
                };
            });
            // console.log($scope.map.markers);

        };

        //塞選markers
        var filterMarkers = function(monitorData, radioModel){
            var key;
            $scope.radioModel = radioModel;

            switch(radioModel){
                case 'Monitor0'   : key = '0'; break;
                case 'Monitor1'   : key = '1'; break;
                case 'MonitorAll' : key = 'A'; break;
            }
            if(key != 'A'){
                return $filter('filter')(monitorData, {
                    M_Type : key
                }, true);
            }else{
                return monitorData;
            }
        }

        //計算各種marker數量
        var countMarkers = function(monitorData){
            $scope.countMonitors.Monitor00 = $filter('filter')(monitorData, {
                                                M_Type : '0',
                                                M_Malfunction : '0'
                                            }, true).length;
            $scope.countMonitors.Monitor01 = $filter('filter')(monitorData, {
                                                M_Type : '0',
                                                M_Malfunction : '1'
                                            }, true).length;
            $scope.countMonitors.Monitor10 = $filter('filter')(monitorData, {
                                                M_Type : '1',
                                                M_Malfunction : '0'
                                            }, true).length;
            $scope.countMonitors.Monitor11 = $filter('filter')(monitorData, {
                                                M_Type : '1',
                                                M_Malfunction : '1'
                                            }, true).length;
        }

        //給予圖示
        //type 類型, malfunction 故障
        var mTypeWithTF = function(type, malfunction){
            if(type == '' || malfunction == ''){
                return '';
            }else{
                return 'img/monitors/m_type_' + type + malfunction + '.png';
            }
        };

		$scope.loadMonitorData = function(police){

            var 派出所完整資訊 = {
                title: "loadPolice",
                jspUrl: "jsp/",
                handler: "DBSelect.jsp",
                addr: $rootScope._URL,
                queryname: 'SelectAllPolice'
            };
            $scope.policeFilterData = [];
            var promise1 = forumService.searchMSSQLData(派出所完整資訊);
			var 監視器 = {
                title: "loadMonitors",
                jspUrl: "jsp/",
                handler: "DBSelect.jsp",
                addr: $rootScope._URL,
                queryname: 'SelectAllMonitor'
            };
            if(typeof police != 'undefined'){
                監視器['query'] = {
                    M_Police : police
                }
            }
            var promise2 = forumService.searchMSSQLData(監視器);
            var 分局完整資訊 = {
                title: "loadBranch",
                jspUrl: "jsp/",
                handler: "DBSelect.jsp",
                addr: $rootScope._URL,
                queryname: 'SelectAllBranch'
            };
            var promise3 = forumService.searchMSSQLData(分局完整資訊);
            $q.all([promise1, promise2, promise3]).then(function(res) {
                // console.log('監視器:', res);
            	// $scope.numFoundBL = res.selectObject.length;
                $scope.monitorData = [];
                if(res[1].selectObject.length == 0){
                    toaster.pop('warning', "", "無任何監視器資料", 3000);
                }else{
                    var rowIndex = 1;
                    for (var i in res[1].selectObject) {
                        res[1].selectObject[i].Index = rowIndex++;
                        $scope.monitorData.push(res[1].selectObject[i]);
                    }

                    // 初始化policeOptions
                    // 路口和民間的數量
                    $scope.countMonitors = {
                        Monitor00 : 0,
                        Monitor01 : 0,
                        Monitor10 : 0,
                        Monitor11 : 0
                    }
                    for(var i in $scope.monitorData){
                        $scope.monitorData[i]['policeOptions'] = [];
                    }

                    // 只需第一次塞入policeOptions
                    if($scope.monitorData[0]['policeOptions'].length == 0){
                        // 依照branch塞入police
                        for(var i in $scope.monitorData){
                            for (var j in res[0].selectObject) {
                                if(res[0].selectObject[j].P_Exist == "1" && $scope.monitorData[i].M_Branch == res[0].selectObject[j].B_ID){
                                    $scope.monitorData[i]['policeOptions'].push({
                                        id      : res[0].selectObject[j].P_ID,
                                        M_Police: res[0].selectObject[j].P_Name
                                    });
                                }
                            }
                        }
                    }

                    // default 民間監視器
                    if($scope.radioModel == null){
                        $scope.radioModel = 'Monitor1';
                    }

                    // 塞入Markers
                    $scope.addMarkers($scope.monitorData, $scope.radioModel);
                    // console.log($scope.monitorData);
                }

                // Policy備用
                $scope.fullPolice = {};
                for (var i in res[2].selectObject){
                    $scope.fullPolice[i] = [];
                }
                for (var i in res[0].selectObject) {
                    if(res[0].selectObject[i].P_Exist == "1"){
                        $scope.fullPolice[res[0].selectObject[i].B_ID].push({
                            id       : res[0].selectObject[i].P_ID,
                            M_Police : res[0].selectObject[i].P_Name
                        });
                    }
                }

            }, function(data) {
                return console.log('讀取監視器資料Failed');
            });
		};

        $scope.monitores = {
            //Delete
            removeData : function(row){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "deleteData.html",
                    controller: "myModalDeleteDataCtrl",
                    resolve: {
                        items: function() {
                            return row.entity;
                        }
                    }
                }), modalInstance.result.then(function(selected) {
                    // console.log(selected);
                    var delete監視器資料 = {
                        active: true,
                        title: "監視器資料",
                        jspUrl: "jsp/",
                        handler: "DBDelete.jsp",
                        addr: $rootScope._URL,
                        table: 1,
                        query: {
                            M_ID : row.entity.M_ID
                        }
                    };
                    var promise = forumService.deleteMSSQLData(delete監視器資料);
                    promise.then(function(res) {
                        if(res.trim() == "Success"){
                            console.log("刪除成功");
                            $scope.loadMonitorData($scope.UserInfo.U_Police);
                        }else{
                            console.log("刪除失敗");
                        }
                        // toaster.pop('success', "", "新增成功", 3000);
                    }, function(data) {
                        console.log("刪除失敗");
                        // return 'Fail';
                        // toaster.pop('danger', "", "新增失敗", 3000);
                    });

                }, function() {
                    // $log.info("Modal dismissed at: " + new Date)
                })
            },
            //Detail
            detailData : function(row){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "detailData.html",
                    controller: "myModalDetailDataCtrl",
                    resolve: {
                        items: function() {
                            return row.entity;
                        }
                    }
                }), modalInstance.result.then(function(selected) {

                }, function() {
                    // $log.info("Modal dismissed at: " + new Date)
                })
            }
        };

        // 判斷使用者權限
        $scope.au.events.changed($scope.UserInfo);
        $rootScope.monitorOptions = {
            data:  'monitorData',
            columnDefs: [
                {field: 'Index'          , displayName: 'ID', enableCellEdit: false, enableFiltering: false, width: 50},
                {field: 'M_Branch'       , displayName: '分局', enableCellEdit: $scope.au.right, editableCellTemplate: 'ui-grid/dropdownEditor', cellFilter: 'BranchStatus', editDropdownValueLabel: 'M_Branch', editDropdownOptionsArray: forumService.editDropdownOptions(BranchConstant.bData, 'M_Branch'), filter: 
                    {
                        condition: function(searchTerm, cellValue) {
                            for(var i in BranchConstant.bData){
                                if(searchTerm == BranchConstant.bData[i]){
                                    searchTerm = parseInt(i);
                                    break;
                                }
                            }
                            return searchTerm == cellValue;
                        },
                        // options: forumService.editDropdownOptions(BranchConstant, 'M_Branch'),
                        placeholder: '分局?'
                    },
                    // filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-branch-dropdown></div></div>'
                },
                {field: 'M_Police'       , displayName: '派出所', enableCellEdit: $scope.au.right, editableCellTemplate: 'ui-grid/dropdownEditor', cellFilter: 'PoliceStatus', editDropdownValueLabel: 'M_Police', editDropdownRowEntityOptionsArrayPath: 'policeOptions', filter: 
                    {
                        condition: function(searchTerm, cellValue) {
                            for(var i in PoliceConstant.pData){
                                if(searchTerm == PoliceConstant.pData[i]){
                                    searchTerm = parseInt(i);
                                    break;
                                }
                            }
                            return searchTerm == cellValue;
                        },
                        placeholder: '派出所?'
                    }
                },
                {field: 'M_Type'         , displayName: '種類', enableCellEdit: $scope.au.right, editableCellTemplate: 'ui-grid/dropdownEditor', cellFilter: 'MonitorStatus', editDropdownValueLabel: 'M_Type', editDropdownOptionsArray: forumService.editDropdownOptions(MonitorConstant, 'M_Type'), filter: 
                    {
                        condition: function(searchTerm, cellValue) {
                            for(var i in MonitorConstant){
                                if(searchTerm == MonitorConstant[i]){
                                    searchTerm = parseInt(i);
                                    break;
                                }
                            }
                            return searchTerm == cellValue;
                        },
                        placeholder: '路口民間?'
                    }
                },
                {field: 'M_Addr'         , displayName: '地址', enableCellEdit: $scope.au.right},
                {field: 'M_Direction'    , displayName: '方向', enableCellEdit: $scope.au.right, editableCellTemplate: 'ui-grid/dropdownEditor', cellFilter: 'DirectionStatus', editDropdownValueLabel: 'M_Direction', editDropdownOptionsArray: forumService.editDropdownOptions(DirectionConstant, 'M_Direction'), filter: 
                    {
                        condition: function(searchTerm, cellValue) {
                            for(var i in DirectionConstant){
                                if(searchTerm == DirectionConstant[i]){
                                    searchTerm = parseInt(i);
                                    break;
                                }
                            }
                            return searchTerm == cellValue;
                        },
                        placeholder: '東南西北?'
                    }
                },
                {field: 'M_Malfunction'  , displayName: '故障', enableCellEdit: $scope.au.right, editableCellTemplate: 'ui-grid/dropdownEditor', cellFilter: 'BooleanStatus', editDropdownValueLabel: 'M_Malfunction', editDropdownOptionsArray: forumService.editDropdownOptions(BooleanConstant, 'M_Malfunction'), filter: 
                    {
                        condition: function(searchTerm, cellValue) {
                            for(var i in BooleanConstant){
                                if(searchTerm == BooleanConstant[i]){
                                    searchTerm = parseInt(i);
                                    break;
                                }
                            }
                            return searchTerm == cellValue;
                        },
                        placeholder: '是?否?'
                    }
                },
                {field: 'M_Latitude'     , displayName: '緯度', enableCellEdit: $scope.au.right},
                {field: 'M_Longitude'    , displayName: '經度', enableCellEdit: $scope.au.right},
                {field: 'M_Remark'       , displayName: '備註', enableCellEdit: $scope.au.right},
                {field: 'Accessibility', displayName: '功能', enableFiltering: false, cellTemplate:$scope.au.right ? $templateCache.get('accessibilityInPopup') : $templateCache.get('accessibilityInPopupToGuest')}
            ],
            multiSelect: false,
            enableFiltering: true,
            exporterCsvFilename: '監視器相關資料.csv',
            exporterHeaderFilter: function( displayName ) { 
                if( displayName === '功能' ) { 
                    return ' '; 
                } else { 
                    return displayName;
                } 
            },
            exporterFieldCallback: function( grid, row, col, input ) {
                if( col.name == 'M_Branch' ){
                    for(var i in BranchConstant){
                        if(i == input){
                            return BranchConstant[i];
                        }
                    }
                } else if( col.name == 'M_Police' ){
                    for(var i in PoliceConstant){
                        if(i == input){
                            return PoliceConstant[i];
                        }
                    }
                } else if( col.name == 'M_Type' ){
                    for(var i in MonitorConstant){
                        if(i == input){
                            return MonitorConstant[i];
                        }
                    }
                } else if( col.name == 'M_Direction' ) {
                    for(var i in DirectionConstant){
                        if(i == input){
                            return DirectionConstant[i];
                        }
                    }
                } else if( col.name == 'M_Malfunction' ) {
                    for(var i in BooleanConstant){
                        if(i == input){
                            return BooleanConstant[i];
                        }
                    }
                } else {
                    return input;
                }
            }
        };

        //Editor and Update
        $rootScope.monitorOptions.onRegisterApi = function(gridApi){
            //set gridApi on scope
            $scope.gridApi = gridApi;
            gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);

            //選擇左方Select
            gridApi.selection.on.rowSelectionChanged($scope, function(row){
                // console.log(row.entity);    
                if(row.isSelected){    
                    $scope.map.events.refresh({
                        latitude: row.entity.M_Latitude,
                        longitude: row.entity.M_Longitude,
                        zoom: 17
                    });
                }else{ 
                    $scope.map.events.refresh({
                        latitude: $scope.centers.latitude,
                        longitude: $scope.centers.longitude,
                        zoom: 10
                    });
                }      
            });

            //選擇Cell之後
            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue){
                if( colDef.name === 'M_Branch' ){
                    //如果新舊的branch不一樣，就清空police
                    if(parseInt(newValue) != parseInt(oldValue)){
                        rowEntity.M_Police = null;
                    }
                    rowEntity.policeOptions = $scope.fullPolice[newValue];
                    // console.log(newValue, oldValue);
                }
            });
        };
        $scope.saveRow = function( rowEntity ) {
            // create a fake promise - normally you'd use the promise returned by $http or $resource
            // var promise = $q.defer();
            // $scope.gridApi.rowEdit.setSavePromise( $scope.gridApi.grid, rowEntity, promise.promise );

            // fake a delay of 3 seconds whilst the save occurs, return error if gender is "male"
            // $interval( function() {
            //     if (rowEntity.gender === 'male' ){
            //         promise.reject();
            //     } else {
            //         promise.resolve();
            //     }
            // }, 3000, 1);

            // console.log(rowEntity);  // the underlying data bound to the row
            // Detect changes and send entity to server 

            // 尋找是否有相同的經緯度
            var found = $filter('filter')($scope.map.markers, {
                M_Latitude : rowEntity.M_Latitude,
                M_Longitude: rowEntity.M_Longitude
            }, true);

            if(found.length > 0){
                toaster.pop('error', "更新失敗", "已有相同的經緯度", 3000);
                $scope.loadMonitorData($scope.UserInfo.U_Police);
            }else{
                var d = new Date();
                var update監視器資料 = {
                    active: true,
                    title: "監視器資料",
                    jspUrl: "jsp/",
                    handler: "DBUpdate.jsp",
                    addr: $rootScope._URL,
                    table: 1,
                    updatename: 'Update',
                    update: {
                        M_Branch      : rowEntity.M_Branch,
                        M_Police      : rowEntity.M_Police,
                        M_Type        : rowEntity.M_Type,
                        M_Addr        : rowEntity.M_Addr,
                        M_Direction   : rowEntity.M_Direction,
                        M_Malfunction : rowEntity.M_Malfunction,
                        M_Latitude    : rowEntity.M_Latitude,
                        M_Longitude   : rowEntity.M_Longitude,
                        M_MakerKey    : rowEntity.M_Latitude + '_' + rowEntity.M_Longitude,
                        M_Remark      : rowEntity.M_Remark,
                        M_UP_TIME     : forumService.SetTimeToSQL(d),
                        M_UP_USER     : $scope.UserInfo.U_ID
                    },
                    query: {
                        M_ID          : rowEntity.M_ID
                    }
                };
                var promise = forumService.updateMSSQLData(update監視器資料);
                $scope.gridApi.rowEdit.setSavePromise( $scope.gridApi.grid, rowEntity, promise.promise );
                promise.promise.then(function(res) {
                    // console.log(res);
                    if(res.trim() == "Success"){
                        console.log("更新成功");
                        promise.reject();

                        $scope.loadMonitorData($scope.UserInfo.U_Police);
                    }else{
                        console.log("更新失敗");
                        promise.resolve();
                    }
                    // toaster.pop('success', "", "新增成功", 3000);
                }, function(data) {
                    console.log("更新失敗");
                    promise.resolve();
                    // return 'Fail';
                    // toaster.pop('danger', "", "新增失敗", 3000);
                });
            }
        }; 

        //Export Excel
        $scope.export = function(){
            var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
            $scope.gridApi.exporter.csvExport( 'all', 'all', myElement );
        };

        //Insert
        $scope.AddData = function() {
            var modalInstance;
            modalInstance = $modal.open({
                templateUrl: "addData.html",
                controller: "myModalAddMonitorDataCtrl",
                size: 'lg',
                resolve: {
                    items: function() {
                        return $scope.monitorData;
                    },
                    policy: function() {
                        return $scope.fullPolice;
                    }
                }
            }), modalInstance.result.then(function(selected) {
                // console.log(selected);

                var d = new Date();
                var insert監視器資料 = {
                    active: true,
                    title: "監視器資料",
                    jspUrl: "jsp/",
                    handler: "DBInsert.jsp",
                    addr: $rootScope._URL,
                    table: 1,
                    insertname: 'Insert',
                    insert: {
                        M_Branch      : selected.M_Branch,
                        M_Police      : selected.M_Police,
                        M_Type        : selected.M_Type,
                        M_Addr        : selected.M_Addr,
                        M_Direction   : selected.M_Direction,
                        M_Malfunction : selected.M_Malfunction,
                        M_Latitude    : selected.M_Latitude,
                        M_Longitude   : selected.M_Longitude,
                        M_MakerKey    : selected.M_Latitude + '_' + selected.M_Longitude,
                        M_Remark      : selected.M_Remark,
                        M_CR_TIME     : forumService.SetTimeToSQL(d),
                        M_CR_USER     : $scope.UserInfo.U_ID
                    }
                };
                var promise = forumService.insertMSSQLData(insert監視器資料);
                promise.then(function(res) {
                    // console.log(res);
                    toaster.pop('success', "", "新增成功", 3000);
                    // location.reload();
                    $scope.loadMonitorData($scope.UserInfo.U_Police);
                }, function(data) {
                    // return 'Fail';
                    toaster.pop('danger', "", "新增失敗", 3000);
                });

            }, function() {
                // $log.info("Modal dismissed at: " + new Date)
            })
        };
	}])

    .controller("myModalAddMonitorDataCtrl", ["$scope", "$modalInstance", "items", "policy", "$http", "$timeout", "$filter", "forumService", "DirectionConstant", "BooleanConstant", "BranchConstant", "MonitorConstant", "PoliceConstant",
        function($scope, $modalInstance, items, policy, $http, $timeout, $filter, forumService, DirectionConstant, BooleanConstant, BranchConstant, MonitorConstant, PoliceConstant) {
            // console.log(policy);
            // $scope.items = items,
            angular.extend($scope, {
                branchConstant    : forumService.editDropdownOptions(BranchConstant.bData, 'M_Branch'),
                policeConstant    : {
                    police : [],
                    filterPolice : function(branch) {
                        $scope.policeConstant.police = policy[branch];
                    }
                },
                monitorConstant   : forumService.editDropdownOptions(MonitorConstant, 'M_Type'),
                directionConstant : forumService.editDropdownOptions(DirectionConstant, 'M_Direction'),
                booleanConstant   : forumService.editDropdownOptions(BooleanConstant, 'M_Malfunction'),
                pkeyWarning       : false,
                show              : false,
                selected          : {
                    M_Branch      : $scope.UserInfo.U_Branch != null ? $scope.UserInfo.U_Branch : "", //分局
                    M_Police      : $scope.UserInfo.U_Police != null ? $scope.UserInfo.U_Police : "", //派出所
                    M_Type        : "", //種類
                    M_Addr        : "", //地址
                    M_Direction   : "", //方向
                    M_Malfunction : "", //故障
                    M_Latitude    : "", //緯度
                    M_Longitude   : "", //經度
                    M_Remark      : ""  //備註
                }
            });

            $scope.map = {
                control: {},
                center: {
                    latitude:25.146397,
                    longitude: 121.720445
                    // latitude: 25.1285109,
                    // longitude: 121.7452075
                },
                zoom: 13,
                actualZoom: null,
                showMarkers: true,
                bounds: {},
                markers: [],
                idkey: 'place_id',
                events: {
                    // Google Map have some problems in modal, and it need use resize to solv. 
                    tilesloaded: function (map) {
                        $scope.$apply(function () {
                            google.maps.event.trigger(map, "resize");
                        });
                    },
                    // Click Google Map
                    click: function (mapModel, eventName, originalEventArgs) {

                        var e = originalEventArgs[0];
                        var lat = e.latLng.lat(),
                            lon = e.latLng.lng();

                        $scope.selected.M_Latitude = lat;
                        $scope.selected.M_Longitude = lon;

                        $scope.map.markers = [{
                            coords: {
                                latitude: lat,
                                longitude: lon
                            },
                            key: lat + '_' + lon,
                            options: {
                                animation: 1
                            }
                        }]; 
                        //scope apply required because this event handler is outside of the angular domain
                        $scope.$apply();
                    }
                }
            },
            $scope.AddrToLL = function(){
                $scope.$watch('selected.M_Addr', function(newValue, oldValue){
                    if(newValue != oldValue && newValue != ''){
                        console.log(newValue);
                        $http({
                            method: 'GET',
                            url: 'http://maps.google.com/maps/api/geocode/json?address=' + newValue + '&sensor=false'
                        }).success(function(data, status, headers, config) {
                            // console.log(data);
                            if(data.results.length > 0){
                                $scope.selected.M_Latitude = data.results[0].geometry.location.lat;
                                $scope.selected.M_Longitude = data.results[0].geometry.location.lng;

                                $scope.map.center.latitude = data.results[0].geometry.location.lat;
                                $scope.map.center.longitude = data.results[0].geometry.location.lng;
                                $scope.map.markers = [];
                                $scope.map.markers.push({
                                    coords: {
                                        latitude: data.results[0].geometry.location.lat,
                                        longitude: data.results[0].geometry.location.lng
                                    },
                                    key: data.results[0].geometry.location.lat + '_' + data.results[0].geometry.location.lng,
                                    options: {
                                        animation: 1
                                    }
                                });
                                $scope.map.zoom = 17;

                                // console.log($scope.map.center);
                            }

                            // deferred.resolve(data);
                        }).error(function(data, status, headers, config) {
                            // deferred.reject(data);
                        });
                    }
                }, true);
            },
            $scope.ok = function(data) {
                //console.log(data.C_Plate);
                var found = $filter('filter')(items, {
                    M_Latitude : $scope.selected.M_Latitude,
                    M_Longitude: $scope.selected.M_Longitude
                }, true);
                if(found.length > 0){
                   $scope.pkeyWarning = true; 
                }
                else if(data.M_Latitude == null || data.M_Latitude == "" || data.M_Longitude == null || data.M_Longitude == ""){
                    $scope.show = true;
                }else{
                    $modalInstance.close(data)
                }
            }, $scope.cancel = function() {
                $modalInstance.dismiss("cancel")
            }
        }
    ])

    .controller("myModalDetailDataCtrl", ["$scope", "$modalInstance", "items", "$timeout", "$filter", "InformationConstant", "BooleanConstant", "DirectionConstant", "PoliceConstant", "BranchConstant", "MonitorConstant",
        function($scope, $modalInstance, items, $timeout, $filter, InformationConstant, BooleanConstant, DirectionConstant, PoliceConstant, BranchConstant, MonitorConstant) {
            // console.log(items);
            $scope.selected = [];
            // console.log(items);
            for (var i in items) {
                if(typeof InformationConstant[i] != 'undefined'){
                    $scope.selected.push({
                        name    : InformationConstant[i],
                        content : someThing(InformationConstant[i], items[i])
                    });
                }
            }

            function someThing(key, value){
                if(key == '故障'){
                    return BooleanConstant[value];
                }else if(key == '監視器方向'){
                    return DirectionConstant[value];
                }else if(key == '派出所'){
                    return PoliceConstant.pData[value];
                }else if(key == '監視器種類'){
                    return MonitorConstant[value];
                }else if(key == '分局'){
                    return BranchConstant.bData[value];
                }else{
                    return value == 'null' ? '' : value;
                }
            }

            $scope.ok = function() {
                $modalInstance.close()
            }, $scope.cancel = function() {
                $modalInstance.dismiss("cancel")
            }
        }
    ])

    .controller("myModalDeleteDataCtrl", ["$scope", "$modalInstance", "items", "$timeout", "$filter", "InformationConstant", "BooleanConstant", "DirectionConstant", "PoliceConstant", "BranchConstant", "MonitorConstant",
        function($scope, $modalInstance, items, $timeout, $filter, InformationConstant, BooleanConstant, DirectionConstant, PoliceConstant, BranchConstant, MonitorConstant) {
            // console.log(items);
            $scope.selected = [];
            for (var i in items) {
                if(typeof InformationConstant[i] != 'undefined'){
                    $scope.selected.push({
                        name    : InformationConstant[i],
                        content : someThing(InformationConstant[i], items[i]) 
                    });
                }
            }

            function someThing(key, value){
                if(key == '故障' || key == '管理者核可'){
                    return BooleanConstant[value];
                }else if(key == '監視器方向'){
                    return DirectionConstant[value];
                }else if(key == '派出所'){
                    return PoliceConstant.pData[value];
                }else if(key == '監視器種類'){
                    return MonitorConstant[value];
                }else if(key == '分局'){
                    return BranchConstant.bData[value];
                }else{
                    return value == 'null' ? '' : value;
                }
            }

            $scope.ok = function() {
                $modalInstance.close()
            }, $scope.cancel = function() {
                $modalInstance.dismiss("cancel")
            }
        }
    ])

    .controller('WindowCtrl', function ($scope) {
        $scope.place = {};
        $scope.showPlaceDetails = function(param) {
            $scope.place = param;
        }

        $scope.monitor = {};
        $scope.showMonitorDetails = function(param) {
            $scope.monitor = param;
        }
    })

    .controller('SettingCtrl', ['$scope', '$rootScope', '$q', '$timeout', '$filter', '$modal', 'forumService', 'toaster', '$templateCache', 'BooleanConstant', 'BranchConstant', 'PoliceConstant',
    	function ($scope, $rootScope, $q, $timeout, $filter, $modal, forumService, toaster, $templateCache, BooleanConstant, BranchConstant, PoliceConstant) {

            $scope.loadUserInfo = function(){

                var 派出所完整資訊 = {
                    title: "loadPolice",
                    jspUrl: "jsp/",
                    handler: "DBSelect.jsp",
                    addr: $rootScope._URL,
                    queryname: 'SelectAllPolice'
                };
                $scope.policeFilterData = [];
                var promise1 = forumService.searchMSSQLData(派出所完整資訊);
                var 讀取所有UserInfo資料 = {
                    title: "UserInfo",
                    jspUrl: "jsp/",
                    handler: "DBSelect.jsp",
                    addr: $rootScope._URL,
                    queryname: 'SelectAllUserInfoWithoutAdmin'
                };
                var promise2 = forumService.searchMSSQLData(讀取所有UserInfo資料);
                var 分局完整資訊 = {
                    title: "loadBranch",
                    jspUrl: "jsp/",
                    handler: "DBSelect.jsp",
                    addr: $rootScope._URL,
                    queryname: 'SelectAllBranch'
                };
                var promise3 = forumService.searchMSSQLData(分局完整資訊);
                $q.all([promise1, promise2, promise3]).then(function(res) {
                    // console.log('讀取所有UserInfo資料:', res.selectObject.length);

                    $scope.settingPolice = [];
                    $scope.settingBranch = [];
                    $scope.settingData = [];

                    if(res[0].selectObject.length == 0){
                        toaster.pop('warning', "", "無任何派出所相關資料", 3000);
                    }else{
                        // 派出所管理
                        rowIndex = 1;
                        for (var i in res[0].selectObject) {
                            res[0].selectObject[i].Index = rowIndex++;
                            $scope.settingPolice.push(res[0].selectObject[i]);
                        }

                        // Policy備用
                        $scope.fullPolice = {};
                        for (var i in res[2].selectObject){
                            $scope.fullPolice[i] = [];
                        }
                        for (var i in res[0].selectObject) {
                            if(res[0].selectObject[i].P_Exist == "1"){
                                $scope.fullPolice[res[0].selectObject[i].B_ID].push({
                                    id       : res[0].selectObject[i].P_ID,
                                    U_Police : res[0].selectObject[i].P_Name
                                });
                            }
                        }

                        PoliceConstant.reload();
                    }

                    if(res[2].selectObject.length == 0){
                        toaster.pop('warning', "", "無任何分局相關資料", 3000);
                    }else{
                        // 分局管理
                        rowIndex = 1;
                        for (var i in res[2].selectObject) {
                            res[2].selectObject[i].Index = rowIndex++;
                            $scope.settingBranch.push(res[2].selectObject[i]);
                        } 

                        BranchConstant.reload();
                    }

                    if(res[1].selectObject.length == 0){
                        toaster.pop('warning', "", "無任何使用者相關資料", 3000);
                    }else{
                        // 帳號管理
                        var rowIndex = 1;
                        for (var i in res[1].selectObject) {
                            res[1].selectObject[i].Index = rowIndex++;
                            $scope.settingData.push(res[1].selectObject[i]);
                        }

                        // 初始化policeOptions
                        for(var i in $scope.settingData){
                            $scope.settingData[i]['policeOptions'] = [];
                        }

                        // 只需第一次塞入policeOptions
                        if($scope.settingData[0]['policeOptions'].length == 0){
                            // 依照branch塞入police
                            for(var i in $scope.settingData){
                                for (var j in res[0].selectObject) {
                                    if(res[0].selectObject[j].P_Exist == "1" && $scope.settingData[i].U_Branch == res[0].selectObject[j].B_ID){
                                        $scope.settingData[i]['policeOptions'].push({
                                            id      : res[0].selectObject[j].P_ID,
                                            U_Police: res[0].selectObject[j].P_Name
                                        });
                                    }
                                }
                            }
                        }
                    };
                }, function(data) {
                    return console.log('讀取所有UserInfo資料Failed');
                });
            };

            $scope.settinges = {
                //Delete
                removeData : function(row){
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "deleteData.html",
                        controller: "myModalDeleteDataCtrl",
                        size: 'sm',
                        resolve: {
                            items: function() {
                                return row.entity;
                            }
                        }
                    }), modalInstance.result.then(function(selected) {
                        // console.log(row.entity.C_Plate);
                        var delete使用者資訊 = {
                            active: true,
                            title: "使用者資訊",
                            jspUrl: "jsp/",
                            handler: "DBDelete.jsp",
                            addr: $rootScope._URL,
                            table: 0,
                            query: {
                                U_ID : row.entity.U_ID
                            }
                        };
                        var promise = forumService.deleteMSSQLData(delete使用者資訊);
                        promise.then(function(res) {
                            if(res.trim() == "Success"){
                                console.log("刪除成功");
                                $scope.loadUserInfo();
                            }else{
                                console.log("刪除失敗");
                            }
                            // toaster.pop('success', "", "新增成功", 3000);
                        }, function(data) {
                            console.log("刪除失敗");
                            // return 'Fail';
                            // toaster.pop('danger', "", "新增失敗", 3000);
                        });

                    }, function() {
                        // $log.info("Modal dismissed at: " + new Date)
                    })
                }
            }; 

            $rootScope.settingOptions = {
                data:  'settingData',
                columnDefs: [
                    {field: 'U_Check'      , displayName: '管理者核可', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', cellFilter: 'BooleanStatus', editDropdownValueLabel: 'U_Check', editDropdownOptionsArray: forumService.editDropdownOptions(BooleanConstant, 'U_Check'), filter: 
                        {
                            condition: function(searchTerm, cellValue) {
                                for(var i in BooleanConstant){
                                    if(searchTerm == BooleanConstant[i]){
                                        searchTerm = parseInt(i);
                                        break;
                                    }
                                }
                                return searchTerm == cellValue;
                            },
                            placeholder: '是?否?'
                        }
                    },
                    {field: 'U_Branch'     , displayName: '分局', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', cellFilter: 'BranchStatus', editDropdownValueLabel: 'U_Branch', editDropdownOptionsArray: forumService.editDropdownOptions(BranchConstant.bData, 'U_Branch'), filter: 
                        {
                            condition: function(searchTerm, cellValue) {
                                for(var i in BranchConstant.bData){
                                    if(searchTerm == BranchConstant.bData[i]){
                                        searchTerm = parseInt(i);
                                        break;
                                    }
                                }
                                return searchTerm == cellValue;
                            },
                            // options: forumService.editDropdownOptions(BranchConstant, 'M_Branch'),
                            placeholder: '分局?'
                        },
                        // filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-branch-dropdown></div></div>'
                    },
                    {field: 'U_Police'     , displayName: '派出所', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', cellFilter: 'PoliceStatus', editDropdownValueLabel: 'U_Police', editDropdownRowEntityOptionsArrayPath: 'policeOptions', filter: 
                        {
                            condition: function(searchTerm, cellValue) {
                                for(var i in PoliceConstant.pData){
                                    if(searchTerm == PoliceConstant.pData[i]){
                                        searchTerm = parseInt(i);
                                        break;
                                    }
                                }
                                return searchTerm == cellValue;
                            },
                            placeholder: '派出所?'
                        }
                    },
                    {field: 'U_Name'       , displayName: '姓名', enableCellEdit: true},
                    {field: 'U_ID'         , displayName: '帳號', enableCellEdit: false},
                    {field: 'U_PW'         , displayName: '密碼', enableCellEdit: true}, 
                    {field: 'U_CR_TIME'    , displayName: '使用者申請日期', enableCellEdit: false, type: 'date', cellFilter: 'date:"yyyy-MM-dd"', filters: [
                        {
                            condition: function(searchTerm, cellValue) {
                                var time = new Date(cellValue);
                                var dateYYMMDD = [time.getFullYear(), ("00"+(time.getMonth()+1)).slice(-2), ("00"+time.getDate()).slice(-2)].join('-');
                                var strippedValue = (dateYYMMDD).replace(/[^\d]/g, '');
                                return strippedValue >= searchTerm;
                            },
                            placeholder: '從ex:20100101'
                        },
                        {
                            condition: function(searchTerm, cellValue) {
                                var time = new Date(cellValue);
                                var dateYYMMDD = [time.getFullYear(), ("00"+(time.getMonth()+1)).slice(-2), ("00"+time.getDate()).slice(-2)].join('-');
                                var strippedValue = (dateYYMMDD).replace(/[^\d]/g, '');
                                return strippedValue <= searchTerm;
                            },
                            placeholder: '到ex:20100115'
                        }]}, 
                    {field: 'Delete'       , displayName: '刪除', enableCellEdit: false, enableFiltering: false, cellTemplate: $templateCache.get('accessibilityInPopupToDelete')}
                ],
                enableFiltering: true
            };

            //Editor and Update
            $rootScope.settingOptions.onRegisterApi = function(gridApi){
                //set gridApi on scope
                $scope.gridAccountApi = gridApi;
                gridApi.rowEdit.on.saveRow($scope, $scope.saveAccountRow);

                //選擇Cell之後
                gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue){
                    if( colDef.name === 'U_Branch' ){
                        //如果新舊的branch不一樣，就清空police
                        if(parseInt(newValue) != parseInt(oldValue)){
                            rowEntity.U_Police = null;
                        }
                        rowEntity.policeOptions = $scope.fullPolice[newValue];
                        // console.log(newValue, oldValue);
                    }
                });
            };

            $scope.saveAccountRow = function( rowEntity ) {
                // create a fake promise - normally you'd use the promise returned by $http or $resource
                // var promise = $q.defer();
                // $scope.gridApi.rowEdit.setSavePromise( $scope.gridApi.grid, rowEntity, promise.promise );

                // fake a delay of 3 seconds whilst the save occurs, return error if gender is "male"
                // $interval( function() {
                //     if (rowEntity.gender === 'male' ){
                //         promise.reject();
                //     } else {
                //         promise.resolve();
                //     }
                // }, 3000, 1);

                // console.log(rowEntity);  // the underlying data bound to the row
                // Detect changes and send entity to server 
                var update使用者帳號 = {
                    active: true,
                    title: "使用者帳號",
                    jspUrl: "jsp/",
                    handler: "DBUpdate.jsp",
                    addr: $rootScope._URL,
                    table: 0,
                    updatename: 'Update',
                    update: {
                        U_Check      : rowEntity.U_Check,
                        U_Branch     : rowEntity.U_Branch,
                        U_Police     : rowEntity.U_Police,
                        U_Name       : rowEntity.U_Name,
                        U_PW         : rowEntity.U_PW
                    },
                    query: {
                        U_ID : rowEntity.U_ID
                    }
                };
                var promise = forumService.updateMSSQLData(update使用者帳號);
                $scope.gridAccountApi.rowEdit.setSavePromise( $scope.gridAccountApi.grid, rowEntity, promise.promise );
                promise.promise.then(function(res) {
                    // console.log(res);
                    if(res.trim() == "Success"){
                        console.log("更新成功");
                        promise.reject();
                    }else{
                        console.log("更新失敗");
                        promise.resolve();
                    }
                    // toaster.pop('success', "", "新增成功", 3000);
                }, function(data) {
                    console.log("更新失敗");
                    promise.resolve();
                    // return 'Fail';
                    // toaster.pop('danger', "", "新增失敗", 3000);
                });
            };

            $scope.branchOptions = {
                data:  'settingBranch',
                columnDefs: [
                    {field: 'B_ID'      , displayName: '編號', enableCellEdit: false},
                    {field: 'B_Name'     , displayName: '分局名稱', enableCellEdit: true}
                ],
                enableFiltering: true
            };

            //Editor and Update
            $scope.branchOptions.onRegisterApi = function(gridApi){
                //set gridApi on scope
                $scope.gridBranchApi = gridApi;
                gridApi.rowEdit.on.saveRow($scope, $scope.saveBranchRow);
            };

            $scope.saveBranchRow = function( rowEntity ) {
                // console.log(rowEntity);  // the underlying data bound to the row
                // Detect changes and send entity to server 
                var update分局管理 = {
                    active: true,
                    title: "分局管理",
                    jspUrl: "jsp/",
                    handler: "DBUpdate.jsp",
                    addr: $rootScope._URL,
                    table: 3,
                    updatename: 'Update',
                    update: {
                        B_Name : rowEntity.B_Name,
                    },
                    query: {
                        B_ID : rowEntity.B_ID
                    }
                };
                var promise = forumService.updateMSSQLData(update分局管理);
                $scope.gridBranchApi.rowEdit.setSavePromise( $scope.gridBranchApi.grid, rowEntity, promise.promise );
                promise.promise.then(function(res) {
                    // console.log(res);
                    if(res.trim() == "Success"){
                        console.log("更新成功");
                        promise.reject();

                        $scope.loadUserInfo();
                    }else{
                        console.log("更新失敗");
                        promise.resolve();
                    }
                    // toaster.pop('success', "", "新增成功", 3000);
                }, function(data) {
                    console.log("更新失敗");
                    promise.resolve();
                    // return 'Fail';
                    // toaster.pop('danger', "", "新增失敗", 3000);
                });
            };

            $scope.AddBranch = function(addBranch){
                var insert分局 = {
                    active: true,
                    title: "分局",
                    jspUrl: "jsp/",
                    handler: "DBInsert.jsp",
                    addr: $rootScope._URL,
                    table: 3,
                    insertname: 'Insert',
                    insert: {
                        B_ID   : $scope.settingBranch == null ? 0 : $scope.settingBranch.length,
                        B_Name : addBranch,
                    }
                };
                var promise = forumService.insertMSSQLData(insert分局);
                promise.then(function(res) {
                    // console.log(res);
                    toaster.pop('success', "", "新增成功", 3000);
                    // location.reload();
                    $scope.loadUserInfo();
                }, function(data) {
                    // return 'Fail';
                    toaster.pop('danger', "", "新增失敗", 3000);
                });
            }

            $rootScope.policeOptions = {
                data:  'settingPolice',
                columnDefs: [
                    {field: 'P_ID'      , displayName: '編號', enableCellEdit: false},
                    {field: 'B_ID'     , displayName: '分局名稱', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', cellFilter: 'BranchStatus', editDropdownValueLabel: 'B_ID', editDropdownOptionsArray: forumService.editDropdownOptions(BranchConstant.bData, 'B_ID'), filter: 
                        {
                            condition: function(searchTerm, cellValue) {
                                for(var i in BranchConstant.bData){
                                    if(searchTerm == BranchConstant.bData[i]){
                                        searchTerm = parseInt(i);
                                        break;
                                    }
                                }
                                return searchTerm == cellValue;
                            },
                            // options: forumService.editDropdownOptions(BranchConstant, 'M_Branch'),
                            placeholder: '分局?'
                        },
                        // filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-branch-dropdown></div></div>'
                    },
                    {field: 'P_Name'     , displayName: '派出所名稱', enableCellEdit: true},
                    {field: 'P_Exist'     , displayName: '派出所猶存', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', cellFilter: 'BooleanStatus', editDropdownValueLabel: 'P_Exist', editDropdownOptionsArray: forumService.editDropdownOptions(BooleanConstant, 'P_Exist'), filter: 
                        {
                            condition: function(searchTerm, cellValue) {
                                for(var i in BooleanConstant){
                                    if(searchTerm == BooleanConstant[i]){
                                        searchTerm = parseInt(i);
                                        break;
                                    }
                                }
                                return searchTerm == cellValue;
                            },
                            placeholder: '是?否?'
                        }
                    }
                ],
                enableFiltering: true
            };

            //Editor and Update
            $rootScope.policeOptions.onRegisterApi = function(gridApi){
                //set gridApi on scope
                $scope.gridPoliceApi = gridApi;
                gridApi.rowEdit.on.saveRow($scope, $scope.savePoliceRow);
            };

            $scope.savePoliceRow = function( rowEntity ) {
                // console.log(rowEntity);  // the underlying data bound to the row
                // Detect changes and send entity to server 
                var update派出所管理 = {
                    active: true,
                    title: "派出所管理",
                    jspUrl: "jsp/",
                    handler: "DBUpdate.jsp",
                    addr: $rootScope._URL,
                    table: 4,
                    updatename: 'Update',
                    update: {
                        B_ID    : rowEntity.B_ID,
                        P_Name  : rowEntity.P_Name,
                        P_Exist : rowEntity.P_Exist,
                    },
                    query: {
                        P_ID : rowEntity.P_ID
                    }
                };
                var promise = forumService.updateMSSQLData(update派出所管理);
                $scope.gridPoliceApi.rowEdit.setSavePromise( $scope.gridPoliceApi.grid, rowEntity, promise.promise );
                promise.promise.then(function(res) {
                    // console.log(res);
                    if(res.trim() == "Success"){
                        console.log("更新成功");
                        promise.reject();

                        $scope.loadUserInfo();
                    }else{
                        console.log("更新失敗");
                        promise.resolve();
                    }
                    // toaster.pop('success', "", "新增成功", 3000);
                }, function(data) {
                    console.log("更新失敗");
                    promise.resolve();
                    // return 'Fail';
                    // toaster.pop('danger', "", "新增失敗", 3000);
                });
            };

            $scope.AddPolice = function(addBPolice, addPolice){
                var insert派出所 = {
                    active: true,
                    title: "派出所",
                    jspUrl: "jsp/",
                    handler: "DBInsert.jsp",
                    addr: $rootScope._URL,
                    table: 4,
                    insertname: 'Insert',
                    insert: {
                        P_ID    : $scope.settingPolice == null ? 0 : $scope.settingPolice.length,
                        B_ID    : addBPolice,
                        P_Name  : addPolice,
                        P_Exist : 1
                    }
                };
                var promise = forumService.insertMSSQLData(insert派出所);
                promise.then(function(res) {
                    // console.log(res);
                    toaster.pop('success', "", "新增成功", 3000);
                    // location.reload();
                    $scope.loadUserInfo();
                }, function(data) {
                    // return 'Fail';
                    toaster.pop('danger', "", "新增失敗", 3000);
                });
            }

            $scope.handleWindowResize = function(gridApi){
                $timeout( function() {
                    gridApi.core.handleWindowResize();
                }, 500);
            };

            $scope.openChangePW = function(data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "ChangePW.html",
                    controller: "myModalOpenChangePW",
                    size: 'sm',
                    resolve: {
                        items: function() {
                            return data
                        }
                    }
                }), modalInstance.result.then(function(selected) {
                    // console.log(selected);
                    var updatePW = {
                        active: true,
                        title: "PW",
                        jspUrl: "jsp/",
                        handler: "DBUpdate.jsp",
                        addr: $rootScope._URL,
                        table: 0,
                        updatename: 'Update',
                        update: {
                            U_PW : selected.U_PW
                        },
                        query: {
                            U_ID : selected.U_ID
                        }
                    };
                    var promise = forumService.updateMSSQLData(updatePW);
                    promise.promise.then(function(res) {
                        // console.log(res);
                        if(res.trim() == "Success"){
                            console.log("更新成功");
                            promise.reject();
                        }else{
                            console.log("更新失敗");
                            promise.resolve();
                        }
                        // toaster.pop('success', "", "新增成功", 3000);
                    }, function(data) {
                        console.log("更新失敗");
                        promise.resolve();
                        // return 'Fail';
                        // toaster.pop('danger', "", "新增失敗", 3000);
                    });
                }, function() {
                    // $log.info("Modal dismissed at: " + new Date)
                })
            };

		}
    ])

	.controller("myModalOpenChangePW", ["$scope", "$modalInstance", "items",
        function($scope, $modalInstance, items) {
        	// console.log(items);
        	$scope.showError = false,
            $scope.openChangePWData = items, 
            $scope.ok = function(oldPW, newPW, confirmNewPW) {
            	// console.log(newPW, confirmNewPW);
            	if (typeof newPW == 'undefined' || typeof confirmNewPW == 'undefined' || newPW == '' || confirmNewPW == '' || newPW != confirmNewPW || items.U_PW != oldPW) {
            		$scope.showError = true;
            	}else{
                    items.U_ID = $scope.UserInfo.U_ID;
                    items.U_PW = newPW
                	$modalInstance.close(items)
            	}
            }, $scope.cancel = function() {
                $modalInstance.dismiss("cancel")
            }
        }
    ])
;
