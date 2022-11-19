<?php

namespace App\Http\Controllers;

use App\Models\OrganizationTariff;
use App\Http\Requests\StoreOrganizationTariffRequest;
use App\Http\Requests\UpdateOrganizationTariffRequest;

class OrganizationTariffController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $organizationTariff = OrganizationTariff::select('*')
            ->where('creator_id', auth()->guard('api')->user()->id)
            ->get();

        return $organizationTariff;
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
     * @param  \App\Http\Requests\StoreOrganizationTariffRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreOrganizationTariffRequest $request)
    {
        $organizationTariff = new OrganizationTariff;
        $organizationTariff->name = $request->name;
        $organizationTariff->description = $request->description;
        $organizationTariff->price = $request->price;
        $organizationTariff->measure = $request->measure;
        $organizationTariff->fee_frequency = $request->fee_frequency;
        $organizationTariff->fee_deadline = $request->fee_deadline;
        $organizationTariff->creator_id = auth()->guard('api')->user()->id;
        $organizationTariff->save();

        return $organizationTariff;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\OrganizationTariff  $organizationTariff
     * @return \Illuminate\Http\Response
     */
    public function show(OrganizationTariff $organizationTariff)
    {
        return $organizationTariff;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\OrganizationTariff  $organizationTariff
     * @return \Illuminate\Http\Response
     */
    public function edit(OrganizationTariff $organizationTariff)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateOrganizationTariffRequest  $request
     * @param  \App\Models\OrganizationTariff  $organizationTariff
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateOrganizationTariffRequest $request, OrganizationTariff $organizationTariff)
    {
        $organizationTariff->name = $request->name;
        $organizationTariff->description = $request->description;
        $organizationTariff->price = $request->price;
        $organizationTariff->measure = $request->measure;
        $organizationTariff->fee_frequency = $request->fee_frequency;
        $organizationTariff->fee_deadline = $request->fee_deadline;
        $organizationTariff->creator_id = auth()->guard('api')->user()->id;
        $organizationTariff->save();

        return $organizationTariff;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\OrganizationTariff  $organizationTariff
     * @return \Illuminate\Http\Response
     */
    public function destroy(OrganizationTariff $organizationTariff)
    {
        return Organization::destroy($organizationTariff->id);
    }
}
