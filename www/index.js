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

    let today = new Date().toUTCString();
    $('#title').html('COVID-19 Statistics as of ' + today);

    window.setInterval(function () {
        today = new Date().toUTCString();
        $('#title').html('COVID-19 Statistics as of ' + today);
    }, 1000);

    const contextWorldwide = document.getElementById('worldwide-chart').getContext('2d');
    const contextOutlook = document.getElementById('outlook-chart').getContext('2d');
    const worldWideChart = new Chart(contextWorldwide, {
        type: 'line',
        data: getWorldwideChartData(null),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 20
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
    const outlookChart = new Chart(contextOutlook, {
        type: 'line',
        data: {
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    display: false,
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: false
                    },
                }]
            }
        }
    });

    $('#countries_table').DataTable({
        "ajax": {
            "url": "/countries/today",
            "dataSrc": ""
        },
        "order": [[1, "desc"]],
        "columns": [
            {"data": "country"},
            {"data": "cases"},
            {"data": "todayCases"},
            {"data": "deaths"},
            {"data": "todayDeaths"},
            {"data": "recovered"},
            {"data": "active"},
            {"data": "critical"},
            {"data": "casesPerOneMillion"}
        ]
    });

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
            getTodayExpectedCases(result);
            const chartData = getWorldwideChartData(result);
            worldWideChart.data.labels.push(...chartData.data.labels);
            worldWideChart.data.datasets.push(...chartData.data.datasets);
            worldWideChart.update();
        }
    });

    function getTodayExpectedCases(result) {
        if (result.length > 1) {
            const lastCasesValue = result[result.length - 2].cases;
            const variationPercentages = [];
            let totalVariation = 0;
            const step = 0.1;
            let importance = 1.0;
            for (let i = 1; i < result.length - 2; i++) {
                const outlook = getTodayOutlook(variationPercentages);
                variationPercentages[i - 1] =
                    (Math.abs(result[i].cases - result[i + 1].cases) / result[i].cases) * outlook * importance * 100;
                totalVariation += variationPercentages[i - 1];
                importance += step;
            }
            const outlook = getTodayOutlook(variationPercentages);
            generateOutlookChart(variationPercentages);
            const percentageIncrease = totalVariation / variationPercentages.length;

            if (percentageIncrease > 0) {
                $('#today-expected-cases').html(Math.round(lastCasesValue + (lastCasesValue * percentageIncrease / 100)));
                if (percentageIncrease > 0.0 && percentageIncrease < 5.0) {
                    $('#today-expected-cases').addClass('neutral');
                    $('#today-expected-cases-percentage').addClass('neutral');
                } else if (percentageIncrease >= 5.0) {
                    $('#today-expected-cases').addClass('negative');
                    $('#today-expected-cases-percentage').addClass('negative');
                }
                $('#today-expected-cases-percentage').html('(+' + percentageIncrease.toFixed(2) + '%)');
            } else {
                $('#today-expected-cases').html(lastCasesValue);
                $('#today-expected-cases-percentage').html('(0%)');
                $('#today-expected-cases').addClass('positive');
                $('#today-expected-cases-percentage').addClass('positive');
            }
            if (outlook > 0.9 && outlook < 1.1) {
                $('#today-outlook').html('NEUTRAL');
                $('#today-outlook').addClass('neutral');
                $('#today-outlook-value').addClass('neutral');
            } else if (outlook >= 1.1) {
                $('#today-outlook').html('NEGATIVE');
                $('#today-outlook').addClass('negative');
                $('#today-outlook-value').addClass('negative');
            } else if (outlook <= 0.9) {
                $('#today-outlook').html('POSITIVE');
                $('#today-outlook').addClass('positive');
                $('#today-outlook-value').addClass('positive');
            }
            $('#today-outlook-value').html('(' + (outlook >= 0 ? '+' : '') + outlook.toFixed(2) + ')');
        }
    }

    function getTodayOutlook(array) {
        if (array.length > 1) {
            let outlook = 1.0;
            const step = 1 / array.length;
            for (let i = 1; i < array.length; i++) {
                if (array[i] > array [i - 1]) {
                    outlook += step;
                } else if (array[i] < array[i - 1]) {
                    outlook -= step;
                }
            }
            return outlook;
        } else return 1;
    }

    function generateOutlookChart(array) {
        let outlook = 1.0;
        const step = 1 / array.length;
        const outlooks = [];
        for (let i = 1; i < array.length; i++) {
            if (array[i] > array [i - 1]) {
                outlook += step;
            } else if (array[i] < array[i - 1]) {
                outlook -= step;
            }
            outlooks.push({x: i, y: Math.round(outlook * 1000) / 1000});
        }
        outlookChart.data.datasets.push({
            label: 'Outlook',
            data: outlooks,
            fill: false,
            borderColor: [
                'rgb(82,200,255)',
            ],
            borderWidth: 2
        });
        outlookChart.update();
    }

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
                            'rgba(255,177,0,0.41)'
                        ],
                        borderColor: [
                            'rgb(255,249,146)',
                        ],
                        borderWidth: 1
                    }, {
                        label: 'Total Deaths',
                        data: data.map((d) => d.deaths),
                        backgroundColor: [
                            'rgba(255,24,1,0.4)'
                        ],
                        borderColor: [
                            'rgb(255,91,82)',
                        ],
                        borderWidth: 1
                    }, {
                        label: 'Total Recovered',
                        data: data.map((d) => d.recovered),
                        backgroundColor: [
                            'rgba(57,255,0,0.4)'
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
