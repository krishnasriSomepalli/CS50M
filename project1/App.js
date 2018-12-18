import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { vibrate } from './utils';

const colors = {
  primaryColor: '#3dc1d3',
  secondaryColor: '#34495e'
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  timer: {
    fontSize:81, 
    margin:20, 
    color:colors.primaryColor
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-around', 
    marginBottom:8 
  },
  textInput: {
    textAlign: 'center', 
    fontSize: 16, 
    color: '#63cdda'
  },
  button: { 
    width:80, 
    height:30, 
    backgroundColor:colors.secondaryColor, 
    justifyContent:"center"
  }
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { work_mins: 25, work_secs: 0, break_mins: 5, break_secs: 0 };
    this.changeMins = this.changeMins.bind(this);
    this.changeSecs = this.changeSecs.bind(this);
  }

  changeMins(value, id) {
    if (value === '') 
      value = '0';
    value = parseInt(value);

    if (id === '0') 
      this.setState({ work_mins: value });
    else 
      this.setState({ break_mins: value });
  }

  changeSecs(value, id) {
    if (value === '') 
      value = '0';
    value = parseInt(value);

    if (id === '0') 
      this.setState({ work_secs: value });
    else 
      this.setState({ break_secs: value });
  }

  render() {
    return (
      <View style={styles.container}>
        <Countdown work_mins={this.state.work_mins} work_secs={this.state.work_secs} break_mins={this.state.break_mins} break_secs={this.state.break_secs} />
        <Menu work_mins={this.state.work_mins} work_secs={this.state.work_secs} break_mins={this.state.break_mins} break_secs={this.state.break_secs} changeMins={this.changeMins} changeSecs={this.changeSecs} />
      </View>
    );
  }
}

class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'started',
      phase: 'work',
      timer: new Date( 0, 0, 0, 0, this.props.work_mins, this.props.work_secs, 0),
    };
    this.toggleStatus = this.toggleStatus.bind(this);
    this.togglePhase = this.togglePhase.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.reduceTimer = this.reduceTimer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.phase === 'work')
      this.setState({
        timer: new Date( 0, 0, 0, 0, nextProps.work_mins, nextProps.work_secs, 0),
      });
    else
      this.setState({
        timer: new Date( 0, 0, 0, 0, nextProps.break_mins, nextProps.break_secs, 0),
      });
  }

  componentDidMount() {
    this.timerID = setInterval(this.updateTimer, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  toggleStatus() {
    this.setState(function(state, props) {
      if (state.status === 'started')
        return {
          status: 'paused',
        };
      else
        return {
          status: 'started',
        };
    });
  }

  togglePhase() {
    this.setState(function(state, props) {
      if (state.phase === 'work')
        return {
          phase: 'break'
        };
      else
        return {
          phase: 'work'
        };
    });
  }

  updateTimer() {
    if (this.state.timer.toLocaleTimeString([], {minute: '2-digit', second: '2-digit'}) === '00:00:00') {
      vibrate();
      this.togglePhase();
      this.resetTimer();
    } 
    else if (this.state.status === 'started') 
      this.reduceTimer();
  }

  reduceTimer() {
    this.setState(function(state, props) {
      return { timer: new Date(state.timer.getTime() - 1000) };
    });
  }

  resetTimer() {
    this.setState(function(state, props) {
      if (state.phase === 'work')
        return {
          timer: new Date(0, 0, 0, 0, props.work_mins, props.work_secs, 0),
        };
      else
        return {
          timer: new Date(0, 0, 0, 0, props.break_mins, props.break_secs, 0),
        };
    });
  }

  render() {
    return (
      <View>
        <Text style={styles.timer}> {this.state.timer.toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })} </Text>
        <View style={{ flexDirection:"row", justifyContent:"space-around" }}>
          <Button onPress={this.toggleStatus} title={this.state.status === 'started' ? 'PAUSE' : 'RESUME'} />
          <Button onPress={this.resetTimer} title="RESET" />
        </View>
      </View>
    );
  }
}

function Menu(props) {
  return (
    <View style={{justifyContent:"flex-end", height:200}}>
      <MenuItem id={'0'} title={'WORK:'} mins={props.work_mins} secs={props.work_secs} changeMins={props.changeMins} changeSecs={props.changeSecs} />
      <MenuItem id={'1'} title={'BREAK:'} mins={props.break_mins} secs={props.break_secs} changeMins={props.changeMins} changeSecs={props.changeSecs} />
    </View>
  );
}

function MenuItem(props) {
  return (
    <View style={styles.menuItem}>
      <Text style={{ marginRight:28, fontSize:20, color:colors.secondaryColor }}> {props.title} </Text>
      <View style={{width:30}}>
        <TextInput style={styles.textInput} value={`${props.mins}`} onChangeText={text => props.changeMins(text, props.id)} />
      </View>
      <Text style={{color:colors.secondaryColor}}> mins </Text>
      <View style={{width:30, marginLeft:8}}>
        <TextInput style={styles.textInput} value={`${props.secs}`} onChangeText={text => props.changeSecs(text, props.id)} />
      </View>
      <Text style={{color:colors.secondaryColor}}> secs </Text>
    </View>
  );
}

function Button(props) {
  return (
    <View style={styles.button}>
      <TouchableOpacity onPress={props.onPress}>
        <Text style={{ color:"#ffffff", textAlign:"center" }}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
}
