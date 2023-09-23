<?php

namespace App\Http\Controllers;

use App\Models\External;
use Illuminate\Http\Request;
use App\Http\Requests\GetExternalRequest;
use App\Http\Requests\StoreExternalRequest;
class ExternalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(GetExternalRequest $request)
    {
        $externals = External::select('*')
            // ->where('creator_id', auth()->guard('api')->user()->id)
            ->get();
        return $externals;
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
     * @param  \Illuminate\Http\StoreExternalRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreExternalRequest $request)
    {
        $external = new External;
        $external->name = $request->name;
        $external->externalUserId = $request->externalUserId;
        $external->userId = $request->userId;
        $external->organization = $request->organization;
        $external->body = $request->body;
        $external->organizationService = $request->organizationService;
        $external->sum = $request->sum;
        $external->hash = $request->hash;
        $external->externalDate = $request->externalDate;
        // $external->creator_id = auth()->guard('api')->user()->id;
        $external->save();

        return $external;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\models\external  $external
     * @return \Illuminate\Http\Response
     */
    public function show(external $external)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\models\external  $external
     * @return \Illuminate\Http\Response
     */
    public function edit(external $external)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\models\external  $external
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, external $external)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\models\external  $external
     * @return \Illuminate\Http\Response
     */
    public function destroy(external $external)
    {
        //
    }
}
