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
            'organizations' => Organization::orderBy('name')
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
        Organization::create(array_merge( $request->validated(), ['user_id' => auth()->id()]));

        return Redirect::route('organizations.index')->with('success', 'Organization created.');
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
                'role' => $user->pivot->role
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

        return Redirect::back()->with('success', 'Organization updated.');
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

        $roles = [
           [
            'role' => 'doctor',
            'label' => 'Doctor'
           ],
           [
            'role' => 'nurse',
            'label' => 'Nurse'
           ]
        ];

        switch( $organization->type ) {
            case 'insurance_company':
                $roles = [
                    [
                        'role' => 'sales_agent',
                        'label' => 'Sales Agent'
                    ],
                ];
                break;
            case 'pharma_company': 
                $roles = [
                    [
                        'role' => 'medical_reprsentative',
                        'label' => 'Medical Representative'
                    ],
                    [
                        'role' => 'scientist',
                        'label' => 'Scientist'
                    ],
                ];
                break;
        }
        return Inertia::render('Organizations/CreateUser', [
            'organization' => $organization,
            'roles' => $roles,
            'users' => User::where('is_patient', false)->get()->map->only('id', 'name')
        ]);
    }

    public function storeUser(Organization $organization, Request $request){
        $user = User::find(Request::get('user_id'));
        $organization->users()->attach($user, ['role' => Request::get('role')]);
        return Redirect::route('organizations.edit', $organization)->with('success', 'User added to organization!');
    }
}
