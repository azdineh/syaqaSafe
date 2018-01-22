angular.module('starter')
.directive('sqasItem', [function ($scope,$rootscope) {
	return {
		restrict: 'E',
		templateUrl:"js/directives/sqas-item.html",
		controller: function ($scope, $element) {
            $scope.hideContent=false;

            $scope.showContent=function(){
                if($scope.hideContent){
                    $scope.hideContent=false;
                }
                else{
                    $scope.hideContent=true;

                }
            }

		}
	};
}]);