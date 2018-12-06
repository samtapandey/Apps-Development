import { DataElementState } from './constants';

const dataElementReducer = (state = DataElementState, action) => {
  switch (action.type) {
    case 'GET-ENROLLMENTS':
      state = {
        ...state,
        attrValue: action.attrPayload.trackedEntityInstances.map(tei => {
          return { value: tei.trackedEntityInstance, name: tei.attributes[0].value };
        }),
        testType: action.testTypePayload.options.map(opVal1 => {
          return { value: opVal1.id, name: opVal1.name };
        }),
        guideline: action.guidelinePayload.options.map(opVal1 => {
          return { value: opVal1.id, name: opVal1.name };
        }),
        sampleSource: action.sampleSourcePayload.options.map(opVal1 => {
          return { value: opVal1.id, name: opVal1.name };
        }),
      }
      break;
    case 'UPDATE-TEI':
      state = {
        ...state,
        selectedAttrVal: action.payload
      }
      break;
    case 'UPDATE-TESTTYPE':
      state = {
        ...state,
        selectedTestType: action.payload
      }
      break;
    case 'UPDATE-GUIDELINE':
      state = {
        ...state,
        selectedGuideline: action.payload
      }
      break;
    case 'UPDATE-SOURCETYPE':
      state = {
        ...state,
        selectedSampleSource: action.payload
      }
      break;
      case 'UPDATE-CONCENTRATION':
      state={
        ...state,
        inputConcentation: action.payload
      }
      break;
      case 'VALIDATE-FORM':
      state={
        ...state,
        attrValueValidy:action.formTEIVal,
        testTypeValidy:action.formOptnSettTestVal,
        guidelineValidy:action.formQueueSetVal,
        sampleSourceValidy:action.formSampleSourceVal,
        inputBoxValidy: action.formConcenVal
      }
      break;
      case 'RECEIVED-RESPONSE':
      state={
        ...state,
        formNameCreated:[...state.formNameCreated,action.formName],
       }
      break;
  }
  return state
}

export default dataElementReducer

