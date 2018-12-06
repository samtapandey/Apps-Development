import React from 'react'

class DataElements extends React.Component {
    render() {

        var formdata = []
        for (var i = 0; i <= this.props.dataElement.formNameCreated.length; i++) {
            for (var key in this.props.dataElement.formNameCreated[i])
                formdata.push(<tr><td>{key}</td><td>{this.props.dataElement.formNameCreated[i][key]}</td></tr>)
        }


        return (
            <div className="display-form">
                <div className="header"><span className="headertext">CREATE DATA-ELEMENTS</span></div>
                <div className="body-content">
                    <div className="left-view">
                        <form onSubmit={event => handleSubmit(this, event)}>
                            <FormGroup controlId="formTEI" validationState={this.props.dataElement.attrValueValidy}>
                                <ControlLabel>ANTIBIOTICS</ControlLabel>
                                <FormControl type="text" placeholder="Program" />
                            </FormGroup>

                            <FormGroup controlId="formOptnSettTest" validationState={this.props.dataElement.testTypeValidy}>
                                <ControlLabel>TEST TYPE</ControlLabel>
                                <FormControl componentClass="select" placeholder="select">
                                    <option value="select">select</option>
                                    <option value="other">...</option>
                                </FormControl>
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
                            <Button className="button" type="submit">Create</Button>
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
                </div></div >

        )

    }

}

export default ProgramStage