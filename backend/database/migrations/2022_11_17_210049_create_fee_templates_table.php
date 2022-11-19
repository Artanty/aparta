<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeeTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee_templates', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('currancy')->nullable();
            $table->double('sum', 8, 2)->nullable();
            $table->bigInteger('organizationTariff_id')->nullable();
            $table->bigInteger('organization_id')->nullable();
            $table->bigInteger('apartament_id');
            $table->smallInteger('payVariant')->nullable();
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
        Schema::dropIfExists('fee_templates');
    }
}
