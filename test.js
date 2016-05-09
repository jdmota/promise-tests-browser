QUnit.module( "Deferred", function() {

  var promisesAplusTests = require( "promises-aplus-tests" ).mocha;

  var adapter = {
    deferred: function() {
      var deferred = jQuery.Deferred();

      return {
        promise: deferred.promise(),
        resolve: deferred.resolve.bind( deferred ),
        reject: deferred.reject.bind( deferred )
      };
    }
  };

  promisesAplusTests( adapter, function( err ) {
    console.error( err );
  } );

} );
