$(function () {
    Date.prototype.toYMD = Date_toYMD;

    /**
     * @return {string}
     */
    function Date_toYMD() {
        let year, month, day;
        year = String(this.getFullYear());
        month = String(this.getMonth() + 1);
        if (month.length === 1) {
            month = "0" + month;
        }
        day = String(this.getDate());
        if (day.length === 1) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day;
    }

    const context = document.getElementById('worldwide-chart').getContext('2d');
    let chart = new Chart(context, {
        type: 'line',
        data: getWorldwideChartData(null),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    $('#countries_table').DataTable( {
        "ajax": {
            "url": "/countries/today",
            "dataSrc": ""
        },
        "order": [[ 1, "desc" ]],
        "columns": [
            { "data": "country" },
            { "data": "cases" },
            { "data": "todayCases" },
            { "data": "deaths" },
            { "data": "todayDeaths" },
            { "data": "recovered" },
            { "data": "active" },
            { "data": "critical" },
            { "data": "casesPerOneMillion" }
        ]
    } );

    $.ajax({
        url: "/worldwide/today",
        success: function (result) {
            const active = result.cases - (result.deaths + result.recovered)
            $("#today-cases").html(result.cases);
            $("#today-active").html(active);
            $("#today-deaths").html(result.deaths);
            $("#today-recovered").html(result.recovered);
            $("#today-active-percentage").html('(' + (active / result.cases * 100).toFixed(1) + '%)');
            $("#today-deaths-percentage").html('(' + (result.deaths / result.cases * 100).toFixed(1) + '%)');
            $("#today-recovered-percentage").html('(' + (result.recovered / result.cases * 100).toFixed(1) + '%)');
        }
    });

    $.ajax({
        url: "/worldwide",
        success: function (result) {
            const chartData = getWorldwideChartData(result);
            chart.data.labels.push(...chartData.data.labels);
            chart.data.datasets.push(...chartData.data.datasets);
            chart.update();
        }
    });

    function getWorldwideChartData(data) {
        let chartData;
        if (!data) {
            chartData = {
                data: {
                    labels: [],
                    datasets: []
                }
            };

        } else {
            chartData = {
                data: {
                    labels: data.map((d) => new Date(d.created).toYMD()),
                    datasets: [{
                        label: 'Total Cases',
                        data: data.map((d) => d.cases),
                        backgroundColor: [
                            'rgba(255,206,0,0.25)'
                        ],
                        borderColor: [
                            'rgb(255,249,146)',
                        ],
                        borderWidth: 1
                    }, {
                        label: 'Total Deaths',
                        data: data.map((d) => d.deaths),
                        backgroundColor: [
                            'rgba(255,3,0,0.25)'
                        ],
                        borderColor: [
                            'rgb(255,91,82)',
                        ],
                        borderWidth: 1
                    }, {
                        label: 'Total Recovered',
                        data: data.map((d) => d.recovered),
                        backgroundColor: [
                            'rgba(57,255,0,0.25)'
                        ],
                        borderColor: [
                            'rgb(141,255,102)',
                        ],
                        borderWidth: 1
                    }]
                }
            };
        }
        return chartData;
    }
});
