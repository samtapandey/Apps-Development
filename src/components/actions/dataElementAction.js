

export function updateFormInput(param,selectedOption){
    return{
        type:param,
        payload:selectedOption
    }
}

export function validateFormInput(formTEIVal,formOptnSettTestVal,formQueueSetVal,formSampleSourceVal,formConcenVal){
    return{
        type:'VALIDATE-FORM',
        formTEIVal:formTEIVal,
        formOptnSettTestVal:formOptnSettTestVal,
        formQueueSetVal:formQueueSetVal,
        formSampleSourceVal:formSampleSourceVal,
        formConcenVal:formConcenVal
        
    }
}

