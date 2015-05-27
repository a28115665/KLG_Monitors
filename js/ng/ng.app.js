var smartApp = angular.module('smartApp', [
  	'ngRoute',
  	'ngCookies',
  	'angularFileUpload',
  	'toaster',
  	'ui.grid',
  	'ui.grid.resizeColumns',
  	'ui.grid.edit',
  	'ui.grid.rowEdit',
  	'ui.grid.selection',
  	'ui.grid.exporter',
  	'uiGmapgoogle-maps',
  	//'ngAnimate', // this is buggy, jarviswidget will not work with ngAnimate :(
  	'ui.bootstrap',
  	'plunker',
  	'app.controllers',
  	'app.demoControllers',
  	'app.main',
  	'app.navigation',
  	'app.localize',
  	'app.activity',
  	'app.smartui',
  	'app.forumControllers',
  	'app.forum',
  	'app.filter'
]);

smartApp.config(['$routeProvider', '$provide', function($routeProvider, $provide) {
	$routeProvider
		.when('/', {
			redirectTo: '/MasterPage'
			// redirect: function() {
			//     location.href='/ESVC/login.html';
			// }
			// templateUrl:'/ESVC/login.html'
		})

		/* We are loading our views dynamically by passing arguments to the location url */

		// A bug in smartwidget with angular (routes not reloading). 
		// We need to reload these pages everytime so widget would work
		// The trick is to add "/" at the end of the view.
		// http://stackoverflow.com/a/17588833
		.when('/:page', { // we can enable ngAnimate and implement the fix here, but it's a bit laggy
			templateUrl: function($routeParams) {
				return 'views/'+ $routeParams.page +'.html';
			},
			controller: 'PageViewController'
		})
		.when('/:page/:child*', {
			templateUrl: function($routeParams) {
				return 'views/'+ $routeParams.page + '/' + $routeParams.child + '.html';
			},
			controller: 'PageViewController'
		})
		// .otherwise({
		// 	// redirectTo: '/login.html'
		// 	templateUrl:'/ESVC/login.html'
		// });

	// with this, you can use $log('Message') same as $log.info('Message');
	$provide.decorator('$log', ['$delegate',
		function($delegate) {
			// create a new function to be returned below as the $log service (instead of the $delegate)
			function logger() {
				// if $log fn is called directly, default to "info" message
				logger.info.apply(logger, arguments);
			}

			// add all the $log props into our new logger fn
			angular.extend(logger, $delegate);
			return logger;
	}]); 

}]);

smartApp.run(['$rootScope', '$cookieStore', '$route', '$location', 'AUTH_EVENTS', 'AuthService', 'settings', 'BranchConstant',
	function($rootScope, $cookieStore, $route, $location, AUTH_EVENTS, AuthService, settings, BranchConstant) {
		settings.currentLang = settings.languages[0]; // en
		BranchConstant;

		$rootScope.$on('$routeChangeStart', function (event, nextState) {
	            // console.log(nextState.authorizedRoles);
	            if (!AuthService.isAuthorized(nextState.authorizedRoles)) {
	                event.preventDefault();

	                if (AuthService.isAuthenticated()) {
	                    // 分頁已有登入 所以一開就直接登入
	                    console.log(1);
	                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
	                    $location.path('/MasterPage');
	                }else {
	                    // 其它頁數沒有登入都無法觀看
	                    console.log(3);
	                    // logger.logWarning("尚未登入");
	                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
	                    location.href='/KLG_Monitors/#/MasterPage';
	                    // $location.path('/MasterPage');
	                    // location.reload();
	                }  
	            }
	        });
	}
])


.run(['$templateCache', function ($templateCache) {
    $templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="pac-controls" type="text" placeholder="Search">');
    $templateCache.put('window.tpl.html', '<div>\
    										<div ng-controller="WindowCtrl" ng-init="showPlaceDetails(parameter)">\
    											<strong>{{place.name}}</strong>\
    											<p>{{place.formatted_address}}<p>\
										    </div>\
										   </div>');
    $templateCache.put('window.monitor.html', '<div id="content" ng-controller="WindowCtrl" ng-init="showMonitorDetails(parameter)">\
    												<div id="siteNotice">\
													</div>\
    												<h3 id="firstHeading" class="firstHeading">\
	    												<i class="glyphicon glyphicon-ok-sign txt-color-green" ng-show=\'monitor.M_Malfunction == "0"\'></i>\
	    												<i class="glyphicon glyphicon-remove-sign txt-color-red" ng-show=\'monitor.M_Malfunction == "1"\'></i>\
    													<strong class="txt-color-blue">{{monitor.M_Branch | BranchStatus}}</strong>\
    												</h3>\
    												<div id="bodyContent">\
    													<p>{{monitor.M_Police | PoliceStatus}}<span>({{monitor.M_Addr}})</span></p>\
														<code ng-if=\'monitor.M_Remark != ""\'>{{monitor.M_Remark}}</code>\
													</div>\
										   		</div>');
    $templateCache.put('accessibilityInPopup', '<div class="ui-grid-cell-contents">\
	                                              	<a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="getExternalScopes().removeData(row)"><i class="fa fa-trash-o "></i></a>\
	                                          		<a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="getExternalScopes().detailData(row)"><i class="fa fa-info "></i></a>\
	                                       		</div>');
    $templateCache.put('accessibilityInPopupToGuest', '<div class="ui-grid-cell-contents">\
                                          		  	   		<a href="javascript:void(0);" class="btn btn-primary btn-xs" ng-click="getExternalScopes().detailData(row)"><i class="fa fa-info "></i></a>\
		                                       		   </div>');
    $templateCache.put('accessibilityInPopupToDelete', '<div class="ui-grid-cell-contents">\
	                                              			<a href="javascript:void(0);" class="btn btn-danger btn-xs" ng-click="getExternalScopes().removeData(row)"><i class="fa fa-trash-o "></i></a>\
		                                       		    </div>');
}])