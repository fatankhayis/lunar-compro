<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>
            How to Integrate Google Analytics in Laravel
        </title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
    </head>
    <body>
        <div class="container py-5">
            <div class="row">
                <h2 class="fs-4 fw-bold text-center mb-5">
                    How to Integrate Google Analytics in Laravel
                </h2>
                <div class="col-md-12">
                    <div class="card mb-3">
                        <div class="card-header">
                            <h2 class="fs-5 fw-bold">
                                Visitors and Page Views
                            </h2>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th style="width: 5%">No.</th>
                                            <th style="width: 65%">Page</th>
                                            <th style="width: 15%">Active Users</th>
                                            <th style="width: 15%">Page views</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($visitorsAndPageViews as $key => $data)
                                        <tr>
                                            <td>{{ ++$key }}</td>
                                            <td>{{ $data['pageTitle'] }}</td>
                                            <td>{{ $data['activeUsers'] }}</td>
                                            <td>{{ $data['screenPageViews'] }}</td>
                                        </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="card-header">
                            <h2 class="fs-5 fw-bold">
                                Total Visitors and Pageviews
                            </h2>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th style="width: 5%">No.</th>
                                            <th style="width: 65%">Date</th>
                                            <th style="width: 15%">Active Users</th>
                                            <th style="width: 15%">Page views</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($totalVisitorsAndPageViews as $key => $data)
                                        <tr>
                                            <td>{{ ++$key }}</td>
                                            <td>{{ $data['date'] }}</td>
                                            <td>{{ $data['activeUsers'] }}</td>
                                            <td>{{ $data['screenPageViews'] }}</td>
                                        </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="card-header">
                            <h2 class="fs-5 fw-bold">
                                Most Visited Pages
                            </h2>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th style="width: 5%">No.</th>
                                            <th style="width: 45%">Page</th>
                                            <th style="width: 35%">URL</th>
                                            <th style="width: 15%">Page views</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($mostVisitedPages as $key => $data)
                                        <tr>
                                            <td>{{ ++$key }}</td>
                                            <td>{{ $data['pageTitle'] }}</td>
                                            <td>{{ $data['fullPageUrl'] }}</td>
                                            <td>{{ $data['screenPageViews'] }}</td>
                                        </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="card-header">
                            <h2 class="fs-5 fw-bold">
                                Top Referrers
                            </h2>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th style="width: 5%">No.</th>
                                            <th style="width: 65%">Page Referrer</th>
                                            <th style="width: 30%">Page views</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($topReferrers as $key => $data)
                                        <tr>
                                            <td>{{ ++$key }}</td>
                                            <td>{{ $data['pageReferrer'] }}</td>
                                            <td>{{ $data['screenPageViews'] }}</td>
                                        </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="card-header">
                            <h2 class="fs-5 fw-bold">
                                User Types
                            </h2>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th style="width: 5%">No.</th>
                                            <th style="width: 65%">Type</th>
                                            <th style="width: 30%">Active Users</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($userTypes as $key => $data)
                                        <tr>
                                            <td>{{ ++$key }}</td>
                                            <td>{{ $data['newVsReturning'] }}</td>
                                            <td>{{ $data['activeUsers'] }}</td>
                                        </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="card-header">
                            <h2 class="fs-5 fw-bold">
                                Top Browsers
                            </h2>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th style="width: 5%">No.</th>
                                            <th style="width: 65%">Browser</th>
                                            <th style="width: 30%">Page Views</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($topBrowsers as $key => $data)
                                        <tr>
                                            <td>{{ ++$key }}</td>
                                            <td>{{ $data['browser'] }}</td>
                                            <td>{{ $data['screenPageViews'] }}</td>
                                        </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="card-header">
                            <h2 class="fs-5 fw-bold">
                                Top Countries
                            </h2>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th style="width: 5%">No.</th>
                                            <th style="width: 65%">Countries</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($topCountries as $key => $data)
                                        <tr>
                                            <td>{{ ++$key }}</td>
                                            <td>{{ $data['country'] }}</td>
                                        </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
            </div>
        </div>
    </body>
</html>