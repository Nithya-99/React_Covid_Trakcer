import './App.css';
import CovidStat from './covidStat';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import { Line } from 'react-chartjs-2';
import './covidStat.css';

function App() {
  return (
    <div className="App">
      <div className="container">
        <CovidStat></CovidStat>
      </div>
    </div>
  );
}

export default App;
