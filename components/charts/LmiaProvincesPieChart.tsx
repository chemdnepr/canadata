import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { nocData } from './data/noc_year_count';
import { nocs } from './data/nocs';
import { provinces } from './data/provinces';
import Select from 'react-select';

const nocOptions = nocs.map(noc => ({
  label: `${noc.noc} - ${noc.class_title}`,
  value: noc.noc
}));



const COLORS = ['#99b186', '#429385', '#C72C65', '#b9db6b', '#ec8a91', '#f7c6b5', '#97b0bf', '#dc1b4b', '#76c6f0', '#f8c400', '#590101', '#f4ba80', '#9dcf59', '#7a8a93'];
const years = [2022,2021,2020,2019,2018,2017,2016].map(year => ({
  label: '' + year,
  value: '' + year
}));
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (percent > 0.03 ?
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text> : <text></text>
  );
};

export default class Example extends PureComponent {
  state: {
    selectedNocs: { label: string, value: string }[],
    selectedYears: { label: string, value: string }[],
    province: string,
    data: { name: string, value: string }[]
  } = {
      selectedNocs: [],
      selectedYears: [],
      province: '',
      data: []
    }
  componentDidMount() {
    this.calculateData();    
  }

  calculateData = () => {
    const nocNumbers = this.state.selectedNocs;
    const years = this.state.selectedYears;
    const filteredByNoc = nocNumbers.length ?  nocData.filter(noc => nocNumbers.find(n => noc.noc.startsWith(n.value))) : nocData;
    const filteredByYear = years.length ? filteredByNoc.filter(noc => years.find(y => noc.year === ~~y.value)) : filteredByNoc;
    const data = provinces.map(province => province.value).map(province => ({
      name: province,
      value: filteredByYear.filter(noc => noc.province === province).reduce((acc, noc) => { acc += noc.count; return acc; }, 0)
    }));
    this.setState({ data });
  }

  handleNoc = (selectedItems) => {
    this.setState({ selectedNocs: selectedItems }, () => this.calculateData());
  }

  handleYear = (selectedItems) => {
    this.setState({ selectedYears: selectedItems }, () => this.calculateData());
  }
  render() {
    return (
      <>
        <h1 className="text-center font-medium mt-4">LMIA ratio by Provinces</h1>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col">
            <label>Year</label>
            <Select
              isMulti
              value={this.state.selectedYears}
              onChange={this.handleYear}
              options={years} />
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
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
          <div className="text-left">
            {
              provinces.map((p, i) => (
                <div key={i} className="flex mb-1 mt-1 items-end">
                  <div className="cube mr-2 " style={{ backgroundColor: COLORS[i] }}></div>
                  <div className="text-xs">
                    {p.value} <span className="font-medium">({this.state.data.length ? this.state.data[i].value : ''})</span>
                  </div>
                </div>
              ))
            }
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={600} height={600}>
              <Pie
                data={this.state.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {this.state.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </>
    );
  }
}