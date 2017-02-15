angular
	.module('com.blackjack', [
		'ngRoute',
		'com.blackjack.welcome',
		'com.blackjack.game'
		])
	.config(function($routeProvider) {
		$routeProvider
		.when('/welcome', {
			templateUrl : 'js/welcome/welcome.html',
			controller: 'WelcomeCtrl'
		})
		.when('/game', {
			templateUrl : 'js/game/game.html',
			controller: 'GameCtrl'
		})
		.otherwise({
			redirectTo: '/welcome'
		});
	});

