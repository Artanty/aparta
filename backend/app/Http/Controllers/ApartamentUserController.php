<?php

namespace App\Http\Controllers;

use App\Models\ApartamentUser;
use App\Http\Requests\StoreApartamentUserRequest;
use App\Http\Requests\UpdateApartamentUserRequest;
use App\Http\Requests\DeleteApartamentUserRequest;

use App\Models\User;

class ApartamentUserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create($request)
    {
        $user = User::where('email', '=', $request)->first();
        return $user;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreApartamentUserRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreApartamentUserRequest $request)
    {
        $apartamentUser = new ApartamentUser;
        $apartamentUser->apartament_id = $request->apartament_id;
        $apartamentUser->user_id = $request->user_id;

        $apartamentUser->save();

        return $apartamentUser;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ApartamentUser  $apartamentUser
     * @return \Illuminate\Http\Response
     */
    public function show(ApartamentUser $apartamentUser)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ApartamentUser  $apartamentUser
     * @return \Illuminate\Http\Response
     */
    public function edit(ApartamentUser $apartamentUser)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateApartamentUserRequest  $request
     * @param  \App\Models\ApartamentUser  $apartamentUser
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateApartamentUserRequest $request, ApartamentUser $apartamentUser)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ApartamentUser  $apartamentUser
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // return ApartamentUser::destroy($id);
        $model = ApartamentUser::find($id);
        $model->delete();
        return $model;
        // return response()->json($user);
    }

    /**
     * Find user by email.
     *
     * @return \Illuminate\Http\Response
     */
    public function findUserByEmail($request)
    {
        return User::where('email', '=', $request)
                    ->where('id', '!=', auth()->guard('api')->user()->id)
                    ->firstOrFail();
        // return response()->json($user);
    }

}
