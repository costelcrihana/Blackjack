angular
	.module('com.blackjack.game', ['com.blackjack.card'])
	.controller('GameCtrl', function($scope) {
		
		$scope.cardNumbers = [
			{name: "2", values: [2]}, 
			{name: "3", values: [3]},
			{name: "4", values: [4]}, 
			{name: "5", values: [5]},
			{name: "6", values: [6]}, 
			{name: "7", values: [7]},
			{name: "8", values: [8]}, 
			{name: "9", values: [9]},
			{name: "10", values: [10]}, 
			{name: "J", values: [10]},
			{name: "Q", values: [10]}, 
			{name: "K", values: [10]},
			{name: "A", values: [1, 11]}, 
		];
		$scope.symbols = ['hearts', 'spades', 'clubs', 'diamonds'];
		
		$scope.results = {
				DRAW: {
					message: 'DRAW, LET\'S TRY AGAIN',
					player: 0,
					dealer: 0
				},
				LOSE: {
					message: 'YOU LOST, LET\'S TRY AGAIN',
					player: 0,
					dealer: 1
				},
				WIN: {
					message: 'YOU WON, PLAY MORE',
					player: 1,
					dealer: 0
				}
		};
		
		/**
		 * generate card deck
		 */
		var generateCards = function() {
			$scope.cards = [];
			_.forEach($scope.cardNumbers, function(cardNumber) {
				_.forEach($scope.symbols, function(symbol) {
					var card = _.clone(cardNumber);
					card.symbol = symbol;
					$scope.cards.push(card);
				});
			});
			
			$scope.cards = _.shuffle($scope.cards, 52);
		};
		
		/**
		 * Reset scores
		 */
		var resetScores = function() {
			$scope.dealerScore = 0;
			$scope.playerScore = 0;
		}
		
		/**
		 * Calculate points
		 */
		var calculatePoints = function(cards) {
			points = [];
			//calculate all possible point combinations, in case we have 2, 3 or 4 aces
			_.forEach(cards, function(card) {
				if (_.isEmpty(points)) {
					points = _.clone(card.values);
				} else {
					var newPoints = [];
					_.forEach(card.values, function(value) {
						_.forEach(points, function(p) {
							newPoints.push(p + value);
						});
					});
					points = _.sortedUniq(newPoints);
				}
			});
			return points;
		}
		
		/**
		 * Deal card
		 */
		var dealCard = function() {
			var cardToRemove = $scope.cards.splice(0, 1);
			return cardToRemove[0];
		};

		/**
		 * Calculate hand points
		 */
		var calculatePointsForPlayers = function() {
			$scope.dealerHandPoints = calculatePoints($scope.dealerCards);
			$scope.playerHandPoints = calculatePoints($scope.playerCards);
		};
		
		/**
		 * Calculate if it's a blackjack for any of the players
		 */
		var blackJackWinner = function() {
			if ($scope.playerHandPoints.indexOf(21) >= 0 && $scope.dealerHandPoints.indexOf(21) >= 0) {
				return $scope.results.DRAW;
			}
			
			if ($scope.playerHandPoints.indexOf(21) >= 0 && $scope.dealerHandPoints.indexOf(21) == -1) {
				return $scope.results.WIN;
			}
			
			if ($scope.playerHandPoints.indexOf(21) == -1 && $scope.dealerHandPoints.indexOf(21) >= 0) {
				return $scope.results.LOSE;
			}
			
			return null;
		}
		
		/**
		 * Calculate hand winner
		 */
		var decideWinner = function() {
			if (!_.isNull(blackJackWinner())) {
				return blackJackWinner();
			}
			
			if (_.max($scope.playerHandPoints) == _.max($scope.dealerHandPoints)) {
				return $scope.results.DRAW;
			}
			
			if (_.max($scope.playerHandPoints) > _.max($scope.dealerHandPoints)) {
				return $scope.results.WIN;
			}
			
			if (_.max($scope.playerHandPoints) < _.max($scope.dealerHandPoints)) {
				return $scope.results.LOSE;
			}
		};
		
		/**
		 * Decide hand loser if any of the players score is over 21
		 */
		var decideLoser = function() {
			if (_.min($scope.playerHandPoints) > 21 &&  _.min($scope.dealerHandPoints) > 21) {
				return $scope.results.DRAW;
			}

			if (_.min($scope.playerHandPoints) > 21 &&  _.min($scope.dealerHandPoints) <= 21) {
				return $scope.results.LOSE;
			}

			if (_.min($scope.playerHandPoints) <= 21 &&  _.min($scope.dealerHandPoints) > 21) {
				return $scope.results.WIN;
			}
			return null;
		};
		
		var dealerTurn = function() {
			if (_.max($scope.dealerHandPoints) < 17) {
				$scope.dealerCards.push(dealCard());
			}
		};
		
		var calculateTotalScore = function() {
			$scope.dealerScore += $scope.handResult.dealer;
			$scope.playerScore += $scope.handResult.player;
		};
		
		/**
		 * Deal cards
		 */
		$scope.deal = function() {
			generateCards();
			$scope.handResult = {};

			$scope.dealerCards = [];
			$scope.playerCards = [];

			$scope.dealerCards.push(dealCard());
			$scope.playerCards.push(dealCard())
			$scope.dealerCards.push(dealCard());
			$scope.playerCards.push(dealCard());

			calculatePointsForPlayers();
			
			//see if any of the players is a lucky winner
			if (!_.isNull(blackJackWinner())) {
				$scope.handResult = blackJackWinner();
				calculateTotalScore();
			}
		};
		
		/**
		 * allow deal only at the start of the game
		 */
		$scope.isOkToStart = function() {
			if (!_.isEmpty($scope.handResult) || (_.isEmpty($scope.playerCards) && _.isEmpty($scope.dealerCards))) {
				return true;
			}
			return false;
		};
		
		/**
		 * allow hit or stand only during the game
		 */
		$scope.isOkToTakeAction = function() {
			return _.isEmpty($scope.handResult) && !$scope.isOkToStart();
		};
		
		/**
		 * hit action
		 */
		$scope.hitMe = function() {
			$scope.playerCards.push(dealCard());
			dealerTurn();
			calculatePointsForPlayers();

			if (!_.isNull(decideLoser())) {
				$scope.handResult = decideLoser();
				calculateTotalScore();
			} else if (!_.isNull(blackJackWinner())) {
				$scope.handResult = blackJackWinner();
				calculateTotalScore();
			}
		};
		
		/**
		 * stand action
		 */
		$scope.stand = function() {
			while(_.max($scope.dealerHandPoints) < 17) {
				dealerTurn();
				calculatePointsForPlayers();
			}

			if (!_.isNull(decideLoser())) {
				$scope.handResult = decideLoser();
			} else if (!_.isNull(blackJackWinner())) {
				$scope.handResult = blackJackWinner();
			} else {
				$scope.handResult = decideWinner();
			}
			calculateTotalScore();
		};
		
		/**
		 * init
		 */
		var init = function() {
			resetScores();
		};
		
		init();
	});

