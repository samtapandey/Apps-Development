
export const handleChange = (thiz, e, param) => {
    var options = e.target.options;
    var selectedOption = [],sel=[];
    for (var i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
            selectedOption = [...selectedOption, options[i].label]
            }
         }
        document.getElementById("formConcen").disabled = (selectedOption.length==1 && selectedOption[0]==="MIC")?true:false;
    
    thiz.props.updateFormInput(param, selectedOption)
}

export const handleInputChange = (thiz, e, param) => {
    thiz.props.updateFormInput(param, e.target.value)
}


export const postdata = (thiz, e) => {
    var  fromData = [],
        concentration = (thiz.props.dataElement.inputConcentation != null) ? "-" + thiz.props.dataElement.inputConcentation : "";

        thiz.props.dataElement.selectedAttrVal.forEach(attr=>
            thiz.props.dataElement.selectedTestType.forEach(testtype=>
                thiz.props.dataElement.selectedGuideline.forEach(guideline=>
                    thiz.props.dataElement.selectedSampleSource.forEach(samsource=>
                        fromData.push({
                            aggregationType:"NONE",
                            domainType:"TRACKER",
                            name: attr + "-" + testtype + "-" + guideline  + concentration +"-"+ samsource,
                            shortName: attr + "-" + testtype + "-" + guideline + concentration +"-"+ samsource,
                            formName: attr + "-" + testtype + "-" + guideline + concentration,
                            valueType: "TEXT"
                        })
                        
                        ))
                ))
    
    //fromData.push(de)
    thiz.props.postDataElements(fromData)

}
