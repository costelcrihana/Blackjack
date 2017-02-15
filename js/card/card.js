angular.module('com.blackjack.card', [])
.directive('card', function() {
    return {
        templateUrl : 'js/card/card.html',
        scope: {
		    parameters: '=',
			showCard: '='
		},
        link: function ($scope) {
        	switch ($scope.parameters.symbol) {
            case 'hearts':
                $scope.icon = 'img/hearts.jpg';
                break;
            case 'spades':
            	$scope.icon = 'img/spades.jpg';
                break;
            case 'clubs':
            	$scope.icon = 'img/clubs.jpg';
                break;
            case 'diamonds':
            	$scope.icon = 'img/diamonds.jpg';
                break;
            };
        }
    };
});