import React, { Component } from 'react';
import ReactHTMLTableToExcel from './htmlToExcel'

var arr1 = "";
var arr = [];

export default class ShowReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allPeriodsLoaded: false,
            dataLoaded: false,
            orgUnitsLoaded: false,
            allPeriods: undefined,
            compulsoryDECount: undefined,
            data: undefined,
            orgUnits: [],  
        }
        this.hierarchy = this.hierarchy.bind(this);
        this.closeReport = this.closeReport.bind(this);
        this.calculateDataStatus = this.calculateDataStatus.bind(this);
        this.calculateDataSummary = this.calculateDataSummary.bind(this);
        this.calculateUserDetails = this.calculateUserDetails.bind(this);
        this.binarySearch = this.binarySearch.bind(this);
    }

    componentDidMount() {
        const selectedStartPeriod = this.props.startYear + "" + this.props.startMonth + "01";
        const selectedEndPeriod = this.props.endYear + "" + this.props.endMonth + "01";
        const selectedEndPeriodWithEndDate = this.props.endYear + "" + this.props.endMonth + "" +
                                             new Date(this.props.endYear, this.props.endMonth, 0).getDate();
        let url1 = "../../../api/sqlViews/" + this.props.periodsSV +
                    "/data.json?paging=false&var=startDate:" + selectedStartPeriod +
                    ",endDate:" + selectedEndPeriod +
                    ",dataSetUidForLevel:" + this.props.dataSet;
        fetch(url1, {
            credentials: 'include'
        })
        .then(response1 => response1.json())
        .then(
            (result1) => {
                this.setState({
                    allPeriodsLoaded: true,
                    allPeriods: result1.rows
                })
            }
        )
        
        let url2 = "../../../api/sqlViews/" + this.props.getDataElementId +
                    "/data.json?paging=false&var=dataSetID:" + this.props.dataSet;
        fetch(url2, {
            credentials: 'include'
        })
        .then(response2 => response2.json())
        .then(
            (result2) => {
                let dataSetID = result2.rows[0]
                let url3 = "../../../api/sqlViews/" + this.props.categoryComboId +
                           "/data.json?paging=false&var=datasetelementid:"+ dataSetID[0];
                fetch(url3, {
                    credentials: 'include'
                })
                .then(response3 => response3.json())
                .then(
                    (result3) => {
                        this.setState({
                            compulsoryDECount: result3.height
                        })
                        
                        let url4 = "../../../api/sqlViews/" + this.props.orgUnitSV +
                                   "/data.json?paging=false&var=orgUnitId:"+ this.props.orgUnitID;
                        fetch(url4, {
                            credentials: 'include'
                        })
                        .then(response4 => response4.json())
                        .then(
                            (result4) => {
                                let orgnisationUnitIdCount = result4.rows[0];
                                
                                let url5 = "../../../api/sqlViews/" + this.props.sqlViewId +
                                           "/data.json?paging=false&var=dataSetUid:" + this.props.dataSet + 
                                           ",orgUnitUids:" + orgnisationUnitIdCount[0] + 
                                           ",startDate:" + selectedStartPeriod + ",endDate:" + selectedEndPeriodWithEndDate;
                                fetch(url5, {
                                    credentials: 'include'
                                })
                                .then(response5 => response5.json())
                                .then(
                                    (result5) => {
                                        this.setState({
                                            dataLoaded: true,
                                            data: result5.rows
                                        })
                                    }
                                )
                            }
                        )
                    }
                )
            }
        )

        let url5 = "../../../api/dataSets/" + this.props.dataSet +
                   ".json?paging=false&fields=organisationUnits[id,name";
        let url6 = "../../../api/25/organisationUnits/" + this.props.orgUnitID +
                   ".json?paging=false&includeDescendants=true&fields=id";
                   
        for (let i = 0; i < this.props.levels; i++) {
            url5 += ',parent[id,name';
        }
        url5 += ']';
        
        fetch(url5,{
            credentials:'include'
        })
        .then(response5 => response5.json())
        .then(
            (result5) => {
                fetch(url6,{
                    credentials:'include'
                })
                .then(response6 => response6.json())
                .then(
                    (result6) => {
                        let sortedOrganisationUnits = result6.organisationUnits.sort(function(a,b){
                                return a.id.localeCompare(b.id)
                            })
                            for (let orgUnit of result5.organisationUnits) {
                                this.binarySearch(sortedOrganisationUnits, orgUnit)
                            }
                        this.setState({
                            orgUnitsLoaded: true,
                            orgUnits: arr
                        });
                        arr = [];
                    }
                )
            }
        )
    }

    binarySearch(a, i) {
        const mid = Math.floor(a.length / 2);
        
        if (a[mid].id === i.id) {
            this.hierarchy(i,i.id)
            arr[arr1] = i.id
            arr1 = ''
        } else if (i.id.localeCompare(a[mid].id) === -1 && a.length > 1) {
           
            this.binarySearch(a.slice(0, mid), i);
        } else if (i.id.localeCompare(a[mid].id) === 1 && a.length > 1) {
           
            this.binarySearch(a.slice(mid, a.length), i);
        } else {
            return;
        }
    }

    hierarchy(data, orgId) {
        if (data.id !== this.props.orgUnitID) {
            arr1 = "/" + data.name + arr1;
            if (data.parent) {
                this.hierarchy(data.parent,orgId);
            }
        } else {
            arr1 = data.name + arr1;
        }
        return
    }

    closeReport(e) {
        e.preventDefault();
        this.props.closeReport(e)
    }

    calculateDataStatus(o, p, k) {
        let currentStatus = 0;
        let statusText = 0;
        let currentColor = "#FF9999";
        
        this.state.data.forEach(s => {
            if(s[3] === this.state.orgUnits[o] && s[1] === p[0]) {
                currentStatus = s[4]/this.state.compulsoryDECount*100;
                statusText = Math.ceil(currentStatus);
            }
        })
        if(currentStatus >= 75) {
            currentColor = "#66FF99";
        } else if(currentStatus >= 41) {
            currentColor = "#FF99FF";
        } else if(currentStatus >= 1) {
            currentColor = "#FFFF99";
        } else {
            currentColor = "#FF9999";
        }

        return <td key={k} className="" style={{background:`${currentColor}`, border: '1px solid #ccc'}}>{statusText}</td>
    }

    calculateDataSummary(o, p, k) {
        let currentStatus = 0;
        let currentColor = "#FFCCCC";
        let compulsoryDECount = 1;
        this.state.data.forEach(s => {
            if(s[3] === this.state.orgUnits[o] && s[1] === p[0]) {
                currentStatus= s[4]/compulsoryDECount;
            }
        });
        if(currentStatus >= 1) {
            currentColor = "#99FF99";
        }

        return <td key={k} style={{background:`${currentColor}`, border: '1px solid #ccc'}}></td>
    }

    calculateUserDetails(o, p, k) {
        let currentUser = "";
        let currentColor = "#eee";

        this.state.data.forEach(s => {
            if(s[0] === this.state.orgUnits[o] && s[1] === p[0]) {
                currentUser = s[2];
                currentColor = "#fff";
            }
        });
        return <td key={k} style={{background:`${currentColor}`, border: '1px solid #ccc'}}>{currentUser}</td>
    }


    render() {
        const { orgUnits, orgUnitsLoaded, dataLoaded, compulsoryDECount, allPeriods, allPeriodsLoaded } = this.state;
        const { orgUnitName, dataSetName, startMonthName, startYear, endMonthName, endYear, closeButtonName } = this.props;
        
        const duration = startMonthName.slice(0,3) + " " + startYear + " to " + endMonthName.slice(0,3) + " " + endYear;
        
        const totalPeriods = (allPeriodsLoaded) ? allPeriods.length+1 : null;
        
        const periodsHeader = (totalPeriods) ? allPeriods.map((period, key) => <th key={key} style={{whiteSpace: "nowrap"}} >{this.props.monthString(period.toString())}</th> ) : null;
        
        const orgUnitsRows = (orgUnitsLoaded && dataLoaded && periodsHeader && closeButtonName === 'dataStatus' ) ?
                            Object.keys(orgUnits).sort().map(
                                (orgUnit, key) => <tr key={key} ><td >{orgUnit}</td>{
                                    allPeriods.map(
                                        (period, key) => this.calculateDataStatus(orgUnit, period, key)
                                    )
                                }</tr>) :
                            (orgUnitsLoaded && dataLoaded && periodsHeader && closeButtonName === 'dataSummary' ) ?
                            Object.keys(orgUnits).sort().map(
                                (orgUnit, key) => <tr key={key} ><td >{orgUnit}</td>{
                                    allPeriods.map(
                                        (period, key) => this.calculateDataSummary(orgUnit, period, key)
                                    )
                                }</tr>) :
                            (orgUnitsLoaded && dataLoaded && periodsHeader && closeButtonName === 'userDetail' ) ?
                            Object.keys(orgUnits).sort().map(
                                (orgUnit, key) => <tr key={key} ><td >{orgUnit}</td>{
                                    allPeriods.map(
                                        (period, key) => this.calculateUserDetails(orgUnit, period, key)
                                    )
                                }</tr>) : null;
        const heading = (closeButtonName) ? ((closeButtonName === 'dataSummary') ? 'Data Summary - Data Set' :
                        (closeButtonName === 'dataStatus') ? 'Data Status - Data Set' :
                        (closeButtonName === 'userDetail') ? 'User Details - Latest' : null): null;
        
                        const totalDataElemntsRow = (totalPeriods && closeButtonName === 'dataStatus') ? <tr><td colSpan={totalPeriods}><b>Total Data Elements :</b> {compulsoryDECount}</td></tr> : null;
        
                        const colorRows = (totalPeriods && closeButtonName === 'dataStatus') ? 
                                            <tbody>
                                                <tr>
                                                    <td style={{background: '#66FF99'}}></td>
                                                    <td colSpan={totalPeriods-1}>Completed (75+)%</td>
                                                </tr>
                                                <tr>
                                                    <td style={{background: '#FF99FF'}}></td>
                                                    <td colSpan={totalPeriods-1}>Partially Completed (41-75)%</td>
                                                </tr>
                                                <tr>
                                                    <td style={{background: '#FFFF99'}}></td>
                                                    <td colSpan={totalPeriods-1}>Not Completed(1-40)%</td>
                                                </tr>
                                                <tr>
                                                    <td style={{background: '#FF9999'}}></td>
                                                    <td colSpan={totalPeriods-1}>Not Entered (0)%</td>
                                                </tr>
                                            </tbody> :
                                            (totalPeriods && closeButtonName === 'dataSummary') ?
                                            <tbody>
                                                <tr>
                                                    <td style={{background: '#99FF99'}}></td>
                                                    <td colSpan={totalPeriods-1}>Entered</td>
                                                </tr>
                                                <tr>
                                                    <td style={{background: '#FFCCCC'}}></td>
                                                    <td colSpan={totalPeriods-1}>Not Entered</td>
                                                </tr>
                                            </tbody> : null;
        const Table = (orgUnitsRows) ?
                        <table className="w3-table-all w3-small w3-bordered"
                        style={{width:'95%', margin: '0 auto',marginTop:'10px'}}
                               id="table">
                                <tr>
                                    <td  colSpan={totalPeriods}><b>Root Organisation Unit :</b> {orgUnitName}</td>
                                </tr>
                                <tr>
                                    <td colSpan={totalPeriods}><b>Data Set :</b> {dataSetName}</td>
                                </tr>
                                {totalDataElemntsRow}
                                <tr>
                                    <td colSpan={totalPeriods}><b>Duration :</b> {duration}</td>
                                </tr>
                                <tr>
                                    <td colSpan={totalPeriods}>&nbsp;</td>
                                </tr>
                                {colorRows}
                                <tr>
                                    <td colSpan={totalPeriods}>&nbsp;</td>
                                </tr>
                                <tr>
                                    <th style={{whiteSpace: "nowrap"}}>Organisation Units</th>
                                    {periodsHeader}
                                </tr>
                                {orgUnitsRows}
                        </table> :
                        <div className="w3-display-container" style={{color: "#ccc", height: "500px"}}>
                            <h1 className="w3-display-middle w3-animate-fading" >Loading...</h1>
                        </div> ;
        return(
            <div id="model" className="w3-modal">
                    
            <div className="w3-modal-content w3-card-4 w3-animate-zoom">
                <header className="w3-container w3-theme-d5"> 
                    <button name={closeButtonName}
                          onClick={this.closeReport}
                          className="w3-button w3-hover-text-red w3-theme-action w3-large w3-display-topright">&times;
                    </button>
                    <h6 className="w3-center">{heading}</h6>
                </header>
                <div className="w3-container w3-responsive" style={{height: "500px"}}>
                {Table }
                </div>
                <div className="w3-container w3-light-grey">
                    
                    {(Table) ?<ReactHTMLTableToExcel id="button-download-as-xls"
                                           className="w3-button w3-round w3-theme-action w3-right"
                                           buttonText="Download"
                                           table="table"
                                           filename="report"
                                           sheet="sheet1" />
                    : null }
                </div>
            </div>
        </div>
        );
    }
}