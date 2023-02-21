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

            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('currancy')->nullable();
            $table->double('sum', 8, 2)->nullable();
            $table->double('commission', 6, 2)->nullable();
            $table->integer('month');
            $table->integer('year');
            $table->boolean('paid');
            $table->string('paidDate')->nullable();
            $table->bigInteger('organization_id')->nullable();
            $table->bigInteger('organizationTariff_id')->nullable();
            $table->bigInteger('template_id')->nullable();
            $table->bigInteger('apartament_id');
            $table->smallInteger('payVariant')->nullable();
            $table->bigInteger('creator_id')->unsigned();

            $table->integer('rateSource')->nullable();
            $table->integer('rateId')->nullable();
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
