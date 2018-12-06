import {ProgStageState} from './constants';

  const =(state=ProgStageState,action)=>{
      switch(action.type){
        case "PERIOD-TYPE":
        state={
          ...state,
          periodSelect:action.payload,
          lastValue:[...state.lastValue,action.payload],
          };
        break;
        case "GET_PERIODS":
        state={
          ...state,
          periodType:action.payload,
          isLoadedPeriod:true,
          periodtitle:"Select PeriodType"
         }
         break;
         case "AVAILPERIODVAL":
          state={
            ...state,
            availPeriodVal:action.payload,
            };
          break;
        case "AVAILPERIOD-OPTIONS":
        state={
          ...state,
          availPeriodOption:action.payload.availPeriodOption,
          selAvailPeriodOption:action.payload.selAvailPeriodOption,
          isLoadedAvailDS:true,
         };
        break;
        case "SEL-AVAILPERIOD-OPTIONS":
        if(action.payload.isperiodloaded==false){
            state={
              ...state,
              selectedAvailPeriodOption:[...state.selectedAvailPeriodOption,...action.payload.selectedAvailPeriodOption],
              notselAvailPeriodOption:action.payload.notselAvailPeriodOption,
              };}
          else{
            state={
              ...state,
              selectedAvailPeriodOption:action.payload.selectedAvailPeriodOption,
              notselAvailPeriodOption:[...state.notselAvailPeriodOption,...action.payload.notselAvailPeriodOption],
              };
          }
         break;
        case "GET_DATASETS":
        state={
          ...state,
          dataSets:action.payload,
          };
        break;
        case "AVAILDATASETS-OPTIONS":
        state={
          ...state,
          availdataSetsOption:action.payload.seldataSets,
          selavaildataSetsOption:action.payload.unseldataSets,
          isLoadedAvailDS:true,
         };
        break;
        case "SEL-AVAILDATASETS-OPTIONS":
          if(action.payload.isdatasetloaded==false)
          {
            state={
              ...state,
              selectedAvailDSOption:[...state.selectedAvailDSOption,...action.payload.selectedOption],
              unselectedAvailDSOption:action.payload.unselectedOption,
              };
          }
          
          else{
            state={
              ...state,
              selectedAvailDSOption:action.payload.selectedOption,
              unselectedAvailDSOption:[...state.unselectedAvailDSOption,...action.payload.unselectedOption],
              };
    
          }
          
          
         break;
      }
      return state;
    }
  
  export default dataReducer