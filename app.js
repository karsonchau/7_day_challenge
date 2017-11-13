/* Author: Karson Chau

   7 Day challenge for Spoonity.
*/


var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider){
   $routeProvider
   .when('/', {
      templateUrl: 'views/search.html',
      controller: 'searchController'
   })
   .when('/city/:cityName', {
      templateUrl: 'views/city.html',
      controller: 'cityController'
   })
   .when('/restaurants/:cityId/:cityName', {
      templateUrl: 'views/restaurants.html',
      controller: 'restaurantController'
   })
   .otherwise({
      redirectTo: '/'
   });
});

/*
   This controller checks the input of the search. If it is a valid input, it will load
   city.html and pass paramters to display the list of cities with the same name.
*/

app.controller('searchController', function($scope, $location){
   $scope.search = function(){
      $scope.inputCity = $scope.city;
      if(checkInput($scope.inputCity)) {
         $location.path('/city/'+$scope.inputCity);
      }
      else {
         $scope.inputError = "Invalid input. Input should not contain special characters or begin with whitespace."
      }
   };

   /*This function checks to see if the search input is valid. It checks empty and special characters. These
      inputs are not valid for searching cities.
   */
   var checkInput = function(input) {
      if(/^[a-zA-Z0-9- ]*$/.test(input) == false) {
         return false;
      }
      else if (input === undefined) {
         return false;
      }
      else if (input == "") {
         return false;
      }
      else {
         return true;
      }
   }
});

/*
   cityController gets the list of cities to display to the user.
*/
app.controller('cityController', function($scope, $http, $location, $routeParams){
   $scope.getCities = function(){

      $http({
            method: 'GET',
            url: 'https://developers.zomato.com/api/v2.1/cities?q=' + $routeParams.cityName,
            headers: {
              'user-key': '7a204a0651bc376a53ff3d80fc1a55b0'
            }
         }).then(function successCallback(response) {
            $scope.cities = response.data.location_suggestions;

            /*Checks the data returned from the API call to see if there are any results.
              If the array is empty then the input city name was not found in zomato.
            */
            if($scope.cities.length == 0) {
               $scope.resultTitle = $routeParams.cityName + " not found.";
            }
            else {
               $scope.resultTitle = "Results from search for " + $routeParams.cityName;
            }

           }, function errorCallback(response) {
             console.log(response.statusText);
           });

   };

   /*
    This function selectCity passes the parameters cityID and cityName to display
    the list of restaurants on the next page restaurants.html. Parameters are passed using
    $routeParams.
   */
   $scope.selectCity = function(index) {
      $scope.cityId = $scope.cities[index].id;
      $scope.cityName = $scope.cities[index].name;
      $location.path('/restaurants/'+$scope.cityId+'/'+$scope.cityName);
   }
});

/*
 restaurantController displays 20 restaurants from the city that the user has selected.
 cityName and cityId are paramters passed to the controller.
*/
app.controller('restaurantController', function($scope, $http, $routeParams){
   var getRestaurants = function(){
      $scope.cityName = $routeParams.cityName;
      $scope.restaurants = [];
      $http({
            method: 'GET',
            url: 'https://developers.zomato.com/api/v2.1/search?entity_id='+$routeParams.cityId+'&entity_type=city&count=20',
            headers: {
              'user-key': '7a204a0651bc376a53ff3d80fc1a55b0'
            }
         }).then(function successCallback(response) {
             $scope.restaurants = response.data.restaurants;

           }, function errorCallback(response) {
             console.log(response.statusText);
           });

   };

   getRestaurants();

});
