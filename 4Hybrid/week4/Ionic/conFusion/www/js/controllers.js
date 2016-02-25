angular.module('conFusion.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera,  $cordovaImagePicker) {

    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    //$scope.reservation = {};
    $scope.registration = {};

    // Login Modal
    //

    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    
    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);
      $localStorage.storeObject('userinfo', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };


    // Registration Modal
    //
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
        console.log('Doing register', $scope.registration);

        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };


    //Reserve Modal
    //
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.reserveform = modal;
    });


    // Open the reserve modal
    $scope.reserve = function() {
      $scope.reserveform.show();
    };

    // Triggered in the reserve modal to close it
    $scope.closeReserve = function() {
      $scope.reserveform.hide();
    };


    // Perform the reserve action when the user submits the reserve form
    $scope.doReserve = function() {
      console.log('Doing reservation', $scope.reservation);

      // Simulate a reservation delay. Remove this and replace with your reservation
      // code if using a server system
      $timeout(function() {
        $scope.closeReserve();
      }, 1000);
    };    

    $ionicPlatform.ready(function() 
    {  
      if(typeof Camera != "undefined")
      {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
         $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });

            $scope.registerform.show();

        };
      }else{
        $scope.takePicture = function() {
          console.log("Camera unavailable");
        };
      }
      
      $scope.selectPicture = function()
      {
        var options2 = {
           maximumImagesCount: 1,
           width: 100,
           height: 100,
           quality: 50
         };

         $cordovaImagePicker.getPictures(options2)
          .then(function (imageData) {
            $scope.registration.imgSrc = imageData[0];
            console.log("Success "+ imageData[0]);
          }, function(error) {
            console.log(err);
          });

          $scope.registerform.show(); 
      };
        
    });

  })
  
  .controller('AboutController', ['$scope', 'leaders', 'baseURL', function($scope, leaders, baseURL) {
    $scope.baseURL = baseURL; //baseURL is needed because aboutus.html is using it to generate the img src
    $scope.leaders = leaders;
    console.log($scope.leaders);
  }])

  .controller('ContactController', ['$scope', function($scope) {

      $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };      
      var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
      
      $scope.channels = channels;
      $scope.invalidChannelSelection = false;
                  
  }])

  .controller('DishDetailController', ['$scope', '$stateParams', 'dish','menuFactory', 'favoriteFactory','baseURL',  '$ionicPopover', '$ionicModal', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
      
      $scope.baseURL = baseURL;
      $scope.dish = dish;

      /*
          DishDetail.html, ng-click, openPopover()
          dish-detail-popover.html, ng-click, addFavorite()
          dish-detail-pop-over.html, ng-click, openComment()
      */


      //Add to Favourite
      $scope.openPopover = function($event) {  
        $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', 
        {
            scope: $scope  
        })
        .then(function(popover) {    
          $scope.popover = popover;    
          $scope.popover.show($event);  
        });
      };

      $scope.addFavorite = function () {
          favoriteFactory.addToFavorites($scope.dish.id);
          $scope.popover.hide();
          $ionicPlatform.ready(function () {
            $cordovaLocalNotification.schedule({
                id: 1,
                title: "Added Favorite",
                text: $scope.dish.name
            }).then(function () {
                console.log('Added Favorite '+$scope.dish.name);
            },
            function () {
                console.log('Failed to add Notification ');
            });

            $cordovaToast
              .show('Added Favorite '+$scope.dish.name, 'long', 'center')
              .then(function (success) {
                  // success
              }, function (error) {
                  // error
              });
          });
      };


      //Submit comments
      $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.commentForm = modal;
      });

      $scope.openComment = function() {
       $scope.commentForm.show();
      };

      $scope.closeComment = function() {
          $scope.commentForm.hide();
      };

      // Perform the reserve action when the user submits the reserve form
      $scope.mycomment = {rating:1, comment:"", author:"", date:""};

      $scope.doComment = function() {
        console.log('Doing comments', $scope.mycomment);
        $scope.submitComment();  
        $scope.popover.hide();     
      }; 

      $scope.submitComment = function () {
          
          $scope.mycomment.date = new Date().toISOString();
          console.log($scope.mycomment);
          $scope.mycomment.rating = parseInt($scope.mycomment.rating);
          $scope.dish.comments.push($scope.mycomment);
          menuFactory.update({id:$scope.dish.id},$scope.dish);
          
          $scope.mycomment = {rating:1, comment:"", author:"", date:""};
          $scope.closeComment();
      }
  }])

  .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
    
      $scope.mycomment = {rating:5, comment:"", author:"", date:""};
      
      $scope.submitComment = function () {
          
          $scope.mycomment.date = new Date().toISOString();
          console.log($scope.mycomment);
          
          $scope.dish.comments.push($scope.mycomment);
          menuFactory.update({id:$scope.dish.id},$scope.dish);
          
          $scope.commentForm.$setPristine();
          
          $scope.mycomment = {rating:5, comment:"", author:"", date:""};
      }
      
  }])

  .controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', '$localStorage','$cordovaVibration',  function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $localStorage, $cordovaVibration) {

    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    //Resolve
    //$scope.favorites = favorites;
    $scope.favorites = favorites;
    console.log("Favourites are " + $scope.favorites);
    $scope.dishes = dishes;

    console.log($scope.dishes, $scope.favorites);

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
    }

    $scope.deleteFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favoriteFactory.deleteFromFavorites(index);
                $scope.favorites = $localStorage.getObject('favorites','[]');
                //Vibrate
                $cordovaVibration.vibrate(600);
            } else {
                console.log('Canceled delete');
            }
        });

        $scope.shouldShowDelete = false;

    }

  }])

  .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
      
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


  .controller('IndexController', ['$scope', 'dish', 'leader', 'promotion', 'baseURL',function($scope, dish, leader, promotion, baseURL) {
        $scope.baseURL = baseURL;                     
        $scope.message="Loading ...";

        $scope.dish = dish;    
        $scope.leader = leader;   
        $scope.promotion = promotion;

  }])


  .controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
              
      $scope.baseURL = baseURL;
      $scope.tab = 1;
      $scope.filtText = '';
      $scope.showDetails = false;
      $scope.showMenu = false;
      $scope.message = "Loading ...";
      
      $scope.dishes = dishes;

      $scope.addFavorite = function (index) {
        console.log("index is " + index);
        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons(); //Once the item added, enable the swipe and remove button.
        
         $ionicPlatform.ready(function () {
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.dishes[index].name
                }).then(function () {
                    console.log('Added Favorite '+$scope.dishes[index].name);
                },
                function () {
                    console.log('Failed to add Notification ');
                });

                $cordovaToast
                  .show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });
        });

      };

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

  .filter('favoriteFilter', function(favoriteFactory) {  
    return function(dishes, favorites) { 
      //refreshing the favorites variable   
      favorites = favoriteFactory.getFavorites();    
      var out = [];    
      for (var i = 0; i < favorites.length; i++) {      
        for (var j = 0; j < dishes.length; j++) {        
          if (dishes[j].id === favorites[i].id) {          
            out.push(dishes[j]);        
        }      
      }    
     }    
     return out;  
    };
  })



;
