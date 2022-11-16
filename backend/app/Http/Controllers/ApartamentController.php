<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Apartament;
use App\Models\ApartamentUser;
use App\Http\Requests\StoreApartamentRequest;
use App\Http\Requests\UpdateApartamentRequest;
use App\Http\Requests\GetApartamentRequest;
use App\Http\Requests\DeleteApartamentRequest;


class ApartamentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(GetApartamentRequest $request)
    {
        $apartaments = Apartament::select('*')
            ->where('creator_id', auth()->guard('api')->user()->id)
            ->get();

        return $apartaments;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreApartamentRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreApartamentRequest $request)
    {
        $apartament = new Apartament;
        $apartament->name = $request->name;
        $apartament->address = $request->address;
        $apartament->country = $request->country;
        $apartament->place = $request->place;
        $apartament->location = $request->location;
        $apartament->description = $request->description;
        $apartament->rentType = $request->rentType;
        $apartament->area = $request->area;
        $apartament->rooms = $request->rooms;
        $apartament->garage = $request->garage;
        $apartament->creator_id = auth()->guard('api')->user()->id;
        $apartament->save();

        return $apartament;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\models\Apartament  $apartament
     * @return \Illuminate\Http\Response
     */
    public function show(Apartament $apartament)
    {
        $apartaments = Apartament::find($apartament->id)->first();
        return $apartaments;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Apartament  $apartament
     * @return \Illuminate\Http\Response
     */
    public function edit(Apartament $apartament)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateApartamentRequest  $request
     * @param  \App\Models\Apartament  $apartament
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateApartamentRequest $request, Apartament $apartament)
    {
        $apartament = Apartament::find($apartament->id)->first();

        $apartament->name = $request->name;
        $apartament->address = $request->address;
        $apartament->country = $request->country;
        $apartament->place = $request->place;
        $apartament->location = $request->location;
        $apartament->description = $request->description;
        $apartament->rentType = $request->rentType;
        $apartament->area = $request->area;
        $apartament->rooms = $request->rooms;
        $apartament->garage = $request->garage;
        $apartament->creator_id = auth()->guard('api')->user()->id;
        $apartament->save();

        return $apartament;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Apartament  $apartament
     * @return \Illuminate\Http\Response
     */
    public function destroy(DeleteApartamentRequest $request, Apartament $apartament)
    {
        return Apartament::destroy($apartament->id);
    }

    public function getApartamentFees($request)
    {
        $apartamentFees = Apartament::findOrFail($request)->fees()->get();
        return response()->json($apartamentFees);
    }

    public function getApartamentUsers($request)
    {
        // $apartamentUsers = ApartamentUser::with('userDetails')->where('apartament_id', '=', $request)->get();
        $apartamentUsers = Apartament::findOrFail($request)->users()->get();
        return response()->json($apartamentUsers);
    }
}
