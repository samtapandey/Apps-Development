import React from 'react'
import { FormGroup, ControlLabel, FormControl, Button, HelpBlock } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getDataElementValues } from '../actions/serviceActions';
import { handleChange, handleInputChange, reloadFunc, handleListChange,handleSelListChange } from "./updateDataElements";
import { handleSubmit } from "./validate"
import { postDataElements } from '../actions/serviceActions';
import { updateFormInput, validateFormInput } from '../actions/dataElementAction';

class DataElements extends React.Component {
    constructor(props){
        super(props);
        this.state = { counter: [] };
        
    }

    componentDidMount() {
        this.props.getDataElementValues()
    }

    render() {
        var formdata = [];
        for (var i = 0; i <= this.props.dataElement.formNameCreated.length; i++) {
            for (var key in this.props.dataElement.formNameCreated[i])
                formdata.push(<tr><td>{key}</td><td>{this.props.dataElement.formNameCreated[i][key]}</td></tr>)
        }
        return (
            <div className="display-form">
                <div className="header"><span className="headertext">ANTIBIOTIC PANEL</span></div>
                <div className="body-content">
                    <div className="left-view">
                        <form onSubmit={event => handleSubmit(this, event)}>
                            <FormGroup controlId="formTEI" validationState={this.props.dataElement.attrValueValidy}>
                                <ControlLabel>ANTIBIOTICS</ControlLabel>
                                <ul class="grid" onClick={event => handleListChange(this, event, 'UPDATE-SELLIST')} >{this.props.dataElement.firstChar.map(str => <li value={str}><a><span>{str}</span></a></li>)}</ul>
                                <FormControl componentClass="select" onChange={event => handleSelListChange(this, event, 'UPDATE-TEI')} multiple>
                                    {(this.props.dataElement.selectedList != null) ?
                                        this.props.dataElement.attrValueUpdate[this.props.dataElement.selectedList].map((arr) => <option value={arr}>{arr}</option>) : false}
                                </FormControl>
                                {(this.props.dataElement.attrValueValidy === 'error') ? <HelpBlock>No antibiotic selected.</HelpBlock> : false}
                            </FormGroup>

                            <FormGroup controlId="formOptnSettTest" validationState={this.props.dataElement.testTypeValidy}>
                                <ControlLabel>TEST TYPE</ControlLabel>
                                <FormControl componentClass="select" onChange={event => handleChange(this, event, 'UPDATE-TESTTYPE')} multiple>
                                    {this.props.dataElement.testType.map((arr) => <option value={arr.value}>{arr.name}</option>)}
                                </FormControl>
                                {(this.props.dataElement.testTypeValidy === 'error') ? <HelpBlock>No test type selected.</HelpBlock> : false}
                            </FormGroup>

                            <FormGroup controlId="formQueueSet" validationState={this.props.dataElement.guidelineValidy}>
                                <ControlLabel>GUIDELINE</ControlLabel>
                                <FormControl componentClass="select" onChange={event => handleChange(this, event, 'UPDATE-GUIDELINE')} multiple>
                                    {this.props.dataElement.guideline.map((arr) => <option value={arr.value}>{arr.name}</option>)}
                                </FormControl>
                                {(this.props.dataElement.guidelineValidy == 'error') ? <HelpBlock>No guideline selected.</HelpBlock> : false}
                            </FormGroup>

                            <FormGroup controlId="formConcen" validationState={this.props.dataElement.inputBoxValidy}>
                                <ControlLabel>CONCENTRATION</ControlLabel>
                                <FormControl type="text" placeholder="Enter number" value={this.props.dataElement.inputConcentation} onChange={event => handleInputChange(this, event, 'UPDATE-CONCENTRATION')} disabled={false} />
                                {(this.props.dataElement.inputConcentation === '') ?
                                    <HelpBlock>No value entered.</HelpBlock> : false
                                }
                            </FormGroup>

                            <FormGroup controlId="formSampleSource" validationState={this.props.dataElement.sampleSourceValidy}>
                                <ControlLabel>SAMPLE SOURCE</ControlLabel>
                                <FormControl componentClass="select" onChange={event => handleChange(this, event, 'UPDATE-SOURCETYPE')} multiple>
                                    {this.props.dataElement.sampleSource.map((arr) => <option value={arr.value}>{arr.name}</option>)}
                                </FormControl>
                                {(this.props.dataElement.sampleSourceValidy === 'error') ? <HelpBlock>No sample source selected.</HelpBlock> : false}
                            </FormGroup>
                            <div><Button className="button" type="submit">Create</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button className="button" type="submit" onClick={reloadFunc}>Reset</Button></div>
                        </form>

                    </div>
                    <div className="right-view">
                        <div className="responsetable">
                            <table id="displayDE">
                                <tr>
                                    <th>DATA ELEMENTS</th>
                                    <th>RESPONSE</th>
                                </tr>
                                {formdata}
                            </table>
                        </div>
                    </div>
                </div></div>

        )

    }
}

const mapStateToProps = (state) => {
    return {
        dataElement: state.DataElement,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getDataElementValues: () => {
            dispatch(getDataElementValues())
        },
        updateFormInput: (param, selectedOption) => {
            dispatch(updateFormInput(param, selectedOption))
        },
        postDataElements: (data) => {
            dispatch(postDataElements(data))
        },
        validateFormInput: (formTEIVal, formOptnSettTestVal, formQueueSetVal, formSampleSourceVal, formConcenVal) => {
            dispatch(validateFormInput(formTEIVal, formOptnSettTestVal, formQueueSetVal, formSampleSourceVal, formConcenVal))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DataElements)
