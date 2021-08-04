import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './covidStat.css'
import $ from 'jquery';
import { Line } from 'react-chartjs-2';
import './covidStat.css';

export default function CovidStat() {
    const [covidData, setCovidData] = useState([])
    const [max, setMax] = useState()
    const [all, setAll] = useState(false)
    const [min, setMin] = useState(false)
    const [best, setBest] = useState(false)
    const [maxTable, setMaxTable] = useState(false)
    const confirmed = [];
    const country = [];
    const totalConfirm = [];
    const [dataChart, setDataChart] = useState({});
    const [ind,setInd] = useState(0);

    useEffect(() => {
        axios.get('https://api.covid19api.com/summary').then(res => {
            setCovidData(res.data.Countries);
            $(function () {
                $('#mytable').DataTable();
            });
        }).catch(err => {
            console.log(err)
        })
    }, []);

    const tableData = covidData.map((data) => {
        confirmed.push(data)
        totalConfirm.push(data.TotalConfirmed);
        country.push(data.Country)
        if (all) {
            return (
                <tr>
                    <td>{data.Country}</td>
                    <td>{data.TotalConfirmed}</td>
                    <td>{data.TotalConfirmed - data.TotalRecovered - data.TotalDeaths}</td>
                    <td>{data.TotalRecovered}</td>
                    <td>{data.TotalDeaths}</td>
                    <td>{data.NewConfirmed}</td>
                </tr>)
        }
    })


    function findMax() {
        const maxVal = Math.max.apply(Math, confirmed.map((o) => {
            return o.TotalConfirmed;
        }))
        setMax(maxVal)
        setMaxTable(true)
        setMin(false)
        setAll(false)
        setBest(false)
        setDataChart({})
    }

    const maxData = covidData.map((data) => {
        if (maxTable) {
            if (data.TotalConfirmed == max) {
                return (
                    <tr className='table-danger'>
                        <td>{data.Country}</td>
                        <td>{data.TotalConfirmed}</td>
                        <td>{data.TotalConfirmed - data.TotalRecovered - data.TotalDeaths}</td>
                        <td>{data.TotalRecovered}</td>
                        <td>{data.TotalDeaths}</td>
                        <td>{data.NewConfirmed}</td>
                    </tr>)
            }
        }

    })

    const minData = covidData.map((data) => {

        if (min) {
            console.log(data.NewConfirmed)
            if (data.NewConfirmed === 0) {
                return (
                    <tr>
                        <td>{data.Country}</td>
                        <td>{data.TotalConfirmed}</td>
                        <td>{data.TotalConfirmed - data.TotalRecovered - data.TotalDeaths}</td>
                        <td>{data.TotalRecovered}</td>
                        <td>{data.TotalDeaths}</td>
                        <td>{data.NewConfirmed}</td>
                    </tr>)
            }
        }
    })

    function showAll() {
        setAll(true)
        setMin(false)
        setMaxTable(false)
        setBest(false)
        setDataChart({})
        
    }
    function showMin() {
        setAll(false)
        setMin(true)
        setMaxTable(false)
        setBest(false)
        setDataChart({})
    }

    function showGraph() {
        const totalGraph = covidData.map((data) => {
            return [data.Country, data.TotalConfirmed];
        })

        const recoveredGraph = covidData.map((data) => {
            return [data.Country, data.TotalRecovered];
        })

        const deathGraph = covidData.map((data) => {
            return [data.Country, data.TotalDeaths];
        })

        const top20 = totalGraph.sort((a, b) => {
            return b[1] - a[1]
        }).slice(0, 20)

        const top20Recover = recoveredGraph.sort((a, b) => {
            return b[1] - a[1]
        }).slice(0, 20)

        const top20Death = deathGraph.sort((a, b) => {
            return b[1] - a[1]
        }).slice(0, 20)

        setDataChart({
            datasets: [
                {
                    label: 'Total Confirmed cases',
                    data: top20,
                    backgroundColor: '#0e327a',
                    borderColor: '#b3288b'
                },
                {
                    label: 'Recovered cases',
                    data: top20Recover,
                    backgroundColor: '#0b5c19',
                    borderColor: '#65e97b'
                },
                {
                    label: 'Death cases',
                    data: top20Death,
                    backgroundColor: '#75050b',
                    borderColor: '#e21538'
                }
            ]
        });
        setAll(false)
        setMin(false)
        setMaxTable(false)
        setBest(false)
    }

    function bestCase(){
        let ratio = 0
        let temp = 0
        
        covidData.forEach((data,index) =>{
            temp = data.TotalRecovered/data.TotalConfirmed
            if(temp > ratio){
                ratio = temp
                setInd(index)
            }
        })
        setBest(true)
        setAll(false)
        setMin(false)
        setMaxTable(false)
        setDataChart({})
    }
    const bestData = covidData.map((data, index) => {
        if (best) {
            if (index === ind) {
                console.log(ind)
                return (
                    <tr>
                        <td>{data.Country}</td>
                        <td>{data.TotalConfirmed}</td>
                        <td>{data.TotalConfirmed - data.TotalRecovered - data.TotalDeaths}</td>
                        <td>{data.TotalRecovered}</td>
                        <td>{data.TotalDeaths}</td>
                        <td>{data.NewConfirmed}</td>
                    </tr>)
            }
        }
    })
    return (
        <div className='bg'>
            <h1>Current covid status</h1>
            <button className='btn btn-primary' onClick={() => showAll(true)}>Show All</button> &nbsp; &nbsp;
            <button className='btn btn-success' onClick={() => showMin(true)}>Find Countries with minimum cases</button> &nbsp; &nbsp;
            <button className='btn btn-danger' onClick={() => findMax()}>Find Country with maximum cases</button> &nbsp; &nbsp;
            <button className='btn btn-info' onClick={() => showGraph()}>Graph</button> &nbsp; &nbsp;
            <button className='btn btn-warning' onClick={() => bestCase()}>Country that dealt Best</button>

            <div className='row justify-content-center'>
                <div className='col-md-8'>
                    <table id='mytable' className='table table-bordered table-hover'>
                        <thead className='thead-dark'>
                            <tr>
                                <th>Country</th>
                                <th>Confirmed</th>
                                <th>Active</th>
                                <th>Recovered</th>
                                <th>Deaths</th>
                                <th>New Confirmed</th>
                            </tr>
                        </thead>
                        <tbody className='tbody-light' id='all'>
                            {maxData}
                            {tableData}
                            {minData}
                            {bestData}
                        </tbody>
                    </table>
                </div>
            </div>
            <Line data={dataChart} />
        </div>
    )
}