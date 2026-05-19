<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Support\Str;

class MerchantApiSettings extends Component
{
    public $tokens = [];
    public $newToken = null;

    public function mount()
    {
        $this->loadTokens();
    }

    public function loadTokens()
    {
        $this->tokens = auth()->user()->tokens;
    }

    public function generateToken()
    {
        $tokenName = 'API-Key-' . now()->format('Y-m-d-His');
        $token = auth()->user()->createToken($tokenName);
        
        $this->newToken = $token->plainTextToken;
        $this->loadTokens();
        
        session()->flash('message', 'New API Key generated successfully! Please copy it now, it will not be shown again.');
    }

    public function deleteToken($tokenId)
    {
        auth()->user()->tokens()->where('id', $tokenId)->delete();
        $this->loadTokens();
        $this->newToken = null;
        session()->flash('message', 'API Key deleted successfully.');
    }

    public function render()
    {
        return view('livewire.merchant-api-settings');
    }
}
