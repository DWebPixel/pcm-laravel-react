<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('consents', function (Blueprint $table) {
            $table->id();
            $table->integer('requestor_id')->index();
            $table->string('requestor_address', 120);
            $table->integer('requestee_id')->index();
            $table->string('requestee_address', 120);
            $table->integer('organization_id')->nullable()->index();
            $table->string('role', 60)->nullable();
            $table->string('access_type', 20);
            $table->json('purpose');
            $table->string('status', 20)->default('waiting'); //waiting, granted, denied, revoked
            $table->dateTime('granted_on')->nullable();
            $table->dateTime('denied_on')->nullable();
            $table->dateTime('revoked_on')->nullable();
            $table->string('granted_access_type', 20)->nullable();
            $table->json('granted_purpose')->nullable();
            $table->dateTime('expiry_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consents');
    }
};
