import React, {Component} from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import './App.css';
import info from './data.json'

import { process, filterBy } from '@progress/kendo-data-query';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { DatePicker } from '@progress/kendo-react-dateinputs';

//Transform date into human readable format
info.forEach(record => {
    record.modified_date = new Date(record.modified_date);
});

class App extends Component {
  constructor(props) {
    super(props);
    const dataState = {
      skip: 0,
      take: 10,
      sort: [
        { field: "modified_date", dir: "asc" }
      ],
    }
    this.state = {
      dataState: dataState,
      filter: {
        logic: 'and',
        filters: [],
      },
      dataResult: process(info, dataState),
    }
  }

  //Hande all grid changes
  handleGridDataStateChange = (e) => {
    this.setState({
      dataResult: process(info, e.data),
      dataState: e.data,
      filter: e.data.filter
    });
  }

  //Handle custom filters change and apply them to state
  handleFilterChange = (date, amount) => {
    let filters = []
    if (date) {
      //Greater or equal is done, in order not to use library like moment to compare only date i.e. simplification purposes
      filters.push({
        field: 'modified_date',
        operator: 'gte',
        value: date,
      })
    }
    if (amount) {
      filters.push({
        field: 'amount',
        operator: 'eq',
        value: amount,
      })
    }
    this.setState({
      filter: {
        logic: 'and',
        filters: filters
      }
    })
  }

  render() {
    const { dataResult, filter, dataState } = this.state
    return (
      <div className="App">
        <Grid
          {...dataState}
          data={filterBy(dataResult.data, filter)}
          pageable
          sortable
          filterable
          reorderable
          filter={filter}
          onDataStateChange={this.handleGridDataStateChange}
          style={{ height: "600px" }}>
          <GridColumn field="order_id" title="Order ID"/>
          <GridColumn field="modified_date" title="Date"/>
          <GridColumn field="shipment_country" title="Country"/>
          <GridColumn field="amount" title="Amount"/>
          <GridColumn field="description" title="Description"/>
        </Grid>
        <ToolBar onApply={this.handleFilterChange}/>
      </div>
    );
  }
}

//Separate component for ToolBar
class ToolBar extends Component {
  state = {
    date: null,
    amount: 0
  }

  changeDate = (event) => {
      this.setState({ date: event.value });
  }

  changeAmount = (event) => {
      this.setState({ amount: event.value });
  }

  render(){
    return (
      <div className="ToolBar">
        <DatePicker
          format="yyyy-MM-dd"
          value={this.state.date}
          onChange={this.changeDate}
          />
        <Input
          value={this.state.amount}
          onChange={this.changeAmount}
          label="Amount"/>
        <Button primary={true} onClick={this.props.onApply.bind(this, this.state.date, this.state.amount)}>Apply</Button>
      </div>
    );
  }
}

export default App;
