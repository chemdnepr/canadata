import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { nocData } from './data/noc_year_count';
import { nocs } from './data/nocs';
import { provinces } from './data/provinces';
import Select, { StylesConfig } from 'react-select';

const nocOptions = nocs.map(noc => ({
  label: `${noc.noc} - ${noc.class_title}`,
  value: noc.noc
}));

export default class LmiaPositiveChart extends PureComponent {
  state: {
    selectedNocs: { label: string, value: string }[],
    selectedProvinces: { label: string, value: string }[],
    province: string
  } = {
    selectedNocs: [],
    selectedProvinces: [],
    province: ''
  }  
  getBarData = () => {
    const selectedNocs = [...this.state.selectedNocs];
    const selectedProvinces = [...this.state.selectedProvinces];
    const nocCount_2016 = nocData.reduce((acc, item) => {
      if (item.year === 2016 && (!selectedNocs.length || selectedNocs.find(noc => item.noc.startsWith(noc.value))) && (!selectedProvinces.length || selectedProvinces.find( province => province.value === item.province))) {
        acc += item.count;
      }
      return acc;
    }, 0);
    const nocCount_2017 = nocData.reduce((acc, item) => {
      if (item.year === 2017 && (!selectedNocs.length || selectedNocs.find(noc => item.noc.startsWith(noc.value))) && (!selectedProvinces.length || selectedProvinces.find( province => province.value === item.province))) {
        acc += item.count;
      }
      return acc;
    }, 0);
    const nocCount_2018 = nocData.reduce((acc, item) => {
      if (item.year === 2018 && (!selectedNocs.length || selectedNocs.find(noc => item.noc.startsWith(noc.value))) && (!selectedProvinces.length || selectedProvinces.find( province => province.value === item.province))) {
        acc += item.count;
      }
      return acc;
    }, 0);
    const nocCount_2019 = nocData.reduce((acc, item) => {
      if (item.year === 2019 && (!selectedNocs.length || selectedNocs.find(noc => item.noc.startsWith(noc.value))) && (!selectedProvinces.length || selectedProvinces.find( province => province.value === item.province))) {
        acc += item.count;
      }
      return acc;
    }, 0);
    const nocCount_2020 = nocData.reduce((acc, item) => {
      if (item.year === 2020 && (!selectedNocs.length || selectedNocs.find(noc => item.noc.startsWith(noc.value))) && (!selectedProvinces.length || selectedProvinces.find( province => province.value === item.province))) {
        acc += item.count;
      }
      return acc;
    }, 0);
    const nocCount_2021 = nocData.reduce((acc, item) => {
      if (item.year === 2021 && (!selectedNocs.length || selectedNocs.find(noc => item.noc.startsWith(noc.value))) && (!selectedProvinces.length || selectedProvinces.find( province => province.value === item.province))) {
        acc += item.count;
      }
      return acc;
    }, 0);
    const nocCount_2022 = nocData.reduce((acc, item) => {
      if (item.year === 2022 && (!selectedNocs.length || selectedNocs.find(noc => item.noc.startsWith(noc.value))) && (!selectedProvinces.length || selectedProvinces.find( province => province.value === item.province))) {
        acc += item.count;
      }
      return acc;
    }, 0);
    const data = [
      {
        name: '2016',
        positiveLMIA: nocCount_2016,
      },
      {
        name: '2017',
        positiveLMIA: nocCount_2017,
      },
      {
        name: '2018',
        positiveLMIA: nocCount_2018,
      },
      {
        name: '2019',
        positiveLMIA: nocCount_2019,
      },
      {
        name: '2020',
        positiveLMIA: nocCount_2020,
      },
      {
        name: '2021',
        positiveLMIA: nocCount_2021,
      },
      {
        name: '2022(1q)',
        positiveLMIA: nocCount_2022,
      }
    ]
    return data;
  }

  handleNoc = (selectedItems) => {    
    this.setState({ selectedNocs: selectedItems });
  }

  handleProvince = (selectedItems) => {    
    this.setState({ selectedProvinces: selectedItems });
  }

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <>
          <h1 className="lmia-chart-title text-center  text-lg font-medium">Issued Positive Labour Market Impact Assessment(LMIA)</h1>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 mb-4 lmia-chart-filter">
            <div className="flex flex-col">
              <label>Province</label>
              <Select 
                isMulti
                value={this.state.selectedProvinces}
                onChange={this.handleProvince}
                options={provinces} />
            </div>
            <div className="flex flex-col">
              <label>NOC</label>
              <Select 
                isMulti 
                value={this.state.selectedNocs}
                onChange={this.handleNoc}
                options={nocOptions} 
                />
            </div>
          </div>
          <BarChart
            width={600}
            height={300}
            data={this.getBarData(this.state.province)}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={20}
          >
            <XAxis dataKey="name" scale="point" padding={{ left: 30, right: 30 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="positiveLMIA" fill="#d6b327" background={{ fill: '#eee' }} />
          </BarChart>
        </>
      </ResponsiveContainer>
    );
  }
}
