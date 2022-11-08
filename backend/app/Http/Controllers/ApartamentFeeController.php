<?php

namespace App\Http\Controllers;

use App\Models\ApartamentFee;
use App\Http\Requests\StoreApartamentFeeRequest;
use App\Http\Requests\UpdateApartamentFeeRequest;
use App\Http\Requests\GetApartamentFeeRequest;
use App\Http\Requests\DeleteApartamentFeeRequest;

class ApartamentFeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(GetApartamentFeeRequest $request)
    {
        $apartamentFees = ApartamentFee::select('*')
            ->where('creator_id', auth()->guard('api')->user()->id)
            ->get();

        return $apartamentFees;
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
     * @param  \App\Http\Requests\StoreApartamentFeeRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreApartamentFeeRequest $request)
    {
        $apartamentFee = new ApartamentFee;
        $apartamentFee->apartament_id = $request->apartament_id;
        $apartamentFee->name = $request->name;
        $apartamentFee->description = $request->description;
        $apartamentFee->sum = $request->sum;
        $apartamentFee->currancy = $request->currancy;
        $apartamentFee->month = $request->month;
        $apartamentFee->year = $request->year;
        $apartamentFee->paid = $request->paid;
        $apartamentFee->creator_id = auth()->guard('api')->user()->id;
        $apartamentFee->save();

        return $apartamentFee;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ApartamentFee  $apartamentFee
     * @return \Illuminate\Http\Response
     */
    public function show(ApartamentFee $apartamentFee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ApartamentFee  $apartamentFee
     * @return \Illuminate\Http\Response
     */
    public function edit(ApartamentFee $apartamentFee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateApartamentFeeRequest  $request
     * @param  \App\Models\ApartamentFee  $apartamentFee
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateApartamentFeeRequest $request, ApartamentFee $apartamentFee)
    {
        $apartamentFee = ApartamentFee::find($request->id)->first();

        $apartamentFee->apartament_id = $request->apartament_id;
        $apartamentFee->name = $request->name;
        $apartamentFee->description = $request->description;
        $apartamentFee->sum = $request->sum;
        $apartamentFee->currancy = $request->currancy;
        $apartamentFee->month = $request->month;
        $apartamentFee->year = $request->year;
        $apartamentFee->paid = $request->paid;
        // $apartamentFee->creator_id = auth()->guard('api')->user()->id;
        $apartamentFee->save();

        return $apartamentFee;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ApartamentFee  $apartamentFee
     * @return \Illuminate\Http\Response
     */
    public function destroy(DeleteApartamentFeeRequest $request, ApartamentFee $apartamentFee)
    {
        return ApartamentFee::destroy($request);
    }
}
