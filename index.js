import express from 'express'
import fs from 'fs'
import { map, maxBy, minBy, sum } from 'lodash'
import math from 'mathjs'

const app = express()

app.get('/weather', (req, res) => {
  const data = readWeatherData().split('\n')
  const tempDeltas = calculateTemperatureDeltas(data)
  const deltas = map(tempDeltas, ([_, delta]) => parseInt(delta))

  let responseData = {
    maxSpreadDate: maxBy(tempDeltas, ([date, delta]) => delta)[0],
    minSpreadDate: minBy(tempDeltas, ([date, delta]) => delta)[0],
    averageSpread: sum(deltas) / deltas.length,
    standardDeviation: math.std(deltas)
  }

  res.send(responseData).status(200).end()
})

const readWeatherData = () => {
  return fs.readFileSync('./temps.csv', 'utf8')
}

const calculateTemperatureDeltas = (temperatures) => {
  return map(temperatures, (dailyTemperature) => {
    const [date, max, min] = dailyTemperature.split(',')
    return [date, Math.abs(max - min)]
  })
}

app.listen(5000)
