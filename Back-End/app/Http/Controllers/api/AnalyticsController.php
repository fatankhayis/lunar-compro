<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Spatie\Analytics\Facades\Analytics;
use Spatie\Analytics\Period;

class AnalyticsController extends Controller
{
    private function analyticsIsConfigured(): bool
    {
        $propertyId = config('analytics.property_id');
        $credentialsPath = config('analytics.service_account_credentials_json');

        return !empty($propertyId) && is_string($credentialsPath) && file_exists($credentialsPath);
    }

    /**
     * Tentukan periode berdasarkan parameter range.
     */
    private function getPeriod(string $range): Period
    {
        return match ($range) {
            'week'  => Period::days(7),
            'month' => Period::days(30),
            default => Period::days(1),
        };
    }

    private function dummyAnalytics(string $range): array
    {
        $days = match ($range) {
            'week' => 7,
            'month' => 30,
            default => 1,
        };

        // Deterministic-ish seed per range/day to keep it stable-ish on refresh.
        $seed = crc32($range.'|'.Carbon::now()->toDateString());
        mt_srand($seed);

        $visitorsViews = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i)->toDateString();
            $activeUsers = mt_rand(10, 140);
            $pageViews = $activeUsers + mt_rand(20, 320);

            $visitorsViews[] = [
                'date' => $date,
                'activeUsers' => $activeUsers,
                'screenPageViews' => $pageViews,
            ];
        }

        $pages = [
            ['path' => 'home', 'screenPageViews' => mt_rand(200, 1200)],
            ['path' => 'about', 'screenPageViews' => mt_rand(80, 600)],
            ['path' => 'project', 'screenPageViews' => mt_rand(120, 900)],
        ];

        $browsers = [
            ['browser' => 'Chrome', 'screenPageViews' => mt_rand(300, 1500)],
            ['browser' => 'Safari', 'screenPageViews' => mt_rand(80, 500)],
            ['browser' => 'Firefox', 'screenPageViews' => mt_rand(40, 250)],
            ['browser' => 'Edge', 'screenPageViews' => mt_rand(60, 350)],
        ];

        $countries = [
            ['country' => 'Indonesia', 'screenPageViews' => mt_rand(300, 1600)],
            ['country' => 'Singapore', 'screenPageViews' => mt_rand(40, 240)],
            ['country' => 'Malaysia', 'screenPageViews' => mt_rand(30, 220)],
        ];

        $referrers = [
            ['pageReferrer' => 'Direct / None', 'screenPageViews' => mt_rand(200, 1200)],
            ['pageReferrer' => 'google.com', 'screenPageViews' => mt_rand(80, 600)],
            ['pageReferrer' => 'instagram.com', 'screenPageViews' => mt_rand(30, 240)],
        ];

        $activeUsers = collect($visitorsViews)->sum('activeUsers');

        return [
            'range' => $range,
            'active_users' => $activeUsers,
            'visitors_views' => $visitorsViews,
            'user_types' => [],
            'browsers' => $browsers,
            'pages' => $pages,
            'countries' => $countries,
            'referrers' => $referrers,
            'source' => 'dummy',
        ];
    }

    /**
     * Ambil semua data analitik (visitor, page view, browser, dsb).
     */
    public function getAnalytics(Request $request)
    {
        $range = $request->get('range', 'day');
        $period = $this->getPeriod($range);

        if (!$this->analyticsIsConfigured()) {
            // For local development, return dummy data so the admin dashboard can render.
            if (app()->environment('local')) {
                return response()->json([
                    'success' => true,
                    'message' => 'Using dummy analytics data (Google Analytics is not configured).',
                    'data' => $this->dummyAnalytics($range),
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'Analytics is not configured. Set ANALYTICS_PROPERTY_ID and place the service account credentials JSON at storage/app/analytics/service-account-credentials.json',
                'data' => [
                    'range' => $range,
                    'active_users' => 0,
                    'visitors_views' => [],
                    'user_types' => [],
                    'browsers' => [],
                    'pages' => [],
                    'countries' => [],
                    'referrers' => [],
                ],
            ], 200);
        }

        try {
            $visitorsAndPageViews = Analytics::fetchTotalVisitorsAndPageViews($period);
            $mostVisitedPages     = Analytics::fetchMostVisitedPages($period);
            $topBrowsers          = Analytics::fetchTopBrowsers($period);
            $userTypes            = Analytics::fetchUserTypes($period);
            $topCountries         = Analytics::fetchTopCountries($period);
            $referrers            = $this->getExternalReferrers($period);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch analytics data. Check analytics configuration and credentials.',
                'error' => $e->getMessage(),
                'data' => [
                    'range' => $range,
                    'active_users' => 0,
                    'visitors_views' => [],
                    'user_types' => [],
                    'browsers' => [],
                    'pages' => [],
                    'countries' => [],
                    'referrers' => [],
                ],
            ], 200);
        }

        $filteredPages = collect($mostVisitedPages)
            ->map(function ($page) {
                $url = $page['fullPageUrl'] ?? '';
                if (!str_starts_with($url, 'http')) {
                    $url = 'http://' . $url;
                }

                $parts = parse_url($url);
                $path = strtolower($parts['path'] ?? '/');

                if ($path === '/') {
                    $path = '/home';
                }

                $path = ltrim($path, '/');

                $page['fullPageUrl'] = ($parts['host'] ?? 'unknown') . '/' . $path;
                $page['path'] = $path;

                return $page;
            })
            ->filter(fn($page) => in_array($page['path'], ['home', 'about', 'project']))
            ->values();

        $activeUsers = $visitorsAndPageViews->sum('activeUsers');

        return response()->json([
            'success' => true,
            'data' => [
                'range'          => $range,
                'active_users'   => $activeUsers,
                'visitors_views' => $visitorsAndPageViews,
                'user_types'     => $userTypes,
                'browsers'       => $topBrowsers,
                'pages'          => $filteredPages,
                'countries'      => $topCountries,
                'referrers'      => $referrers,
            ],
        ]);
    }


    /**
     * Ambil referrer eksternal (mengabaikan domain sendiri).
     */
    private function getExternalReferrers(Period $period): array
    {
        $referrers = Analytics::get(
            $period,
            ['screenPageViews'],
            ['pageReferrer']
        )->toArray();

        $ownDomain = 'localhost:5173';

        return collect($referrers)
            ->filter(fn($ref) => !str_contains($ref['pageReferrer'], $ownDomain))
            ->values()
            ->all();
    }
}
