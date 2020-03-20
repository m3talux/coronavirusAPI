# Coronavirus API
Coronavirus live statistics API from trusted sources.

## Worldwide Historical Statistics 
[GET] - https://api-covid.herokuapp.com/worldwide

Historical data starts from February 2nd, 2020.

## Worldwide Today Statistics 
[GET] - https://api-covid.herokuapp.com/worldwide/today

## Countries Historical Statistics
[GET] - https://api-covid.herokuapp.com/countries

Historical data starts from March 20th, 2020.

## Countries Today Statistics
[GET] - https://api-covid.herokuapp.com/countries/today

## Countries Specific Date Statistics
[GET] - https://api-covid.herokuapp.com/countries/historical/<date>

Example: https://api-covid.herokuapp.com/countries/historical/2020-03-20

## Per Country Historical Statistics
[GET] - https://api-covid.herokuapp.com/countries/<country_name>

Example: https://api-covid.herokuapp.com/countries/China

## Per Country Today Statistics
[GET] - https://api-covid.herokuapp.com/countries/<country_name>/today

Example: https://api-covid.herokuapp.com/countries/China/today

## Per Country Specific Date Statistics
[GET] - https://api-covid.herokuapp.com/countries/<country_name>/<date>

Example: https://api-covid.herokuapp.com/countries/China/2020-03-20

### Credits
The web scraping functionality is a fork from https://github.com/javieraviles/covidAPI

This project adds access to historical data saved in a proper database and updated every 30 seconds.
