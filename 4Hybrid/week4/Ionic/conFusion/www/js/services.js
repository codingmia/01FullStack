'use strict';

angular.module('conFusion.services',['ngResource'])
         //.constant("baseURL","http://localhost:3000/")
        //Use Real IP address for android Emulator to recognize Server
        .constant("baseURL","http://192.168.2.5:3000/")

        .factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {           
            return $resource(baseURL+"leadership/:id");  
        }])

        .factory('favoriteFactory', ['$resource', 'baseURL', '$localStorage',function ($resource, baseURL, $localStorage) {
            var favFac = {};
            var favorites = $localStorage.getObject('favorites','[]');

            favFac.addToFavorites = function (index) {
                //Used as HashMap to avoid duplicates.
                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id == index)
                        return;
                }
                favorites.push({id: index});
                console.log("Add to localStorage", favorites);
                $localStorage.storeObject('favorites', favorites);  
            };

            favFac.deleteFromFavorites = function (index) {
                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id == index) {
                        favorites.splice(i, 1);
                        $localStorage.storeObject('favorites', favorites);  
                    }
                }              
            }

            favFac.getFavorites = function () {
                //return favorites;
                return $localStorage.getObject('favorites','[]');
            };

            return favFac;
        }])

        .factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
    
            return $resource(baseURL+"feedback/:id");
    
        }])

        .factory('$localStorage', ['$window', function($window) {
          return {
            store: function(key, value) {
              $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
              return $window.localStorage[key] || defaultValue;
            },
            storeObject: function(key, value) {
              $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key,defaultValue) {
              return JSON.parse($window.localStorage[key] || defaultValue);
            }
          }
        }])

        .factory('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
            return $resource(baseURL + "dishes/:id", null, {
                'update': {
                    method: 'PUT'
                }
            });
                        
        }])

        .factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
            return $resource(baseURL + "promotions/:id");

        }])

        
;
