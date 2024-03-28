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

async function updateCityData(city) {
    try {

        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${city}&aqi=no`)
        const responseData = response.data
        const resObj = {
            city: responseData.location.name.toLowerCase(),
            region: responseData.location.region,
            country: responseData.location.country,
            temp_c: responseData.current.temp_c,
            temp_f: responseData.current.temp_f,
            local_time: responseData.location.localtime,
            last_updated: responseData.current.last_updated
        }
        // o upsert é usado para que se o registro não for achado conforme o filtro, será salvo um novo registro no banco de dados
        await City.updateOne({ city: city }, resObj, { upsert: true })
        console.log(`Dados de ${city} atualizados com sucesso!`)

    } catch (error) {
        console.error(`Erro ao atualizar os dados da cidade ${error}`)
    }
}
// horario utc para sincronizar com a maquina aws - 06:00 horário de brasilia
cron.schedule('0 9 * * *', async () => {
    const cities = await City.find()
    // para cada registro c achado em cities, atualizar os dados, passando como parametro a propriedade city de c
    for(const c of cities) {
        await updateCityData(c.city)
    }
})

module.exports = {
    getCityByName: async (req, res) => {
        const { city } = req.query
        let cityToLowerCase = city.toLowerCase()

        if (!city) {
            return res.json({ error: 'Cidade não informada' })
        }
        try {
            //Primeiro, buscar no banco de dados 
            const data = await City.findOne({ city: cityToLowerCase})
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
    },

    getDataFilter: async (req, res) => {
        const { initialDate, finalDate, city } = req.query

        if (!initialDate || !finalDate || !city) {
            return res.status(400).json({ error: 'Parametros ausentes. Verifique' })
        }

        try {
            const startDate = new Date(initialDate)
            const endDate = new Date(finalDate)

            // Se não for um numero, a data é inválida
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ error: 'Data inválida' })
            }

            let cityToLowerCase = city.toLowerCase()
            const filteredData = await City.find({
                city: cityToLowerCase,
                local_time: { // As datas devem ser maiores ou iguais que ${data} 00:00 e menores ou iguais que ${data} 23:59
                    $gte: `${initialDate} 00:00`,
                    $lte: `${finalDate} 23:59`
                }
            })

            if (filteredData.length === 0) {
                return res.status(400).json({ error: 'Não foram encontrados dados para os filtos' })
            }

            return res.status(200).json(filteredData)

        } catch (error) {
            return res.status(500).json({ error: 'Ocorreu um erro' })
        }

    },

}