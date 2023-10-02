<?php

use Illuminate\Support\Facades\App;

$environment = App::environment();

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

if (App::environment('production')) {

    Route::any('{path?}', function($path = null) {
        $locale = 'ru'; // Default language

        if (preg_match('/^(ru|en-US)/', $path, $matches)) {
            $locale = $matches[1]; // Get the matched language code
        }

        return File::get(public_path() . "/$locale/index.html");
    })->where('path', '.*');

} else if (App::environment('local')) {

//    Route::get('{path?}/', function () {
//        //     return view('welcome');
//        return File::get(public_path() . '/index.php');
//    })->where("path", ".+");
}
