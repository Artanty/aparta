<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApartamentFeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('apartament_fees', function (Blueprint $table) {
            $table->increments('id');
            $table->bigInteger('apartament_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('sum')->nullable();
            $table->integer('currancy')->nullable();
            $table->integer('month');
            $table->integer('year');
            $table->boolean('paid');
            $table->bigInteger('creator_id')->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('apartament_fees');
    }
}
