<?php

namespace App\Http\Controllers;

use Google\Protobuf\Internal\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Spatie\Analytics\Facades\Analytics;
use Spatie\Analytics\Period;

class DashboardController extends Controller
{
    private function analyticsIsConfigured(): bool
    {
        $propertyId = config('analytics.property_id');
        $credentialsPath = config('analytics.service_account_credentials_json');

        return !empty($propertyId) && is_string($credentialsPath) && file_exists($credentialsPath);
    }

    public function __invoke(Request $request)
    {
        if (!$this->analyticsIsConfigured()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Analytics is not configured. Set ANALYTICS_PROPERTY_ID and place the service account credentials JSON at storage/app/analytics/service-account-credentials.json',
            ], 200);
        }

        $visitorsAndPageViews       = Analytics::fetchVisitorsAndPageViews(Period::months(1));
        $totalVisitorsAndPageViews  = Analytics::fetchTotalVisitorsAndPageViews(Period::months(1));
        $mostVisitedPages           = Analytics::fetchMostVisitedPages(Period::months(1));
        $topReferrers               = Analytics::fetchTopReferrers(Period::months(1));
        $userTypes                  = Analytics::fetchUserTypes(Period::months(1));
        $topBrowsers                = Analytics::fetchTopBrowsers(Period::months(1));
        $topCountries               = Analytics::fetchTopCountries(Period::months(1));

        return response()->json([
            'status' => 'success',
            'visitorsAndPageViews' => $visitorsAndPageViews,
            'totalVisitorsAndPageViews' => $totalVisitorsAndPageViews,
            'mostVisitedPages' => $mostVisitedPages,
            'topReferrers' => $topReferrers,
            'userTypes' => $userTypes,
            'topBrowsers' => $topBrowsers,
            'topCountries' => $topCountries,
        ], 200);

    }

    public function table(Request $request)
    {
        if (!$this->analyticsIsConfigured()) {
            abort(503, 'Analytics is not configured.');
        }

        $visitorsAndPageViews       = Analytics::fetchVisitorsAndPageViews(Period::months(1));
        $totalVisitorsAndPageViews  = Analytics::fetchTotalVisitorsAndPageViews(Period::months(1));
        $mostVisitedPages           = Analytics::fetchMostVisitedPages(Period::months(1));
        $topReferrers               = Analytics::fetchTopReferrers(Period::months(1));
        $userTypes                  = Analytics::fetchUserTypes(Period::months(1));
        $topBrowsers                = Analytics::fetchTopBrowsers(Period::months(1));
        $topCountries               = Analytics::fetchTopCountries(Period::months(12));

        return view('welcome', compact('visitorsAndPageViews', 'totalVisitorsAndPageViews', 'mostVisitedPages', 'topReferrers', 'userTypes', 'topBrowsers', 'topCountries'));
    }

    public function testAnalytics()
    {
        // 🧠 Ganti dengan punya kamu dari GA4 Data Stream (bukan Universal Analytics!)
        $measurementId = 'G-32V3F0KJCW'; // Measurement ID kamu
        $apiSecret = '3IPfxubIQye1hkcYNaGNDg'; // API Secret kamu
        $clientId = uniqid('client_', true); // ID unik user

        // 🔹 Payload event yang dikirim ke Google Analytics
        $payload = [
            'client_id' => $clientId,
            'user_properties' => [
                'debug_device' => [
                    'value' => 'Laravel Server',
                ],
            ],
            'events' => [
                [
                    'name' => 'page_view',
                    'params' => [
                        'page_title' => 'Test Event Page',
                        'page_location' => 'http://127.0.0.1:8000/test-event-1',
                        // 'engagement_time_msec' => '100',
                    ],
                ],
            ],
        ];

        // 🔹 Kirim data ke Google Analytics menggunakan HTTP POST
        $response = Http::post("https://www.google-analytics.com/mp/collect?measurement_id={$measurementId}&api_secret={$apiSecret}", $payload);

        // 🔹 Cek respons dari Google Analytics
        if ($response->successful()) {
            return response()->json(['message' => 'Event sent successfully!'], 200);
        } else {
            return response()->json(['message' => 'Failed to send event.', 'error' => $response->body()], 500);
        }
    }
}
