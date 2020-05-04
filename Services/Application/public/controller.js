var myapp = angular.module('bookcatalog', []);

myapp.controller('mainController', ['$scope' , '$http', function($scope, $http) {
    console.log("Entered into the main controller");
    $scope.isInitialized = false;
    
    $scope.searchKeyword = function(){
        $scope.hideVar = false;
        $http.get('/search/'.concat($scope.keyword)).then(function(response) {
            $scope.rows = response.data;
            $scope.isInitialized = true;
        });
    }

    $scope.saveNotes = function(){
        $scope.isInitialized = true;
        var data = {'note': $scope.note, 'keyword': $scope.keyword };
        $http.post('/notes', data).then(function(response) {
            console.log(response.data);
        });
        $scope.note = '';
    }

    $scope.retrieveNotes = function(){
        $scope.isInitialized = true;
        $scope.hideVar = true;
        $http.get('/retrievenotes/'.concat($scope.keyword)).then(function(response) {
            $scope.rows = response.data;
        });
    }

    $scope.reset = function() {
        $scope.note = '';
    };
}]);