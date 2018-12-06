import React from 'react'
import { Switch, Route } from 'react-router-dom'
import DataElements from '../DataElements'
import ProgramStage from '../ProgramStage'


const MainPage = () => (
  <main className='main'>
    <Switch>
      <Route path='/dataelements' component={DataElements}/>
      <Route path='/programstage' component={ProgramStage}/>
     </Switch>
  </main>
  )

export default MainPage