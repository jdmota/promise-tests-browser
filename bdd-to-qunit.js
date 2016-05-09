( function( QUnit ) {

  // This code provides the minimum necessary to get the `promises-aplus-tests` to run with QUnit in the browser.

  function push( assert, error ) {
    if ( error ) {
      assert.pushResult( {
        result: false,
        actual: error.actual,
        expected: error.expected,
        message: error.message
      } );
    } else {
      assert.pushResult( {
        result: true,
        actual: true,
        expected: true,
        message: ""
      } );
    }
  }

  function handleAssertions( assert, fn ) {

    var maybePromise, error, assertDone;

    // This is how Mocha knows that it should wait for completion.
    if ( fn.length ) {

      assertDone = assert.async();

      fn( function( error ) {
        push( assert, error );
        assertDone();
      } );

    } else {

      try {
        maybePromise = fn();
      } catch ( e ) {
        error = e;
      }

      if ( maybePromise && typeof maybePromise.then === "function" ) {

        maybePromise.then( function() {
          push( assert );
        }, function( error ) {
          push( assert, error );
        } );

      } else {

        push( assert, error );

      }

    }

  }

  // Stack of hooks that `QUnit.module` provides.
  var hooksStack = [];

  function setHook( type ) {
    return function( fn ) {
      hooksStack[ hooksStack.length - 1 ][ type ]( function( assert ) {
        // Mocha hooks behave much like a regular test-case.
        handleAssertions( assert, fn );
      } );
    };
  }

  function describe( name, callback ) {
    QUnit.module( name, function( hooks ) {
      hooksStack.push( hooks );
      callback();
      hooksStack.pop();
    } );
  }

  function it( name, fn ) {
    QUnit.test( name, function( assert ) {
      handleAssertions( assert, fn );
    } );
  }

  this.it = this.specify = it;
  this.describe = this.context = describe;
  this.beforeEach = setHook( "beforeEach" );
  this.afterEach = setHook( "afterEach" );

} ).call( null, QUnit );
