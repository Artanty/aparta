<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApartamentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('apartaments', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('address');

            $table->string('country');
            $table->string('place');
            $table->string('location')->nullable();
            $table->string('description')->nullable();
            $table->integer('rentType')->nullable();
            $table->float('area', 5, 2)->nullable();
            $table->integer('rooms')->nullable();
            $table->integer('garage')->nullable();

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
        Schema::dropIfExists('apartaments');
    }
}
