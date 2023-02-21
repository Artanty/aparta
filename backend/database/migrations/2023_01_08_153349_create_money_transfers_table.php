<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMoneyTransfersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('money_transfers', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('name')->nullable();
            $table->text('description')->nullable();

            $table->integer('currancy1');
            $table->double('sum1', 8, 2);
            $table->float('currancy1Value')->nullable();

            $table->integer('currancy2')->nullable();
            $table->double('sum2', 8, 2)->nullable();
            $table->float('currancy2Value')->nullable();

            $table->integer('currancy3')->nullable();
            $table->double('sum3', 8, 2)->nullable();
            $table->float('currancy3Value')->nullable();

            $table->integer('currancy4')->nullable();
            $table->double('sum4', 8, 2)->nullable();

            $table->string('date')->nullable();

            $table->bigInteger('apartament_id')->nullable();
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
        Schema::dropIfExists('money_transfers');
    }
}
