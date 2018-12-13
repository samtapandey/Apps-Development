
export const handleChange = (thiz, e, param) => {
    var options = e.target.options;
    var selectedOption = [], sel = [];
    for (var i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
            selectedOption = [...selectedOption, options[i].label]
        }}
    if(param==="UPDATE-TESTTYPE")
    document.getElementById("formConcen").disabled = (selectedOption.length==1 && selectedOption[0]==="MIC")?true:false;
    thiz.props.updateFormInput(param, selectedOption)
}
export const handleSelListChange = (thiz, e, param) => {
    var options = e.target.options;
    var selectedOption = [], sel = [];
    for (var i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
            selectedOption = [...selectedOption, options[i].label]
        }}
    if(param==="UPDATE-TESTTYPE")
    document.getElementById("formConcen").disabled = (selectedOption.length==1 && selectedOption[0]==="MIC")?true:false;
    thiz.props.updateFormInput(param, selectedOption)
}

export const reloadFunc = () => {
    window.location.reload();
}

export const handleInputChange = (thiz, e, param) => {
    thiz.props.updateFormInput(param, e.target.value)
}


export function handleListChange(thiz,e,param){
    thiz.props.updateFormInput(param, e.target.textContent)
}

export const postdata = (thiz, e) => {
    var fromData = [],
    concentration = (thiz.props.dataElement.inputConcentation != null) ? "_" + thiz.props.dataElement.inputConcentation : "";
     for (let attr of thiz.props.dataElement.selectedAttrVal) {
        for (let testtype of thiz.props.dataElement.selectedTestType) {
            for (let guideline of thiz.props.dataElement.selectedGuideline) {
                for (let samsource of thiz.props.dataElement.selectedSampleSource) {

                    fromData.push({
                        aggregationType: "NONE",
                        domainType: "TRACKER",
                        name: attr + "_" + testtype + "_" + guideline + concentration + "_" + samsource,
                        shortName: attr + "_" + testtype + "_" + guideline + concentration + "_" + samsource,
                        formName: attr + "_" + concentration,
                        valueType: "TEXT",
                        attributeValues:[
                            {
                                value:true,
                                attribute:{
                                    id:'CSYk1xwiHbL',
                                    name:'dataElementType'
                                }
                            }
                        ]
                    },
                    {
                        aggregationType: "NONE",
                        domainType: "TRACKER",
                        name: attr + "_" + testtype + "_" + guideline + concentration + "_" + samsource + "_Result",
                        shortName: attr + "_" + testtype + "_" + guideline + concentration + "_" + samsource + "_Result",
                        formName: attr + "_" + concentration + "_Result",
                        valueType: "TEXT",
                        attributeValues:[
                            {
                                value:true,
                                attribute:{
                                    id:'CSYk1xwiHbL',
                                    name:'dataElementType'
                                }
                            }
                        ],
                        optionSet:{
                            id:'bSgpKbkbVGL'
                        }
                    });
                }
            }
        }
        fromData.push({
                        aggregationType: "NONE",
                        domainType: "TRACKER",
                        name: attr + "_Result",
                        shortName: attr + "_Result",
                        formName: attr + "_Result",
                        valueType: "TEXT",
                        attributeValues:[
                            {
                                value:true,
                                attribute:{
                                    id:'CSYk1xwiHbL',
                                    name:'dataElementType'
                                }
                            }
                        ],
                        optionSet:{
                            id:'bSgpKbkbVGL'
                        }
                    });
    }
    thiz.props.postDataElements(fromData);

}
