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
        firstChar: action.firstChar.sort().filter((v, i) =>action.firstChar.indexOf(v) === i),
        }
        action.firstChar.sort().filter((v, i) =>action.firstChar.indexOf(v) === i).map(str => {
          var attr = action.attrPayload.trackedEntityInstances;
           state.attrValueUpdate[str] = [];
          for (var i = 0; i < attr.length; i++) {
            if (attr[i].attributes[0].value.charAt(0) == str)
            state.attrValueUpdate[str].push(attr[i].attributes[0].value)
          }
         })
      break;
      case 'UPDATE-SELLIST':
      state = {
        ...state,
        selectedList: action.payload
      }
      break;
    case 'UPDATE-TEI':
      state = {
        ...state,
        selectedAttrVal: [...state.selectedAttrVal,...action.payload]
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
      state = {
        ...state,
        inputConcentation: action.payload
      }
      break;
    case 'VALIDATE-FORM':
      state = {
        ...state,
        attrValueValidy: action.formTEIVal,
        testTypeValidy: action.formOptnSettTestVal,
        guidelineValidy: action.formQueueSetVal,
        sampleSourceValidy: action.formSampleSourceVal,
        inputBoxValidy: action.formConcenVal
      }
      break;
    case 'RECEIVED-RESPONSE':
      state = {
        ...state,
        formNameCreated: [...state.formNameCreated, action.formName],
      }
      break;

  }
  return state
}

export default dataElementReducer

