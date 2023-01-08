<?php

namespace App\Http\Controllers;

use App\Models\MoneyTransfer;
use Illuminate\Http\Request;

class MoneyTransferController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $moneyTransfer = MoneyTransfer::select('*')
            ->where('creator_id', auth()->guard('api')->user()->id)
            ->get();

        return $moneyTransfer;
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
        $moneyTransfer = new MoneyTransfer;

        $moneyTransfer->name = $request->name;
        $moneyTransfer->description = $request->description;

        $moneyTransfer->sum1 = $request->sum1;
        $moneyTransfer->currancy1 = $request->currancy1;

        $moneyTransfer->sum2 = $request->sum2;
        $moneyTransfer->currancy2 = $request->currancy2;

        $moneyTransfer->sum3 = $request->sum3;
        $moneyTransfer->currancy3 = $request->currancy3;

        $moneyTransfer->sum4 = $request->sum4;
        $moneyTransfer->currancy4 = $request->currancy4;

        $moneyTransfer->date = $request->date;
        $moneyTransfer->apartament_id = $request->apartament_id;

        $moneyTransfer->creator_id = auth()->guard('api')->user()->id;
        $moneyTransfer->save();

        return $moneyTransfer;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\MoneyTransfer  $moneyTransfer
     * @return \Illuminate\Http\Response
     */
    public function show(MoneyTransfer $moneyTransfer)
    {
        return $moneyTransfer;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\MoneyTransfer  $moneyTransfer
     * @return \Illuminate\Http\Response
     */
    public function edit(MoneyTransfer $moneyTransfer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\MoneyTransfer  $moneyTransfer
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, MoneyTransfer $moneyTransfer)
    {

        $moneyTransfer->name = $request->name;
        $moneyTransfer->description = $request->description;

        $moneyTransfer->sum1 = $request->sum1;
        $moneyTransfer->currancy1 = $request->currancy1;

        $moneyTransfer->sum2 = $request->sum2;
        $moneyTransfer->currancy2 = $request->currancy2;

        $moneyTransfer->sum3 = $request->sum3;
        $moneyTransfer->currancy3 = $request->currancy3;

        $moneyTransfer->sum4 = $request->sum4;
        $moneyTransfer->currancy4 = $request->currancy4;

        $moneyTransfer->date = $request->date;
        $moneyTransfer->apartament_id = $request->apartament_id;

        $moneyTransfer->save();

        return $moneyTransfer;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\MoneyTransfer  $moneyTransfer
     * @return \Illuminate\Http\Response
     */
    public function destroy(MoneyTransfer $moneyTransfer)
    {
        $model = MoneyTransfer::find($moneyTransfer->id);
        $model->delete();
        return $model;
    }
}
