import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FaBars from 'react-icons/lib/fa/bars';
import Buttons from './buttons';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May', 
  'June',
  'July',
  'August',
  'Sepetember',
  'October',
  'November',
  'December'
];
const monthOptions = months.map((month, key)=> <option key={key} value={(key < 9) ? ("0"+(key+1)) : (key+1)}>{month}</option>);
const startingYear = 2000;
let currentYear = new Date().getFullYear();
let years = [];
for (let year = startingYear; year <= currentYear; year++) {
    years.push(year);
}

const yearOptions = years.map((year,key) => <option key={key} value={year}>{year}</option>);

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSetsLoaded: false,
            dataSets: [],
            dataSet: '',
            dataSetName: '',
            startMonth: '',
            startMonthName: '',
            startYear: '',
            endMonth: '',
            endMonthName: '',
            endYear: '',
            dataStatusSV: '',
            dataSummarySV: '',
            userDetails: '',
            orgUnitSV: '',
            periodsSV: '',
            categoryComboId: '',
            getDataElementId: '',
            sqlViewsLoaded: false    
        };
         this.closeSnackbar = this.closeSnackbar.bind(this);
         this.handleChange = this.handleChange.bind(this);
         this.openSidebar = this.openSidebar.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            dataSetName: (e.target.name === 'dataSet') ? e.target.options[e.target.selectedIndex].text : this.state.dataSetName,
            startMonthName: (e.target.name === 'startMonth') ? e.target.options[e.target.selectedIndex].text : this.state.startMonthName,
            endMonthName: (e.target.name === 'endMonth') ? e.target.options[e.target.selectedIndex].text : this.state.endMonthName,
        });    
    }

    componentDidMount() {
        fetch("../../../api/25/dataSets.json?paging=false",{
            credentials: 'include'
        })
        .then (response => response.json())
        .then (
            (result) => {
                this.setState({
                    dataSetsLoaded: true,
                    dataSets: result.dataSets
                });
            },
            (error) => {
                this.setState({
                    dataSetsLoaded: true,
                    error
                });
            }
        )

        fetch("../../../api/sqlViews.json?fields=[id,name]&paging=false", {
            credentials: 'include'
        })
        .then (response => response.json())
        .then (
            (result) => {
                let sqlViews = result.sqlViews;
                let dataStatusSV = false;
                let dataSummarySV = false;
                let userDetails = false;
                let periodsSV = false;
                let orgUnitSV = false;
                let categoryComboId = false;
                let getDataElementId = false;
                for (let i = 0; i < sqlViews.length; i++) {
                    switch (sqlViews[i].name) {
                        case "DS App Data Status":
                            dataStatusSV = true;
                            this.setState({
                                dataStatusSV: sqlViews[i].id
                            })
                            break;
                        case "DS App Data Summary":
                            dataSummarySV = true;
                            this.setState({
                                dataSummarySV: sqlViews[i].id
                            })
                            break;
                        case "DS App User Details":
                            userDetails = true;
                            this.setState({
                                userDetails: sqlViews[i].id
                            })
                            break;
                        case "DS App Periods":
                            periodsSV = true;
                            this.setState({
                                periodsSV: sqlViews[i].id
                            })
                            break;
                        case "GetOrgUnitId":
                            orgUnitSV = true;
                            this.setState({
                                orgUnitSV: sqlViews[i].id
                            })
                            break;
                        case "CategoryComboId":
                            categoryComboId = true;
                            this.setState({
                                categoryComboId: sqlViews[i].id
                            })
                            break;
                        case "getdataElementid":
                            getDataElementId = true;
                            this.setState({
                                getDataElementId: sqlViews[i].id
                            })
                            break;
                        default:
                            console.log("No sqlView found!")
                            break;
                    }
                    if (dataStatusSV && dataSummarySV && userDetails && periodsSV &&
                        orgUnitSV && categoryComboId && getDataElementId) {
                            this.setState({
                                sqlViewsLoaded: true
                            })
                            break;
                    }
                }
            }
        )
    }
    openSidebar() {
        this.props.openSidebar();
    }


    closeSnackbar() {
        document.getElementById("snackbar").style.visibility = "hidden" ;
    }
    

  render() {

      const { dataSets, dataSet, startMonth, dataStatusSV, dataSummarySV, userDetails, periodsSV, orgUnitSV, categoryComboId, getDataElementId, startYear, endMonth, endYear, dataSetName, startMonthName, endMonthName, dataSetsLoaded, sqlViewsLoaded } = this.state;
      const { orgUnitName, orgUnitID, levels } = this.props;
    
      const selectClassName = "w3-select w3-section w3-border w3-round-large";
      const dataSetOptions = (dataSetsLoaded) ? dataSets.map((dataSet,key) => <option key={key} value={dataSet.id}>{dataSet.displayName}</option>) : null;
      const Snackbar = () => {
          return (
            <div id="snackbar"
                 className="w3-display-container w3-margin-left w3-display-bottomleft w3-animate-bottom">
                <p>Start period must be less or equal to End period!</p>
                <span className="w3-display-topright w3-padding-small w3-text-red"
                      style={{cursor: "pointer"}}
                      onClick={this.closeSnackbar}>
                    &times;
                </span>
            </div>
          );
      }
      const ShowButtonsOrSnackbar = () => {
            return (
                (orgUnitID && dataSet && startMonth && startYear && endMonth && endYear && sqlViewsLoaded) ?
                    ((parseInt(startYear, 10) <= parseInt(endYear, 10)) ?
                ((parseInt(startYear, 10) === parseInt(endYear, 10)) ?
            ((parseInt(startMonth, 10) <= parseInt(endMonth, 10)) ?
        <Buttons orgUnitID={orgUnitID}
                 orgUnitName={orgUnitName}
                 dataSet={dataSet}
                 dataSetName={dataSetName}
                 levels={levels}
                 startYear={startYear}
                 startMonth={startMonth}
                 startMonthName={startMonthName}
                 endYear={endYear}
                 endMonth={endMonth}
                 endMonthName={endMonthName}
                 dataStatusSV={dataStatusSV}
                 dataSummarySV={dataSummarySV}
                 periodsSV={periodsSV}
                 orgUnitSV={orgUnitSV}
                 userDetails={userDetails}
                 categoryComboId={categoryComboId}
                 getDataElementId={getDataElementId}/> :
        <Snackbar />) :
        <Buttons orgUnitID={orgUnitID}
                 orgUnitName={orgUnitName}
                 dataSet={dataSet}
                 dataSetName={dataSetName}
                 levels={levels}
                 startYear={startYear}
                 startMonth={startMonth}
                 startMonthName={startMonthName}
                 endYear={endYear}
                 endMonth={endMonth}
                 endMonthName={endMonthName}
                 dataStatusSV={dataStatusSV}
                 dataSummarySV={dataSummarySV}
                 periodsSV={periodsSV}
                 orgUnitSV={orgUnitSV}
                 userDetails={userDetails}
                 categoryComboId={categoryComboId}
                 getDataElementId={getDataElementId} />) :
        <Snackbar />) : null
    );
  }
      
    return (
        <div>
            <div className="w3-container w3-card w3-theme-d5">
                <FaBars className=" w3-hide-large w3-xlarge"
                        onClick={this.openSidebar} />
                <h1 className="w3-center">Data Status Report</h1>
            </div>
            
            <form className="w3-panel w3-section w3-light-grey w3-padding-64 w3-card"
                  style={{maxWidth:800, margin:'auto'}} >
                  
                <div className="w3-row-padding">
                    <div className="w3-third w3-section">
                        <label className="w3-medium">Please select organisation unit:</label>
                    </div>
                    <div className="w3-twothird">
                        <input className="w3-input w3-section w3-border w3-light-grey w3-round-large"
                               type="text"
                               readOnly 
                               value={orgUnitName}
                               id={orgUnitID} />
                    </div>
                </div>
                
                <div className="w3-row-padding">
                    <div className="w3-third w3-section">
                        <label className="w3-medium">Please select data set:</label>
                    </div>
                    <div className="w3-twothird">
                        <select name="dataSet"
                                onChange={this.handleChange}
                                defaultValue="Select DataSet"
                                className={selectClassName} >
                            <option  disabled
                                     value="Select DataSet" >
                                Select DataSet
                            </option>
                            {dataSetOptions}
                        </select>
                    </div>
                </div>
                
                <div className="w3-row-padding">
                    <div className="w3-third w3-section">
                        <label className="w3-medium">Please select start period:</label>
                    </div>
                    <div className="w3-third">
                        <select name="startMonth"
                                onChange={this.handleChange}
                                defaultValue="Select Month"
                                className={selectClassName} >
                            <option  disabled
                                     value="Select Month" >
                                Select Month
                            </option>
                            {monthOptions}
                        </select>
                    </div>
                    <div className="w3-third">
                        <select name="startYear"
                                onChange={this.handleChange}
                                defaultValue="Select Year"
                                className={selectClassName} >
                            <option disabled
                                    value="Select Year" >
                                Select Year
                            </option>
                            {yearOptions}
                        </select>
                    </div>
                </div>
                
                <div className="w3-row-padding">
                    <div className="w3-third w3-section">
                        <label className="w3-medium">Please select end period:</label>
                    </div>
                    <div className="w3-third">
                        <select name="endMonth"
                                onChange={this.handleChange}
                                defaultValue="Select Month"
                                className={selectClassName} >
                            <option disabled
                                    value="Select Month">
                                Select Month
                            </option>
                            {monthOptions}
                        </select>
                    </div>
                    <div className="w3-third">
                        <select name="endYear"
                                onChange={this.handleChange}
                                defaultValue="Select Year"
                                className={selectClassName} >
                            <option disabled
                                    value="Select Year">
                                Select Year
                            </option>
                            {yearOptions}
                        </select>
                    </div>
                </div>
                <ShowButtonsOrSnackbar />
            </form>
        </div>
    );
  }
}

Form.propTypes = {
    orgUnitName: PropTypes.string.isRequired,
    orgUnitID: PropTypes.string.isRequired
}

Form.defaultProps = {
    orgUnitName: 'Uttar Pradesh',
    orgUnitID: 'v8EzhiynNtf'
}