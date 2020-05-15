import React from "react";
import './App.css';
import history from '../../history';

import Inicial from "./Inicial";
import login from "../Login/login";
import logout from '../logout/logout';
import register from '../register/register';
import Quizz from '../quizz/quizz'
import QuizzDo from '../quizz/quizzDo'
import QuizzPost from '../quizz/quizzPost'
import { Router, Route, Switch } from 'react-router-dom';
import MapTest5 from '../maps/MapTest5';
import MapTest6 from '../maps/MapTest6';
import QMCPost from '../quizz/QMCPost';
import QOPost from '../quizz/QOPost';
import QTFPost from '../quizz/QTFPost';
import Trail from '../trail/Trail';
import TrailList from '../trail/TrailList';
import Home from '../Home/Home';

export default class App extends React.Component {

    render() {
    return(
    <Router history={history}>
      <Switch>
      <Route exact path={"/"} component={Inicial} />
      <Route path={"/login"} component={login} />
      <Route path={"/logout"} component={logout}/>
      <Route path={"/register"} component={register} />
      <Route path={"/home"} component={Home} />
      <Route path={"/trail"} component={Trail}/>
      <Route path={"/postTrail"} component={MapTest5} />
      <Route path={"/viewlist"} component={TrailList}/>
      <Route path={"/askquizz"} component={Quizz}/>
      <Route path={"/quizz/create"} component={QuizzPost}/>
      <Route path={"/quizz/createQMC"} component={QMCPost}/>
      <Route path={"/quizz/createQO"} component={QOPost}/>
      <Route path={"/quizz/createQTF"} component={QTFPost}/>
      <Route path={"/quizz/start"} component={QuizzDo}/>
      </Switch>
    </Router>
        );
    }
}