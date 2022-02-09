const express = require('express');
const app = new express();
const request = require('request');
const moment = require('moment')


app.use(express.static(__dirname+ '/public'))
app.use(express.json());
app.set('view engine', 'ejs');

let city ='bangalore';

app.use((req, res, next)=>{
    res.locals.moment = moment;
    next();
  });

app.get('/', (req,res)=>
{
    res.render('start');   
});

app.get('/:cityname', (req,res)=>
{
    city=req.params.cityname;
    
    let url =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d37c91d9e9c5215d800a648ba87b8f16`;
        
    request(url,(error, _response,body)=>{
        const weather_json =JSON.parse(body);
        console.log(weather_json);
        
        if(weather_json.cod ==='404')
        {
            res.send('Invalid request.');
            return;
        }

        
        var weather = {city:city,
        temperature: Math.round(weather_json.main.temp -273.15),
        description:weather_json.weather[0].description,
        icon:weather_json.weather[0].icon,
        windspeed: weather_json.wind.speed,
        temp_min : Math.round(weather_json.main.temp_min -273.15),
        temp_max : Math.round(weather_json.main.temp_max -273.15)
        };
        
        res.render('weather',{weather:weather});        
    });
});

app.listen(8000,()=> console.log('listening at port 8000'));