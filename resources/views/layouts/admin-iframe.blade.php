<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" style="margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden;">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>LogiMorocco Admin Console</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body x-data style="margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden;" class="relative font-sans antialiased bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
        <!-- Hidden form for iframe-initiated logout -->
        <form id="logout-form" method="POST" action="{{ route('logout') }}" style="display: none;">
            @csrf
        </form>

        <script>
            window.addEventListener('message', function(event) {
                if (event.data && event.data.action) {
                    if (event.data.action === 'logout') {
                        document.getElementById('logout-form').submit();
                    } else if (event.data.action === 'profile') {
                        window.location.href = "{{ route('profile') }}";
                    }
                }
            });
        </script>

        {{ $slot }}
    </body>
</html>
