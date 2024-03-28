const mongoose = require('mongoose')
const City = require('../models/City')
const axios = require('axios')
const cron = require('node-cron')

async function postData(city, resObj) {
    const findCity = await City.findOne({ city: city })
    if (!findCity) {
        let newCity = new City(resObj)
        await newCity.save()
        return
    } else {
        console.log('cidade já cadastrada')
    }
}



module.exports = {
    getCityByName: async (req, res) => {
        const { city } = req.query
        let cityToLowerCase = city.toLowerCase()

        if (!city) {
            return res.json({ error: 'Cidade não informada' })
        }
        try {
            //Primeiro, buscar no banco de dados 
            const data = await City.findOne({ city: city })
            if (data) {
                return res.json(data)
            } else { // Se não achar no banco de dados, buscar na api.
                let response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${city}&aqi=no`)

                let responseData = response.data

                const resObj = {
                    city: responseData.location.name.toLowerCase(),
                    region: responseData.location.region,
                    country: responseData.location.country,
                    temp_c: responseData.current.temp_c,
                    temp_f: responseData.current.temp_f,
                    local_time: responseData.location.localtime,
                    last_updated: responseData.current.last_updated
                }
                //União entre as rotas, se não existe já salva no banco de dados
                await postData(city, resObj)
                return res.status(200).json(resObj)
            }
        } catch (error) {
            console.log(error)
            return res.status(404).json(error)
        }
    }

}