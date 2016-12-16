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
    }.bind(this));//var that = this; replace bind(this)
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

