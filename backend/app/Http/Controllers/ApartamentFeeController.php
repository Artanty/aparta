<?php

namespace App\Http\Controllers;
use App\Models\Apartament;
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
            ->with('apartament')
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

        $apartamentFee->name = $request->name;
        $apartamentFee->description = $request->description;
        $apartamentFee->sum = $request->sum;
        $apartamentFee->commission = $request->commission;
        $apartamentFee->currancy = $request->currancy;
        $apartamentFee->month = $request->month;
        $apartamentFee->year = $request->year;
        $apartamentFee->paid = $request->paid;
        $apartamentFee->paidDate = $request->paidDate;
        $apartamentFee->payVariant = $request->payVariant;
        $apartamentFee->organization_id = $request->organization_id;
        $apartamentFee->organizationTariff_id = $request->organizationTariff_id;
        $apartamentFee->apartament_id = $request->apartament_id;
        $apartamentFee->template_id = $request->template_id;
        $apartamentFee->rateSource = $request->rateSource;
        $apartamentFee->rateId = $request->rateId;
        $apartamentFee->creator_id = auth()->guard('api')->user()->id;
        $apartamentFee->save();

        if ($request->apartament_id) {
            $apartament = Apartament::find($request->apartament_id);
            $apartamentFee['apartament'] = $apartament;
        }

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
        return $apartamentFee;
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
        // $apartamentFee = ApartamentFee::find($request->id)->first();
        $apartamentFee->name = $request->name;
        $apartamentFee->description = $request->description;
        $apartamentFee->sum = $request->sum;
        $apartamentFee->commission = $request->commission;
        $apartamentFee->currancy = $request->currancy;
        $apartamentFee->month = $request->month;
        $apartamentFee->year = $request->year;
        $apartamentFee->paid = $request->paid;
        $apartamentFee->paidDate = $request->paidDate;
        $apartamentFee->payVariant = $request->payVariant;
        $apartamentFee->organization_id = $request->organization_id;
        $apartamentFee->organizationTariff_id = $request->organizationTariff_id;
        $apartamentFee->apartament_id = $request->apartament_id;
        $apartamentFee->template_id = $request->template_id;
        $apartamentFee->rateSource = $request->rateSource;
        $apartamentFee->rateId = $request->rateId;
        $apartamentFee->save();

        if ($request->apartament_id) {
            $apartament = Apartament::find($request->apartament_id);
            $apartamentFee['apartament'] = $apartament;
        }
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
        $model = ApartamentFee::find($apartamentFee->id);
        $model->delete();
        return $model;
    }
}
