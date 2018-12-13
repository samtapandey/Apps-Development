import { postdata } from "./updateDataElements";

export const handleSubmit = (thiz, e) => {
    e.preventDefault();

    if (handleValidation(thiz, e)) {
        postdata(thiz, e)
       } else {
        console.log("Form has errors.")
    }}

const handleValidation = (thiz, e) => {
    var formTEI=e.target[0].value,
        formOptnSettTest=e.target[1].value,
        formQueueSet=e.target[2].value,
        formConcen=e.target[3].value,
        formSampleSource=e.target[4].value,
        formConcenVal = '',formTEIVal='',formOptnSettTestVal='',
        formQueueSetVal='',formSampleSourceVal='',
        formIsValid = true;

    //Name
    //../^\d+$/;
    if (formTEI==='') {
        formTEIVal='error'
        formIsValid=false
    }
    if (formOptnSettTest==='') {
        formOptnSettTestVal='error'
        formIsValid=false
    }
    if (formQueueSet==='') {
        formQueueSetVal='error'
        formIsValid=false
    }
    if (formSampleSource==='') {
        formSampleSourceVal='error'
        formIsValid=false
    }
    if(e.target[3].disabled==false){
        if (formConcen===''||formConcen===null) {
            formConcenVal='error'
            formIsValid=false
        }}
    
    

    thiz.props.validateFormInput(formTEIVal,formOptnSettTestVal,formQueueSetVal,formSampleSourceVal,formConcenVal)

    return formIsValid
    }