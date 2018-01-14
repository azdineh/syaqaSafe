angular.module('starter')

    .controller('DashCtrl', function ($scope,$state) {


        $scope.goToPage=function(pagename){
            switch (pagename) {
                case 'anti-somnolence':
                    $state.go('tab.anti-somnolence');
                    break;
                case 'smart-notification':
                    $state.go('tab.smart-notification');
                    break;
                case 'safe-modes':
                    $state.go('tab.safe-modes');
                    break;
                case 'important-numbers':
                    $state.go('tab.important-numbers');
                    break;
                case 'archive':
                    $state.go('tab.archive');
                    break;
                case 'aboutus':
                    $state.go('tab.aboutus');
                    break;
            
                default:
                    break;
            }
        }
    })