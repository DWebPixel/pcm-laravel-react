<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'filters' => Request::all('search', 'role', 'trashed'),
            'users' => User::orderByName()
                ->filter(Request::only('search', 'role', 'trashed'))
                ->get()
                ->transform(fn ($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'bc_address' => $user->bc_address,
                    'role' => $user->role,
                    'deleted_at' => $user->deleted_at,
                ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(): RedirectResponse
    {
        Request::validate([
            'first_name' => ['required', 'max:25'],
            'last_name' => ['required', 'max:25'],
            'email' => ['required', 'max:50', 'email', Rule::unique('users')],
            'bc_address' => ['required', 'max:120', Rule::unique('users')],
            'password' => ['nullable'],
            'role' => ['required'],
            'address' => ['nullable'],
            'contact' => ['nullable'],
        ], [
            'bc_address.required' => 'Blockchain address is required'
        ]);

        User::create([
            'first_name' => Request::get('first_name'),
            'last_name' => Request::get('last_name'),
            'email' => Request::get('email'),
            'password' => Request::get('password'),
            'bc_address' => Request::get('bc_address'),
            'address' => Request::get('address'),
            'contact' => Request::get('contact'),
            'role' => Request::get('role'),
            // 'photo_path' => Request::file('photo') ? Request::file('photo')->store('users') : null,
        ]);

        return Redirect::route('users.index')->with('success', 'User created.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'bc_address' => $user->bc_address,
                'address' => $user->address,
                'email' => $user->email,
                'contact' => $user->contact,
                'role' => $user->role,
                // 'photo' => $user->photo_path ? URL::route('image', ['path' => $user->photo_path, 'w' => 60, 'h' => 60, 'fit' => 'crop']) : null,
                'deleted_at' => $user->deleted_at,
                'can_delete' => ! App::environment('demo') || ! $user->isDemoUser(),
                'metas' => $this->getUserMetaFields($user)
            ],
        ]);
    }

    public function getUserMetaFields($user) {
        $metas = [];
        foreach($user->metas as $meta){
            $metas[$meta->meta_key] = $meta->value;
        }
        return $metas;
    }

    public function update(User $user): RedirectResponse
    {
        if (App::environment('demo') && $user->isDemoUser()) {
            return Redirect::back();
        }

        Request::validate([
            'first_name' => ['required', 'max:25'],
            'last_name' => ['required', 'max:25'],
            'email' => ['required', 'max:50', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable'],
            'bc_address' => ['required', 'max:120', Rule::unique('users')->ignore($user->id)],
            'role' => ['required'],
            'address' => ['nullable'],
            'contact' => ['nullable'],
        ], [
            'bc_address.required' => 'Blockchain address is required'
        ]);

        $user->update(Request::only('first_name', 'last_name', 'email', 'role', 'bc_address', 'address', 'contact'));

        // if (Request::file('photo')) {
        //     $user->update(['photo_path' => Request::file('photo')->store('users')]);
        // }

        if (Request::get('password')) {
            $user->update(['password' => Request::get('password')]);
        }

        return Redirect::back()->with('success', 'User updated.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if (App::environment('demo') && $user->isDemoUser()) {
            return Redirect::back()->with('error', 'Deleting the demo user is not allowed.');
        }

        $user->delete();

        return Redirect::back()->with('success', 'User deleted.');
    }

    public function restore(User $user): RedirectResponse
    {
        $user->restore();

        return Redirect::back()->with('success', 'User restored.');
    }

    public function updateMeta(User $user, Request $request): RedirectResponse
    {

        $fields = Request::all();

        $whitelistKeys = [
            "dob",
            "occupation",
            "emergency_contact",
            "emergency_contact_phone",
            "medicare_card_id",
            "medicare_card_number",
            "private_health_care",
            "speciality",
            "registration_no"
        ];

        foreach($fields as $key => $value) {
            if( in_array($key, $whitelistKeys) ) {
                $user->metas()->updateOrCreate(['meta_key' => $key], ['value' => $value]);
            }
        }

        return Redirect::back()->with('success', 'Update successful.');
    }
}
