<?php

namespace App\Http\Controllers;

use App\Models\ExchangeRate;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ExchangeRateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $exchangeRates = ExchangeRate::select('*')->get();

        return $exchangeRates;
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $exchangeRate = new ExchangeRate;

        $exchangeRate->date = $request->date;
        $exchangeRate->currancyFrom = $request->currancyFrom;
        $exchangeRate->currancyTo = $request->currancyTo;
        $exchangeRate->currancyFromValue = $request->currancyFromValue;
        $exchangeRate->source = $request->source;
        $exchangeRate->_dateCurFromCurTo = $request->_dateCurFromCurTo;

        $exchangeRate->save();

        return $exchangeRate;
    }

    public function createBatch (Request $request) {
        $request = (array)$request->input('data');
        $arr = [];
        foreach($request as $columns){
            $model = new ExchangeRate;
            $columns['created_at'] = Carbon::now();
            $columns['updated_at'] = Carbon::now();
            $step = $model->fill((array)$columns);
            $arr[] = $step->attributesToArray();
        }
        ExchangeRate::insert($arr);
        return $arr[0];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ExchangeRate  $exchangeRate
     * @return \Illuminate\Http\Response
     */
    public function show(ExchangeRate $exchangeRate)
    {
        return $exchangeRate;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\exchangeRate  $exchangeRate
     * @return \Illuminate\Http\Response
     */
    public function edit(exchangeRate $exchangeRate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ExchangeRate  $exchangeRate
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ExchangeRate $exchangeRate)
    {
        // $exchangeRate = exchangeRate::find($request->id)->first();
        $exchangeRate->date = $request->date;
        $exchangeRate->currancyFrom = $request->currancyFrom;
        $exchangeRate->currancyTo = $request->currancyTo;
        $exchangeRate->currancyFromValue = $request->currancyFromValue;
        $exchangeRate->source = $request->source || '1';

        $exchangeRate->save();

        return $exchangeRate;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(ExchangeRate $exchangeRate)
    {
        $model = ExchangeRate::find($exchangeRate->id);
        $model->delete();
        return $model;
    }
}
