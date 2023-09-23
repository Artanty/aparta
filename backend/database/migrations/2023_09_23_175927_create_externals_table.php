<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExternalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('externals', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('externalUserId')->nullable();
            $table->integer('userId')->nullable();
            $table->string('organization')->nullable();
            $table->string('name')->nullable();
            $table->string('body')->nullable();
            $table->string('organizationService')->nullable();
            $table->double('sum', 8, 2)->nullable();
            $table->string('hash')->nullable();
            $table->string('externalDate')->nullable();
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
        Schema::dropIfExists('externals');
    }
}
