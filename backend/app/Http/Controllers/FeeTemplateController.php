<?php

namespace App\Http\Controllers;

use App\Models\FeeTemplate;
use App\Http\Requests\StoreFeeTemplateRequest;
use App\Http\Requests\UpdateFeeTemplateRequest;

class FeeTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $feeTemplates = FeeTemplate::select('*')
            ->where('creator_id', auth()->guard('api')->user()->id)
            ->get();

        return $feeTemplates;
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
     * @param  \App\Http\Requests\StoreFeeTemplateRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreFeeTemplateRequest $request)
    {
        $feeTemplate = new FeeTemplate;

        $feeTemplate->name = $request->name;
        $feeTemplate->description = $request->description;
        $feeTemplate->sum = $request->sum;
        $feeTemplate->currancy = $request->currancy;
        $feeTemplate->payVariant = $request->payVariant;
        $feeTemplate->apartament_id = $request->apartament_id;
        $feeTemplate->organization_id = $request->organization_id;
        $feeTemplate->organizationTariff_id = $request->organizationTariff_id;
        $feeTemplate->creator_id = auth()->guard('api')->user()->id;
        $feeTemplate->save();

        return $feeTemplate;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\FeeTemplate  $feeTemplate
     * @return \Illuminate\Http\Response
     */
    public function show(FeeTemplate $feeTemplate)
    {
        return $feeTemplate;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\FeeTemplate  $feeTemplate
     * @return \Illuminate\Http\Response
     */
    public function edit(FeeTemplate $feeTemplate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateFeeTemplateRequest  $request
     * @param  \App\Models\FeeTemplate  $feeTemplate
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateFeeTemplateRequest $request, FeeTemplate $feeTemplate)
    {

        $feeTemplate->name = $request->name;
        $feeTemplate->description = $request->description;
        $feeTemplate->sum = $request->sum;
        $feeTemplate->currancy = $request->currancy;
        $feeTemplate->payVariant = $request->payVariant;
        $feeTemplate->apartament_id = $request->apartament_id;
        $feeTemplate->organization_id = $request->organization_id;
        $feeTemplate->organizationTariff_id = $request->organizationTariff_id;

        $feeTemplate->save();

        return $feeTemplate;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\FeeTemplate  $feeTemplate
     * @return \Illuminate\Http\Response
     */
    public function destroy(FeeTemplate $feeTemplate)
    {
        // return FeeTemplate::destroy($feeTemplate->id);
        $model = FeeTemplate::find($feeTemplate->id);
        $model->delete();
        return $model;
    }
}
