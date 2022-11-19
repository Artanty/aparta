<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrganizationTariffsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('organization_tariffs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->double('price', 8, 2)->nullable();
            $table->string('measure')->nullable();
            $table->integer('fee_frequency')->nullable();
            $table->smallInteger('fee_deadline')->nullable();
            $table->bigInteger('organization_id')->nullable();
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
        Schema::dropIfExists('organization_tariffs');
    }
}
