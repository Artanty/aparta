<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('register', 'Auth\UserAuthController@register');
Route::post('login', 'Auth\UserAuthController@login');

Route::resource('apartament', 'ApartamentController');
Route::get('apartament/getApartamentFees/{id}', 'ApartamentController@getApartamentFees');
Route::get('apartament/getApartamentUsers/{id}', 'ApartamentController@getApartamentUsers');

Route::get('apartament/getApartamentFees2/{id}', 'ApartamentController@getApartamentFees2');

Route::resource('apartamentFee', 'ApartamentFeeController');

Route::resource('apartamentUser', 'ApartamentUserController');
Route::get('apartamentUser/findUserByEmail/{email}', 'ApartamentUserController@findUserByEmail');

Route::resource('feeTemplate', 'FeeTemplateController');
Route::resource('organization', 'OrganizationController');
Route::resource('organizationTariff', 'OrganizationTariffController');

Route::resource('moneyTransfer', 'MoneyTransferController');

