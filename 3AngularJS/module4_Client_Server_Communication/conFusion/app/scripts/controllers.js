'use strict';

angular.module('confusionApp')

        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            

            $scope.showMenu = false;
            $scope.message = "Loading ...";

            menuFactory.getDishes().query(
                function(response) {
                    $scope.dishes = response; //Success, response is real data
                    $scope.showMenu = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );

            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory',function($scope, feedbackFactory) {
            
            $scope.sendFeedback = function() {
          
                console.log($scope.feedback);
              
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                      $scope.invalidChannelSelection = true;
                      console.log('incorrect');
                }
                else {
                      $scope.invalidChannelSelection = false;
                      feedbackFactory.save($scope.feedback);
                      $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                      $scope.feedback.mychannel="";
                      $scope.feedbackForm.$setPristine();
                      console.log($scope.feedback);
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {
            
            $scope.showDish = false;
            $scope.message="Loading ...";
            $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
            .$promise.then(
                function(response){
                    $scope.dish = response;
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );
                       
        }])

        
        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {
           
            $scope.comment = 
            {             
              rating: "5", 
              comment: "", 
              author: "",
              date : ""
            }; 
            
            $scope.submitComment = function () {
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                $scope.dish.comments.push($scope.mycomment);

                menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
                $scope.commentForm.$setPristine();
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            };           
            
        }])

        //Meaning: Controllers calls services to obtain necessary data, MVC
        .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL',
            function($scope, menuFactory, corporateFactory, baseURL) {

            $scope.baseURL = baseURL;

            $scope.showDish = false;
            $scope.showPromotion = false;
            $scope.showChef = false;

            $scope.message="Loading Feature Dish, Promotion and Chef...";

            //Obtain dish from server
            $scope.dish = menuFactory.getDishes().get({id:0})
            .$promise.then(
                function(response){
                    $scope.dish = response;
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );
            //Obtain promotion from server
            $scope.promotion = menuFactory.getPromotions().get({id:0})
            .$promise.then(
                function(response){
                    $scope.promotion = response;
                    $scope.showPromotion = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );

            $scope.chef = corporateFactory.get({id:3})
            .$promise.then(
                function(response){
                    $scope.chef = response;
                    $scope.showChef = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );
            
        }])

        .controller('AboutController', ['$scope', 'corporateFactory', 'baseURL',function($scope, corporateFactory, baseURL) {

            $scope.baseURL = baseURL; 
            $scope.showLeader = false;
            $scope.message = "Loading leadership information";
            $scope.leaders = corporateFactory.query()
            .$promise.then(
                function(response){
                    $scope.leaders = response;
                    $scope.showLeader = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );
            
        }])

;
