<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Apartament;
use App\Models\ApartamentUser;
use App\Http\Requests\StoreApartamentRequest;
use App\Http\Requests\UpdateApartamentRequest;
use App\Http\Requests\GetApartamentRequest;
use App\Http\Requests\DeleteApartamentRequest;
use App\Http\Requests\GetApartamentFeesRequest;
use DB;

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
        // $apartaments = DB::table('apartaments')
        //    ->whereExists(function ($query) {
        //        $query->select(DB::raw(1))
        //              ->from('apartament_users')
        //              ->whereColumn('apartament_users.apartament_id', 'apartaments.id')
        //              ->where('apartament_users.user_id', '=', auth()->guard('api')->user()->id);
        //    })->get();

        return $apartaments;
        // return auth()->guard('api')->user()->id;
        // $apartamentUsers = Apartament::findOrFail($request)->users()->get();
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
        return $apartament;
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
        // return Apartament::destroy($apartament->id);
        $model = Apartament::find($apartament->id);
        $model->delete();
        return $model;
    }

    // public function getApartamentFees(GetApartamentFeesRequest $request)
    // {
    //     $apartamentFees = Apartament::findOrFail($request->route('id'))->fees()
    //     ->get();
    //     return response()->json($apartamentFees);
    // }

    public function getApartamentFees(GetApartamentFeesRequest $request)
    {
        $from = date($request->input('year').'-01-01');
        $to = date($request->input('year').'-12-31');
        $apartamentFees = Apartament::findOrFail($request->route('id'))->fees()
        ->whereBetween('paidDate', [$from, $to])
        ->get();
        return response()->json($apartamentFees);
    }

    // public function getApartamentFees2(GetApartamentFeesRequest $request) // get apart fess of year
    // {
    //     $apartamentFees = Apartament::findOrFail($request->route('id'))->fees()
    //     ->when(isset($request->year), function($query) use ($request){
    //         $query->where('year', '=', $request->year)->with('organization');
    //       },function($query){
    //         $query->where("year", '>', 0);
    //       })->get();

    //     $collection = collect($apartamentFees);
    //     $grouped = $collection->mapToGroups(function ($item, $key) {
    //         return [$item['organization_id'] => $item];
    //     });
    //     return response()->json($grouped);
    // }
    private function setGroupBy1 ($request) {
        $groupBy1 = 'organization_id';
        switch($request->groupBy1) {
            case 'template':
                $groupBy1 = 'template_id';
                break;
            case 'name':
                $groupBy1 = 'name';
                break;
            default:
                $groupBy1 = 'organization_id';
        }
        return $groupBy1;
    }
    public function getApartamentFees2(GetApartamentFeesRequest $request) // get apart fess group by year and organizations
    {
        // todo add required groupBy param!!
        $groupBy1 = $this->setGroupBy1($request);
        $apartamentFees = Apartament::findOrFail($request->route('id'))->fees()
        ->when(isset($request->yearFrom), function($query) use ($request){
                $query->where('year', '>=', $request->yearFrom)->with(['organization', 'template']);
            },
            function($query){
                $query->where("year", '>', 0)->with(['organization', 'template']);
            })
        ->get()
        ->groupBy([
            $groupBy1,
            (isset($request->groupBy2) && $request->groupBy2 == 'year') ? 'year' : 'year'
        ]);
        return response()->json($apartamentFees);
    }

    public function getApartamentUsers($request)
    {
        // $apartamentUsers = ApartamentUser::with('userDetails')->where('apartament_id', '=', $request)->get();
        $apartamentUsers = Apartament::findOrFail($request)->users()->get();
        return response()->json($apartamentUsers);
    }
    public function getApartamentFees2norm(GetApartamentFeesRequest $request) // get apart fess group by year and organizations
    {
        $apartamentFees = Apartament::findOrFail($request->route('id'))->fees()->with('organization')
        ->get()
        ->groupBy([
            'organization_id',
            'year'
        ]);
        return response()->json($apartamentFees);

        // $collection = collect($apartamentFees);
        // $grouped = $collection->mapToGroups(function ($item, $key) {
        //     return [$item['year'] => $item];
        // });
        // $grouped = $collection->groupBy([
        //     'organization_id',
        //     function($item) {
        //         return $item['year'];
        //     },
        // ], $preserveKeys = true);

        // return response()->json($grouped);
    }
}
