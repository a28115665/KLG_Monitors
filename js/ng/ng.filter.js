// APP FILTER
// main directives
angular.module('app.filter', [])
	// 顯示年/月/日
	.filter('ShowtoLocaleDateString', function() {
		return function(input) {
			if (!isNaN(input) || typeof input != 'undefined') {
			  	return new Date(input).toLocaleDateString();
			} else {
			  	return '';
			}
		};
	})

	// 排氣量單位
	.filter('CarCount', [ '$filter', '$locale', function($filter, $locale) {
		var number = $filter('number'), formats = $locale.NUMBER_FORMATS;
        return function (amount, symbol) {
            var value = number(amount, symbol);
            return value + 'cc'
        }
	}])

	//數字
	.filter('Number', [ '$filter', '$locale', function($filter, $locale) {
		var number = $filter('number'), formats = $locale.NUMBER_FORMATS;
        return function (amount, symbol) {
            var value = number(amount, symbol);
            return value
        }
	}])

	//無小數的金錢
	.filter('Currency', [ '$filter', '$locale', function($filter, $locale) {
		var currency = $filter('currency'), formats = $locale.NUMBER_FORMATS;
        return function (amount, symbol) {
        	if(amount == ''){
	            var value = currency(amount, symbol);
        		return value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '');
        	}else if(amount < 0){
	            var value = currency(amount, symbol);
        		return value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '').replace('(','-').replace(')','');
        	}else if(amount == 0){
        		return 1;
        	}else{
	            var value = currency(amount, symbol);
	            return value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '')
        	}
        }
	}])

	//有小數的金錢
	.filter('FloatCurrency', [ '$filter', '$locale', function($filter, $locale) {
		var currency = $filter('currency'), formats = $locale.NUMBER_FORMATS;
        return function (amount, symbol) {	            
        	var value = currency(amount, symbol);
            return value;
        }
	}])

	.filter('DatetimeYYYYMMDD', function() {
		return function(input) {
			if (input != null || typeof input != 'undefined') {
			  	return input.slice(0, 19);
			} else {
			  	return '';
			}
		};
	})

	.filter('DateFormatFor042', function() {
		return function(input) {
		  	return input + '年度';
		};
	})

	//布林值是否
	.filter('BooleanStatus', function(BooleanConstant) {
		return function(input) {
			if (BooleanConstant[input]) {
			  	return BooleanConstant[input];
			} else {
			  	return '';
			}
		};
	})
	.factory( 'BooleanConstant', function() {
		return {
			0: '否',
			1: '是'
		};
	})

	//方向-北 東北 東 東南 南 西南 西 西北
	.filter('DirectionStatus', function(DirectionConstant) {
		return function(input) {
			if (DirectionConstant[input]) {
			  	return DirectionConstant[input];
			} else {
			  	return '';
			}
		};
	})
	.factory( 'DirectionConstant', function() {
		return {
			0: '北',
			1: '東北',
			2: '東',
			3: '東南',
			4: '南',
			5: '西南',
			6: '西',
			7: '西北'
		};
	})

	//監視器種類
	.filter('MonitorStatus', function(MonitorConstant) {
		return function(input) {
			if (MonitorConstant[input]) {
			  	return MonitorConstant[input];
			} else {
			  	return '';
			}
		};
	})
	.factory( 'MonitorConstant', function() {
		return {
			0: '路口監視器',
			1: '民間監視器'
		};
	})

	//分局
	.filter('BranchStatus', function(BranchConstant) {
		return function(input) {
			// var variable = BranchConstant.loadBranch();
			// console.log(typeof variable != 'undefined');
			if (BranchConstant.bData[input]) {
			  	return BranchConstant.bData[input];
			} else {
			  	return '';
			}
		};
	})
	.factory( 'BranchConstant', function($rootScope, forumService) {

		var 分局 = {
            title: "loadBranch",
            jspUrl: "jsp/",
            handler: "DBSelect.jsp",
            addr: $rootScope._URL,
            queryname: 'SelectAllBranch'
        };
        var branchData = {};
        var promise = forumService.searchMSSQLData(分局);
        promise.then(function(res) {
            if(res.selectObject.length == 0){
            	console.log('無任何分局資料');
            }else{
                for (var i in res.selectObject) {
                    branchData[i] = res.selectObject[i].B_Name;
                }

                //如果$http比較慢 則再塞入一次
                if(typeof $rootScope.monitorOptions != 'undefined'){
					$rootScope.monitorOptions.columnDefs[1].editDropdownOptionsArray = forumService.editDropdownOptions(branchData, 'M_Branch');
                }
                if(typeof $rootScope.settingOptions != 'undefined'){
					$rootScope.settingOptions.columnDefs[1].editDropdownOptionsArray = forumService.editDropdownOptions(branchData, 'U_Branch');
                }
                if(typeof $rootScope.policeOptions != 'undefined'){
					$rootScope.policeOptions.columnDefs[1].editDropdownOptionsArray = forumService.editDropdownOptions(branchData, 'B_ID');
                }

                this.bData = branchData;
        		// return branchData;
            };
        }, function(data) {
            console.log('讀取分局資料Failed');
        });

    	return {
    		bData : branchData,
    		reload : function(){
    			var 分局 = {
		            title: "loadBranch",
		            jspUrl: "jsp/",
		            handler: "DBSelect.jsp",
		            addr: $rootScope._URL,
		            queryname: 'SelectAllBranch'
		        };
		        var promise = forumService.searchMSSQLData(分局);
		        promise.then(function(res) {
		            if(res.selectObject.length == 0){
		            	console.log('無任何分局資料');
		            }else{
		        		// this.bData = {};
		                for (var i in res.selectObject) {
		                    this.bData[i] = res.selectObject[i].B_Name;
		                }

		                //如果$http比較慢 則再塞入一次
		                if(typeof $rootScope.monitorOptions != 'undefined'){
							$rootScope.monitorOptions.columnDefs[1].editDropdownOptionsArray = forumService.editDropdownOptions(branchData, 'M_Branch');
		                }
		                if(typeof $rootScope.settingOptions != 'undefined'){
							$rootScope.settingOptions.columnDefs[1].editDropdownOptionsArray = forumService.editDropdownOptions(branchData, 'U_Branch');
		                }
		                if(typeof $rootScope.policeOptions != 'undefined'){
							$rootScope.policeOptions.columnDefs[1].editDropdownOptionsArray = forumService.editDropdownOptions(branchData, 'B_ID');
		                }
		            };
		        }, function(data) {
		            console.log('讀取分局資料Failed');
		        });
    		}
    	};
	})

	//派出所
	.filter('PoliceStatus', function(PoliceConstant) {
		return function(input) {
			if (PoliceConstant.pData[input]) {
			  	return PoliceConstant.pData[input];
			} else {
			  	return '';
			}
		};
	})
	.factory( 'PoliceConstant', function($rootScope, $filter, forumService) {

		var 派出所 = {
            title: "loadPolice",
            jspUrl: "jsp/",
            handler: "DBSelect.jsp",
            addr: $rootScope._URL,
            queryname: 'SelectAllPolice'
        };
        var policeData = {};
        var promise = forumService.searchMSSQLData(派出所);
        promise.then(function(res) {
            if(res.selectObject.length == 0){
            	console.log('無任何派出所資料');
            }else{
                for (var i in res.selectObject) {
            		if(res.selectObject[i].P_Exist == "1"){
            			policeData[i] = res.selectObject[i].P_Name;
            		}
                }

                // console.log(policeData);

                //如果$http比較慢 則再塞入一次
                if(typeof $rootScope.monitorOptions != 'undefined'){
                	// console.log($rootScope.monitorOptions.columnDefs[1]); 
					$rootScope.monitorOptions.columnDefs[2].editDropdownOptionsArray = forumService.editDropdownOptions(policeData, 'M_Police');
                }
                if(typeof $rootScope.settingOptions != 'undefined'){
					$rootScope.settingOptions.columnDefs[2].editDropdownOptionsArray = forumService.editDropdownOptions(policeData, 'U_Police');
                }

                this.pData = policeData;
        		// return policeData;
            };
        }, function(data) {
            console.log('讀取派出所資料Failed');
        });

    	return {
    		pData : policeData,
    		reload : function(){
    			var 派出所 = {
		            title: "loadPolice",
		            jspUrl: "jsp/",
		            handler: "DBSelect.jsp",
		            addr: $rootScope._URL,
		            queryname: 'SelectAllPolice'
		        };
		        var promise = forumService.searchMSSQLData(派出所);
		        promise.then(function(res) {
		            if(res.selectObject.length == 0){
		            	console.log('無任何分局資料');
		            }else{
		                for (var i in res.selectObject) {
		            		if(res.selectObject[i].P_Exist == "1"){
		            			policeData[i] = res.selectObject[i].P_Name;
		            		}
		                }

		                // console.log(policeData);

		                //如果$http比較慢 則再塞入一次
		                if(typeof $rootScope.monitorOptions != 'undefined'){
		                	// console.log($rootScope.monitorOptions.columnDefs[1]); 
							$rootScope.monitorOptions.columnDefs[2].editDropdownOptionsArray = forumService.editDropdownOptions(policeData, 'M_Police');
		                }
		                if(typeof $rootScope.settingOptions != 'undefined'){
							$rootScope.settingOptions.columnDefs[2].editDropdownOptionsArray = forumService.editDropdownOptions(policeData, 'U_Police');
		                }
		            };
		        }, function(data) {
		            console.log('讀取分局資料Failed');
		        });
    		}
    	};
	})

	.filter('InformationName', function(InformationConstant) {
		return function(input) {
			if (InformationName[input]) {
			  	return InformationName[input];
			} else {
			  	return '';
			}
		};
	})
	.factory( 'InformationConstant', function() {
		return {
			U_ID        : '使用者帳號',
			U_Name      : '使用者姓名',
			U_Branch    : '分局',
			U_Police    : '派出所',
			U_PW        : '密碼',
			U_Role      : '角色',
			U_Check     : '管理者核可',
			U_CR_TIME   : '使用者申請日期',
			// U_CK_TIME   : '管理者核可時間',

			M_Branch      : '分局',
			M_Police      : '派出所',
			M_Type        : '監視器種類', 
			M_Addr        : '監視器地址',
			M_Direction   : '監視器方向',
			M_Malfunction : '故障',
			M_Latitude    : '緯度',
            M_Longitude   : '經度',
            M_Remark      : '備註',

		};
	})