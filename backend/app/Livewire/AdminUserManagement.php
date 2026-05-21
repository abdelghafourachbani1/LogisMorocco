<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserManagement extends Component
{
    use WithPagination;

    public $isModalOpen = false;
    
    public $user_id;
    public $name;
    public $email;
    public $password;
    public $role = 'merchant';
    public $phone;

    public $search = '';

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function openModal()
    {
        $this->resetInputFields();
        $this->isModalOpen = true;
    }

    public function closeModal()
    {
        $this->isModalOpen = false;
        $this->resetInputFields();
    }

    private function resetInputFields()
    {
        $this->user_id = null;
        $this->name = '';
        $this->email = '';
        $this->password = '';
        $this->role = 'merchant';
        $this->phone = '';
    }

    public function editUser($id)
    {
        $user = User::findOrFail($id);
        $this->user_id = $id;
        $this->name = $user->name;
        $this->email = $user->email;
        $this->role = $user->role;
        $this->phone = $user->phone;
        
        $this->isModalOpen = true;
    }

    public function saveUser()
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $this->user_id,
            'role' => 'required|in:merchant,livreur',
            'phone' => 'nullable|string',
        ];

        if (!$this->user_id) {
            $rules['password'] = 'required|min:6';
        }

        $this->validate($rules);

        $data = [
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
        ];

        if ($this->password) {
            $data['password'] = Hash::make($this->password);
        }

        User::updateOrCreate(['id' => $this->user_id], $data);

        session()->flash('message', $this->user_id ? 'User Updated Successfully.' : 'User Created Successfully.');

        $this->closeModal();
    }

    public function deleteUser($id)
    {
        User::find($id)->delete();
        session()->flash('message', 'User Deleted Successfully.');
    }

    public function render()
    {
        return view('livewire.admin-user-management')
            ->layout('layouts.admin-iframe');
    }
}
