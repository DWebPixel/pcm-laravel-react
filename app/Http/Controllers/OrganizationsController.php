<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrganizationsRequest;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class OrganizationsController extends Controller
{
    public function index()
    {
        return Inertia::render('Organizations/Index', [
            'filters' => Request::all('search', 'trashed'),
            'organizations' => Organization::latest()
                ->filter(Request::only('search', 'trashed'))
                ->paginate(10)
                ->withQueryString()
                ->through(fn ($organization) => [
                    'id' => $organization->id,
                    'name' => $organization->name,
                    'type' => $organization->type,
                    'phone' => $organization->phone,
                    'address' => $organization->address,
                    'deleted_at' => $organization->deleted_at,
                ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Organizations/Create');
    }

    public function store(OrganizationsRequest $request): RedirectResponse
    {
        $organization = Organization::create(array_merge( $request->validated(), ['user_id' => auth()->id()]));

        return Redirect::back()->with(['success' => 'Organization created.', 'data' => $organization]);
    }

    public function edit(Organization $organization)
    {
        $users = [];
        foreach($organization->users()->orderByName()->get() as $user) {
            $users[] = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'bc_address' => $user->bc_address,
                'role' => $user->role
            ];
        }

        return Inertia::render('Organizations/Edit', [
            'organization' => [
                'id' => $organization->id,
                'name' => $organization->name,
                'type' => $organization->type,
                'phone' => $organization->phone,
                'address' => $organization->address,
                'deleted_at' => $organization->deleted_at,
                'users' => $users,
            ],
        ]);
    }

    public function update(Organization $organization, OrganizationsRequest $request): RedirectResponse
    {
        $organization->update($request->validated());

        return Redirect::back()->with(['success' => 'Organization v.', 'data' => $organization->refresh()]);
    }

    public function destroy(Organization $organization): RedirectResponse
    {
        $organization->delete();

        return Redirect::back()->with('success', 'Organization deleted.');
    }

    public function restore(Organization $organization): RedirectResponse
    {
        $organization->restore();

        return Redirect::back()->with('success', 'Organization restored.');
    }

    public function createUser(Organization $organization) {

        switch( $organization->type ) {
            case 'insurance_company':
                $roles = [ 'Sales Agent' ];
                break;
            case 'pharma_company': 
                $roles = ['Medical Representative', 'Scientist'];
                break;
            case 'hospital': 
                $roles = ['Doctor', 'Nurse'];
                break;    
        }
        return Inertia::render('Organizations/CreateUser', [
            'organization' => $organization,
            'roles' => $roles,
            'users' =>  User::whereIn('role', $roles)->get()->map->only('id', 'name', 'role')
        ]);
    }

    public function storeUser(Organization $organization, Request $request){
        $user = User::find(Request::get('user_id'));
        $organization->users()->attach($user);
        return Redirect::back()->with(['success' => 'User added to organization!', 'data' => [ 'user_id' => $user->id, 'org_id' => $organization->id]]);
        //return Redirect::route('organizations.edit', $organization)->with('success', 'User added to organization!');
    }
}
