let recentFlag = false;
let a = [];
const Camper = React.createClass({

  getInitialState: function() {
    return {
      apidata: []
    };
  },

  getApi: function(api) {
        a=[];
    $.getJSON(api, function(data) {
      data.forEach(function(val){ 
        a.push(val);
      });
      this.setState({
        apidata: data
      });
    }.bind(this));//var that = this; replace bind(this);
  },

  handleClickRecent: function() {

    recentFlag = true;
    const reapi = 'https://fcctop100.herokuapp.com/api/fccusers/top/recent';
    this.getApi(reapi);
  },

  handleClickAlltime: function() {
    recentFlag = false;
    const allapi = 'https://fcctop100.herokuapp.com/api/fccusers/top/alltime';
    this.getApi(allapi);
  },

  handleChange: function(e) {
    var vale = e.target.value;
    this.setState({apidata:[]});
      
      var filtered = a.filter(function(val, ind){
      return val.username.toLowerCase().includes(vale);
    });
    
    this.setState({
      apidata: filtered
    });
    
  },

  componentDidMount: function() {
    this.handleClickRecent();
  },

  render: function() {
    var tableItems = this.state.apidata.map(function(val, ind) {
      var link = 'https://www.freecodecamp.com/' + val.username;
      return (
        <tr>			
					<th scope='row' className='number'>{ind+1}</th>
					<td className='username'><img src={val.img} alt='img'/><a href={link}  target='_blank'>{val.username}</a></td>
					<td className='rnumber'>{val.recent}</td>
					<td className='anumber'>{val.alltime}</td>
				</tr>
      );
    });

    return (
      <div>

				<header>
				<a href='https://www.freecodecamp.com' target='_blank'>
				<img className='fcc' src='https://s3.amazonaws.com/freecodecamp/freecodecamp_logo.svg' alt='freeCodeCamp logo'/>
				</a>
				<input type='text' placeholder='Search...' onChange={this.handleChange} />
        <span class="input-group-addon" class="form-control-feedback">
        <i class="fa fa-search"></i></span>
				</header>
				
				<div className='tarea container'>
				<h3>Camper Leaderboard</h3>
				
			
			<table className='table table-striped table-bordered table-hover'>
				<thead>
					<tr>
						<th className='num'>#</th>
						<th className='name'>Camper Name</th>
						<th className='recent' onClick={this.handleClickRecent}>Points in past 30 days {recentFlag ? '▼' : ''}</th>
						<th className='alltime' onClick={this.handleClickAlltime}>All time points {!recentFlag ? '▼' : ''}</th>
					</tr>
				</thead>
				<tbody>
					{tableItems}
				</tbody>		
			</table>
			
			</div>
			<footer>
			<p>code by <a className='bill' href='http://codepen.io/c0d0er/'>Bill</a></p>
			</footer>
			</div>
    );
  }
});

ReactDOM.render(<Camper />,
  document.getElementById('app'));


/*

const ROOT_URL = 'https://fcctop100.herokuapp.com/api/fccusers/top/';//fcc api entry

//user table row component
function User(props){
    return(
        <tr>
            <td>{props.rank}</td>
            <td className="text-center">
                <img 
                className="profile-img img-rounded" 
                src={props.user.img} 
                role="presentation"
                width="30"
                height="30"
                />
            </td>
            <td>
                <a href={`https://www.freecodecamp.com/${props.user.username}`} target="_blank">
                    {props.user.username}
                </a>
            </td>
            <td className="text-center">{props.user.alltime}</td>
            <td className="text-center">{props.user.recent}</td>
        </tr>
    )
}
//table leaderboard, returns multiples user rows
function LeaderBoard(props){
    return(
        <table className="table table-striped table-hover">
            <thead>
                <tr className="success">
                    <th>#</th>
                    <th colSpan="2">Fcc Camper</th>
                    <th className="text-center">Brownies (All Time)</th>
                    <th className="text-center">Brownies (Last 30 days) </th>
                </tr>
            </thead>
            <tbody>
                {props.users.map(user =>{
                   return <User 
                   key={user.username} 
                   user={user} 
                   rank={props.users.indexOf(user)+1}/>
                })}
            </tbody>
        </table>
    )
}
//select field component
function SelectField(props){
    return(
        <div className="input-group">
            <div className="input-group-addon">
                <span>Top 100 of </span>
            </div>
            <select
            className="form-control" 
            value={props.option} 
            onChange={props.handleSelect}
            >
                <option value="all">All time</option>
                <option value="latest">Last 30 days</option>
            </select>
        </div>
    )
}
//input search field component
function SearchBar(props){
    return(
        <div className="input-group">
            <input
            className="form-control" 
            value={props.term} 
            onChange={props.handleChange}
             placeholder="username"
            />
            <div className="input-group-addon">
                <span>
                    <i className="glyphicon glyphicon-search"></i>
                </span>
            </div>
        </div>
    )
}
//navbar, contains select and search field components
function NavBar(props){
    return(
        <div className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand" href="https://www.freecodecamp.com/adelmahjoub" target="_blank">
                        FCC Leaderboard
                    </a>
                </div>
                <div className="navbar-form navbar-right">
                    <SelectField 
                    option={props.option}
                    handleSelect={props.handleSelect}
                    />
                    <SearchBar 
                    term={props.term} 
                    handleChange={props.handleChange}
                    />
                </div>
            </div>
        </div>
    )
}
//main app
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      latestTop: null, //is an array of objects from fcc api response
      allTimeTop: null,//is an array of objects from fcc api response
      option: "all",//default option
      term: '' //default search term is empty
    }
    this.initLeaderBoard = this.initLeaderBoard.bind(this);//initial fcc api get request
    this.onOptionSelect = this.onOptionSelect.bind(this);//option select field handler
    this.onSearchChange = this.onSearchChange.bind(this);//search field input handler
    this.leaderBoardTable = this.leaderBoardTable.bind(this);//return either latest or all time leaderboard 
    this.filterCampers = this.filterCampers.bind(this);//return a filtered array by userbame
    this.initLeaderBoard();
  }
  //get request for latest
  getLatest(){
    return axios.get(`${ROOT_URL}recent`);
  }
  //get request for all time
  getAllTime(){
    return axios.get(`${ROOT_URL}alltime`);
  }
  //make both latest and all time requests, since we will use both
  initLeaderBoard(){
    axios.all([this.getLatest(), this.getAllTime()])
      .then(axios.spread((latest, allTime) =>{
        this.setState({
          latestTop: latest.data,
          allTimeTop: allTime.data
        })
      }))
  }
  //option select field handler
  //set new option state
  onOptionSelect(e){
    this.setState({option: e.target.value})
  }
  //search field input handler
  //set new term state
  onSearchChange(e){
    this.setState({term: e.target.value})
  }
  //return the LeaderBoard component if we got a response from fcc api
  leaderBoardTable(option){
    if(option === "all"){
      return this.state.allTimeTop ? 
        <LeaderBoard users={this.filterCampers(this.state.allTimeTop)}/> : '';
    } 
    return this.state.latestTop ?
      <LeaderBoard users={this.filterCampers(this.state.latestTop)}/> : '';
  }
  //filter an array by username
  filterCampers(arr){
    if(this.state.term === '') return arr;
    else return arr.filter(camper => {
      let patt = new RegExp(this.state.term, "i");
      return patt.test(camper.username);
    })
  }
  render() {
    return (
      <div className="container">
        <NavBar 
        option={this.state.option}
        term={this.state.term}
        handleChange={this.onSearchChange}
        handleSelect={this.onOptionSelect}
        />
        {
          this.leaderBoardTable(this.state.option)
        }
      </div>
    );
  }
}
ReactDOM.render(
  <App />,
  document.getElementById('root')
);



var Leaderboard = React.createClass({
  getInitialState: function(){
    return {data: []};
  },
  getData: function(url){
    $.ajax({
      url: url,
      dataType: "json",
      success: function(data){
        this.setState({data: data})
        console.log(this)
      }.bind(this)
    });
  },
  componentWillMount: function(){
    this.getData("https://fcctop100.herokuapp.com/api/fccusers/top/recent");
  },
  recentDays: function(){
    this.getData("https://fcctop100.herokuapp.com/api/fccusers/top/recent");
  },
  allTime: function(){
    this.getData("https://fcctop100.herokuapp.com/api/fccusers/top/alltime");
  },
  render: function(){
    var campersData = this.state.data.map(function(data, index){
      var url = "https://www.freecodecamp.com/"+data.username;
      return(
        <tr>
          <td>{index+1}</td>
          <td><img className="icon" src={data.img}/><a href={url}>{data.username}</a></td>
          <td>{data.recent}</td>
          <td>{data.alltime}</td>
        </tr>
      )
    });
    return(
    <div className="leaderboard">
      <table className="table table-bordered table-striped">
        <caption>Camper Leaderboard</caption>
        <thead>
          <tr>
            <th id="th1">Rank</th>
            <th id="th2">Camper</th>
            <th onClick={this.recentDays} id="th3">Points (Last 30 Days)</th>
            <th onClick={this.allTime} id="th4">Points (All Time)</th>
          </tr>
        </thead>
        <tbody className="data">
          {campersData}
        </tbody>
      </table>
    </div>
  );}
});

ReactDOM.render(
  <Leaderboard/>,
  document.getElementById("body")
);
*/




/*
var App = React.createClass({
  render: function() {
    return (
    	<Leaderboard />
    );
  }
});

var Leader = React.createClass({
	render: function() {
		return (
			<tr>
				<td>{this.props.rank}</td>
				<td><a href={"http://www.freecodecamp.com/" + this.props.name} target="_blank"><img src={this.props.image} /> {this.props.name}</a></td>
				<td>{this.props.recentPoints}</td>
				<td>{this.props.allPoints}</td>
			</tr>
		);
	}
});

var Leaderboard = React.createClass({
	getInitialState: function() {
		return {camper: [], sort: 'Recent'}
	},
	componentDidMount: function() {
		this.recent();
	},
	recent: function() {
		var self = this;
		$.get('http://fcctop100.herokuapp.com/api/fccusers/top/recent', function(data) {
			self.setState({camper: data, sort: 'Recent'});
		});
	},
	alltime: function() {
		var self = this;
		$.get('http://fcctop100.herokuapp.com/api/fccusers/top/alltime', function(data) {
			self.setState({camper: data, sort: 'AllTime'});
		});
	},
	render: function() {
		var leaderboard = this.state.camper.map(function(person, idx) {
			return (
				<Leader key={idx} rank={idx + 1} image={person.img} name={person.username} recentPoints={person.recent} allPoints={person.alltime} />
			);
		});
		return (
			<table className="hover">
				<thead>
					<tr>
						<th>#</th>
						<th>Camper Name</th>
						<th><a href="#" onClick={this.recent}>Points in past 30 days {this.state.sort === 'Recent' ? '▼' : ''}</a></th>
						<th><a href="#" onClick={this.alltime}>All time points {this.state.sort === 'AllTime' ? '▼' : ''}</a></th>
					</tr>
				</thead>
				<tbody>
					{leaderboard}
				</tbody>
			</table>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('freecodecamp'));
*/
