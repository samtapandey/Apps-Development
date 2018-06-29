import React, { Component } from 'react';
import ShowReport from './showReport';

export default class Buttons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSummary: false,
            dataStatus: false,
            userDetail: false,
            closeReport: ''
        }
        this.showReport = this.showReport.bind(this);
        this.closeReport = this.closeReport.bind(this);
        this.monthString = this.monthString.bind(this);
    }

    showReport(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: true,
            closeReport: e.target.name
        });
    }

    closeReport(e) {
        this.setState({
            [e.target.name]: false,
            closeReport: ''
        });
    }

    monthString( date ){
        let month = parseInt(date.split("-")[1]);
        let year = date.split("-")[0];
        const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        return monthName[month-1] + " " + year;
        };

    render() {
        const { orgUnitID, orgUnitName, dataSet, dataSetName, levels, startYear,
                startMonth, startMonthName, endYear, endMonth, endMonthName,
                dataStatusSV, dataSummarySV, periodsSV, orgUnitSV, userDetails,
                categoryComboId, getDataElementId } = this.props;
        const { dataSummary, dataStatus, userDetail, closeReport } = this.state;
        const sqlViewId = (dataSummary) ? dataSummarySV :
                          (dataStatus) ? dataStatusSV :
                          (userDetail) ? userDetails : null;
        const className = "w3-button w3-theme-action w3-hover-theme w3-round";
        return(
            <div className="w3-row-padding ">
                <div className="w3-third w3-section">
                    <button name="dataSummary"
                            className={className}
                            style={{width:'100%'}}
                            onClick={this.showReport} >
                            Data Summary
                    </button>
                </div>
                <div className="w3-third w3-section">
                    <button name="dataStatus"
                            className={className}
                            style={{width:'100%'}}
                            onClick={this.showReport} >
                            Data Status
                    </button>
                </div>
                <div className="w3-third w3-section">
                    <button name="userDetail"
                            className={className}
                            style={{width:'100%'}}
                            onClick={this.showReport} >
                            User Details
                    </button>
                </div>
                { (sqlViewId) ? 
                    <ShowReport 
                        closeReport={this.closeReport}
                        closeButtonName={closeReport}
                        monthString={this.monthString}
                        orgUnitID={orgUnitID}
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
                        sqlViewId={sqlViewId}
                        periodsSV={periodsSV}
                        orgUnitSV={orgUnitSV}
                        categoryComboId={categoryComboId}
                        getDataElementId={getDataElementId}
                    /> : null
                }
            </div>
        )
    }
}